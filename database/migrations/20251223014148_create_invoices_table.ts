import type { Knex } from "knex";
import { constants } from "@lib";
const { TableName } = constants;

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable(TableName.Invoices, (table) => {
        table.increments("id").primary();
        table.string("invoiceNumber").notNullable().unique();
        table.integer("workOrderId").comment("WorkOrders.id (FK reference)").notNullable();
        table.decimal("totalAmount", 10, 2).notNullable();
        table.date("issueDate").nullable();
        table.date("dueDate").nullable();
        table.string("status").notNullable().comment("Draft, Issued, Paid, Cancelled");
        table.timestamp("createdAt").defaultTo(knex.fn.now());
        table.timestamp("updatedAt").nullable();
        table.integer("createdBy").nullable();
        table.integer("updatedBy").nullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists(TableName.Invoices);
}
