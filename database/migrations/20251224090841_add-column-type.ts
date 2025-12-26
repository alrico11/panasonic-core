import type { Knex } from "knex";
import { constants } from "@lib";
const { TableName } = constants;

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable(TableName.Warranties, (table) => {
       table.string('type').nullable().defaultTo(null).comment("flag to indicate warranty type customer or dealer");
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable(TableName.Warranties, (table) => {
        table.dropColumn('type');
    });
}

