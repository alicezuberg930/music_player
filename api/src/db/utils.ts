import { timestamp } from "drizzle-orm/mysql-core"
import { createHash, randomBytes } from "node:crypto"

export const createdAt = timestamp({ mode: 'date' })
    .defaultNow()
    .notNull()

export const updatedAt = timestamp({ mode: 'date' })
    .defaultNow()
    .$onUpdateFn(() => new Date())
    .notNull()

const alphabet = 'abcdefghijklmnopqrstuvwxyz'

const bufToBigInt = (buf: Buffer): bigint => {
    let v = 0n
    for (const i of buf) v = (v << 8n) + BigInt(i)
    return v
}

const randomLetter = (): string => {
    const idx = Number(randomBytes(1)[0]) % alphabet.length
    return alphabet[idx]
}

const createEntropy = (len = 24): string => {
    return randomBytes(len)
        .toString('base64')
        .replace(/[^a-zA-Z0-9]/g, '')
        .slice(0, len)
}

const hash = (input: string): string => {
    const hashBuf = createHash('sha3-512').update(input).digest()
    return bufToBigInt(hashBuf).toString(36)
}

export const createId = (): string => {
    const time = Date.now().toString(36)
    const salt = createEntropy(24)
    const hashInput = time + salt
    return `${randomLetter()}${hash(hashInput).substring(1, 24)}`
}