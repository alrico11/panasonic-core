import type { Knex } from "knex";
import { constants } from "@lib";
const { TableName } = constants;


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable(TableName.Partners, (table) => {
        table.boolean("isNeedUpdatePassword").defaultTo(true).comment("flag to indicate if partner needs to update password");
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable(TableName.Partners, (table) => {
        table.dropColumn("isNeedUpdatePassword");
    });
}
