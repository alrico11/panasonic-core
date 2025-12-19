import type { Knex } from "knex";
import { constants } from "@lib";
const { TableName } = constants

export async function up(knex: Knex): Promise<void> {
    // Add audit trail columns to Partners table
    await knex.schema.alterTable(TableName.Partners, (table) => {
        table.timestamp("createdAt").defaultTo(knex.fn.now()).comment("created timestamp");
        table.timestamp("updatedAt").nullable().comment("updated timestamp");
        table.timestamp("deletedAt").nullable().comment("soft delete timestamp");
        table.integer("createdBy").nullable().comment("Users.id (FK reference)");
        table.integer("updatedBy").nullable().comment("Users.id (FK reference)");
        table.integer("deletedBy").nullable().comment("Users.id (FK reference)");
    })
}

export async function down(knex: Knex): Promise<void> {
    // Drop audit trail columns from Partners table
    await knex.schema.alterTable(TableName.Partners, (table) => {
        table.dropColumn("createdAt");
        table.dropColumn("updatedAt");
        table.dropColumn("deletedAt");
        table.dropColumn("createdBy");
        table.dropColumn("updatedBy");
        table.dropColumn("deletedBy");
    })
}
