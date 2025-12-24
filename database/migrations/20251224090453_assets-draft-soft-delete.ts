import type { Knex } from "knex"
import { constants } from "@lib"
const { TableName } = constants

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable(TableName.Assets, (table) => {
        table.boolean("isDraft").defaultTo(true)
        table.boolean("isArchived").defaultTo(true)
    })
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable(TableName.Assets, (table) => {
        table.dropColumn("isDraft")
        table.dropColumn("isArchived")
    })
}
