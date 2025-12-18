import type { Knex } from "knex";
import { constants } from "@lib";
const { TableName } = constants

export async function up(knex: Knex): Promise<void> {
  // Modify Users table: change status from string to boolean
  await knex.schema.alterTable(TableName.Users, (table) => {
    table.boolean('status').defaultTo(true).alter().comment('UserStatusEnum');
  });

}

export async function down(knex: Knex): Promise<void> {

  // Revert Users table changes - convert status back to string
  await knex.schema.alterTable(TableName.Users, (table) => {
    table.string('status').alter().comment('UserStatusEnum');
  });
}

