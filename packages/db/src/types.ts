import type { ExtractTablesWithRelations } from "drizzle-orm"
import type {
    MySqlColumn,
    MySqlTableWithColumns,
    MySqlTransaction,
} from "drizzle-orm/mysql-core"
import type {
    MySql2Database,
    MySql2QueryResultHKT,
    MySql2PreparedQueryHKT
} from "drizzle-orm/mysql2"

export type Database =
    | MySql2Database
    | MySqlTransaction<
        MySql2QueryResultHKT,
        MySql2PreparedQueryHKT,
        Record<string, never>,
        ExtractTablesWithRelations<Record<string, never>>
    >

export type MySqlTable = MySqlTableWithColumns<{
    name: string
    schema: undefined
    columns: {
        id: MySqlColumn<
            {
                name: 'id'
                tableName: string
                dataType: 'string'
                columnType: 'MySqlVarChar'
                data: string
                driverParam: string
                notNull: boolean
                hasDefault: boolean
                isPrimaryKey: boolean
                isAutoincrement: boolean
                hasRuntimeDefault: boolean
                enumValues: [string, ...string[]]
                generated: undefined
            },
            object,
            object
        >
    }
    dialect: 'mysql'
}>