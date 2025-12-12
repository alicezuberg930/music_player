import mysql from "mysql2/promise"
import { drizzle } from "drizzle-orm/mysql2"
import type { MySql2Database } from "drizzle-orm/mysql2"
import { env } from "@yukikaze/lib/create-env"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import * as schema from './schemas'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const createMysqlClient = (): MySql2Database<typeof schema> => {
    const connection = mysql.createPool({
        host: env.MYSQL_HOST,
        port: env.MYSQL_PORT,
        user: env.MYSQL_USER,
        password: env.MYSQL_PASSWORD,
        database: env.MYSQL_DATABASE,
        ssl: {
            ca: fs.readFileSync(path.resolve(__dirname, '../../../ca.pem')),
            rejectUnauthorized: true
        },
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
    })

    return drizzle(connection, { casing: "snake_case", mode: "default", schema })
}

const globalForDrizzle = globalThis as unknown as {
    db: ReturnType<typeof createMysqlClient> | undefined
}

export const db: ReturnType<typeof createMysqlClient> = globalForDrizzle.db ?? createMysqlClient()

if (env.NODE_ENV !== "production") globalForDrizzle.db = db

export type * from '@/types'

export * from "drizzle-orm"