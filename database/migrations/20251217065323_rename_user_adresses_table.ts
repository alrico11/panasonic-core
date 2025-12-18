import { TableName } from "@lib/constants";
import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Rename UserAdresses table to UserAddresses
  await knex.schema.renameTable(TableName.UserAdresses, TableName.UserAddresses);
}

export async function down(knex: Knex): Promise<void> {
  // Revert rename: change UserAddresses back to UserAdresses
  await knex.schema.renameTable(TableName.UserAddresses, TableName.UserAdresses);
}

