import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import mysql from 'mysql2/promise'
import { fileURLToPath } from 'url'
import { env } from '@yukikaze/lib/create-env'

type JournalEntry = {
  idx: number
  version?: string
  tag: string
  breakpoints?: boolean
}

// Resolve path in ESM (no __dirname)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = path.resolve(__dirname, '..') // packages/db
const drizzleDir = path.join(root, 'drizzle')
const metaFile = path.join(drizzleDir, 'meta', '_journal.json')
const configFile = path.join(root, 'drizzle.config.ts')

function parseDbCredentialsFromConfig(tsContent: string) {
  const host = tsContent.match(/host:\s*['\"]([^'\"]+)['\"]/)?.[1] ?? env.MYSQL_HOST
  const portStr = tsContent.match(/port:\s*([0-9]+)/)?.[1] ?? env.MYSQL_PORT
  const port = Number(portStr)
  const user = tsContent.match(/user:\s*['\"]([^'\"]+)['\"]/)?.[1] ?? env.MYSQL_USER
  const password = tsContent.match(/password:\s*['\"]([^'\"]+)['\"]/)?.[1] ?? env.MYSQL_PASSWORD
  const database = tsContent.match(/database:\s*['\"]([^'\"]+)['\"]/)?.[1] ?? env.MYSQL_DATABASE
  return { host, port, user, password, database }
}

async function readJournal(): Promise<JournalEntry[]> {
  const raw = fs.readFileSync(metaFile, 'utf8')
  const j = JSON.parse(raw)
  return j.entries || []
}

function sha256File(filePath: string) {
  const data = fs.readFileSync(filePath)
  return crypto.createHash('sha256').update(data).digest('hex')
}

async function ensureMigrationsTable(conn: mysql.Connection) {
  await conn.query(`CREATE TABLE IF NOT EXISTS __drizzle_migrations (
    id BIGINT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    hash TEXT NOT NULL,
    created_at BIGINT
  )`)
}

async function getAppliedHashes(conn: mysql.Connection): Promise<Set<string>> {
  try {
    const [rows] = await conn.query("SELECT hash FROM __drizzle_migrations")
    const hashes = new Set<string>()
    // @ts-ignore
    for (const r of rows) if (r.hash) hashes.add(String(r.hash))
    return hashes
  } catch (e) {
    return new Set()
  }
}

function splitByBreakpoint(content: string) {
  // Drizzle uses "--> statement-breakpoint" markers split on them
  return content.split(/-->\s*statement-breakpoint/g).map(s => s.trim()).filter(Boolean)
}

function splitBySemicolon(content: string) {
  // naive split on semicolons followed by newline or end — sufficient fallback
  const parts = content.split(/\s*(?:\r?\n|$)/g).map(s => s.trim()).filter(Boolean)
  return parts.map(p => (p.trim().endsWith('') ? p.trim() : p.trim() + ''))
}

async function applyMigrationFile(conn: mysql.Connection, filePath: string): Promise<void> {
  const raw = fs.readFileSync(filePath, 'utf8')
  const hasBreakpoint = /-->\s*statement-breakpoint/.test(raw)

  if (hasBreakpoint) {
    const parts = splitByBreakpoint(raw)
    for (const part of parts) {
      if (!part) continue
      try {
        await conn.query(part)
      } catch (err: any) {
        throw { error: err, statement: part }
      }
    }
  } else {
    // try running whole file at once (multiple statements enabled on connection)
    try {
      await conn.query(raw)
    } catch (err) {
      // fallback: split by semicolon and run individually to find failing statement
      const statements = splitBySemicolon(raw)
      for (const stmt of statements) {
        try {
          await conn.query(stmt)
        } catch (e: any) {
          throw { error: e, statement: stmt }
        }
      }
    }
  }
}

(async () => {
  // parse config
  const ts = fs.readFileSync(configFile, 'utf8')
  const creds = parseDbCredentialsFromConfig(ts)

  // connect with multipleStatements enabled for bulk execution
  const conn = await mysql.createConnection({
    host: creds.host,
    port: creds.port,
    user: creds.user,
    password: creds.password,
    database: creds.database,
    multipleStatements: true,
  })

  try {
    await ensureMigrationsTable(conn)
    const applied = await getAppliedHashes(conn)
    const entries = await readJournal()

    for (const e of entries) {
      const tag = e.tag
      const fileName = `${tag}.sql`
      const filePath = path.join(drizzleDir, fileName)

      if (!fs.existsSync(filePath)) {
        console.error(`Migration file not found: ${fileName} — stopping.`)
        process.exit(2)
      }

      const hash = sha256File(filePath)
      if (applied.has(hash)) {
        console.log(`[SKIP] ${e.idx} ${tag} (already applied)`)
        continue
      }

      console.log(`[APPLY] ${e.idx} ${tag} -> executing ${fileName}`)
      try {
        await applyMigrationFile(conn, filePath)
      } catch (info: any) {
        console.error('\nMigration failed while applying:', fileName)
        console.error('Failing statement (truncated 1000 chars):\n', String(info.statement).slice(0, 1000))
        console.error('DB error:', info.error && info.error.message ? info.error.message : info.error)
        console.error('\nStopping further migrations.')
        process.exit(3)
      }

      // mark applied by inserting hash
      const now = Date.now()
      await conn.query('INSERT INTO __drizzle_migrations (hash, created_at) VALUES (?, ?)', [hash, now])
      applied.add(hash)
      console.log(`[OK] ${e.idx} ${tag} applied and recorded`)
    }

    console.log('\nAll journal entries processed.')
  } catch (err: any) {
    console.error('Migration runner error:', err && err.message ? err.message : err)
    process.exit(4)
  } finally {
    await conn.end()
  }
})()
