import mysql from "mysql2/promise"
import { drizzle } from "drizzle-orm/mysql2"
import type { ExtractTablesWithRelations } from "drizzle-orm"
import type {
    AnyMySqlColumn,
    MySqlTableWithColumns,
    MySqlTransaction,
} from "drizzle-orm/mysql-core"
import type {
    MySql2Database,
    MySql2QueryResultHKT,
    MySql2PreparedQueryHKT
} from "drizzle-orm/mysql2"
import env from "../lib/helpers/env"
import fs from "fs"
import * as schema from './schemas'

const createMysqlClient = () => {
    const connection = mysql.createPool({
        host: env.MYSQL_HOST,
        port: env.MYSQL_PORT,
        user: env.MYSQL_USER,
        password: env.MYSQL_PASSWORD,
        database: env.MYSQL_DATABASE,
        ssl: {
            ca: fs.readFileSync('ca.pem'),
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

export const db = globalForDrizzle.db ?? createMysqlClient()

if (env.NODE_ENV !== "production") globalForDrizzle.db = db

type Database = MySql2Database

type Table = MySqlTableWithColumns<{
    name: string
    schema: undefined
    dialect: "mysql"
    columns: { id: AnyMySqlColumn<{ data: string }> }
}>

type Transaction = MySqlTransaction<
    MySql2QueryResultHKT,
    MySql2PreparedQueryHKT,
    Record<string, never>,
    ExtractTablesWithRelations<Record<string, never>>
>

export type { Database, Table, Transaction }
export * from "drizzle-orm"