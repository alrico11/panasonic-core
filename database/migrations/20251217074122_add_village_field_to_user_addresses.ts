import type { Knex } from "knex";
import { constants } from "@lib";
const { TableName } = constants

export async function up(knex: Knex): Promise<void> {
  // Add village field to UserAddresses table
  await knex.schema.alterTable(TableName.UserAddresses, (table) => {
    table.string('village').nullable().comment('Village name');
  });
}

export async function down(knex: Knex): Promise<void> {
  // Remove village field from UserAddresses table
  await knex.schema.alterTable(TableName.UserAddresses, (table) => {
    table.dropColumn('village');
  });
}

