import type { Knex } from "knex";
import { constants } from "@lib";
const { TableName } = constants

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable(TableName.WorkOrders, (table) => {
        table.timestamp('deletedAt').nullable().defaultTo(null).after('updatedAt');
        table.integer('deletedBy').nullable().defaultTo(null).after('deletedAt');
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable(TableName.WorkOrders, (table) => {
        table.dropColumn('deletedAt');
        table.dropColumn('deletedBy');
    });
}

