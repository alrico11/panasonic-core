import type { Knex } from "knex";
import { constants } from "@lib";
const { TableName } = constants;

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable(TableName.WorkOrders, (table) => {
        table.increments("id").primary();
        table.string("woNumber").notNullable();
        table.string("nscMalaysia").comment("NSC Malaysia identifier");
        table.integer("caseId").comment("Cases.id from transCXP"); 
        table.string("workType").comment("Type of work");
        table.string("jobType").comment("Type of job"); 
        table.integer("woStatusId").comment("WorkOrderStatus.id master-data").notNullable();
        table.integer("woSubStatusId").comment("WorkOrderSubStatus.id master-data").notNullable();
        table.integer("jobReasonId").comment("WorkOrderJobReason.id master-data").notNullable();
        table.string("priority").notNullable().comment("WorkOrderPriorityEnum");
        table.string("subject");
        table.timestamp("createdAt").defaultTo(knex.fn.now())
        table.timestamp("updatedAt")
        table.integer("createdBy");
        table.integer("updatedBy");
        table.text("description");
        table.integer("customerId").comment("Users.id (FK reference)").notNullable();
        table.integer("customerType").comment("CustomerTypesEnum").notNullable();
        table.integer("irisId").comment("IRIS.id master data").notNullable();
        table.dateTime("scheduleDate"); 
        table.integer("claimId").comment("Claims.id (FK reference)");
    });

    // IRIS Information
    await knex.schema.createTable(TableName.IrisCodes, (table) => {
        table.increments("id").primary();
        table.string("conditionCode").notNullable();
        table.text("conditionDetail");
        table.string("symptomGroup").notNullable();
        table.string("symptomGroup2").notNullable();
        table.string("symptomCode").notNullable();
        table.text("symptomDetail");
        table.string("defectCode");
        table.text("defectDetail");
        table.string("repairCode");
        table.text("repairDetail");
        table.text("technicalRemark");
        table.text("productCondition");
        table.text("specialInstructionsToPartAdmin");
        table.timestamp("createdAt").defaultTo(knex.fn.now())
        table.integer("createdBy");
    });

    // statuses and job reasons
    await knex.schema.createTable(TableName.WorkOrderStatus, (table) => {
        table.increments("id").primary();
        table.string("slug").notNullable().unique();
        table.string("name").notNullable().unique();
        table.timestamp("createdAt").defaultTo(knex.fn.now())
        table.integer("createdBy");
    });

    await knex.schema.createTable(TableName.WorkOrderSubStatus, (table) => {
        table.increments("id").primary();
        table.integer("workOrderStatusId").comment("WorkOrderStatus.id (FK reference)");
        table.string("slug").notNullable().unique();
        table.string("name").notNullable().unique();
        table.timestamp("createdAt").defaultTo(knex.fn.now())
        table.integer("createdBy");
    });

    await knex.schema.createTable(TableName.WorkOrderJobReason, (table) => {
        table.increments("id").primary();
        table.integer("workOrderSubStatusId").comment("WorkOrderSubStatus.id (FK reference)");
        table.string("slug").notNullable().unique();
        table.string("name").notNullable().unique();
        table.timestamp("createdAt").defaultTo(knex.fn.now())
        table.integer("createdBy");
    });

    // Claims
    await knex.schema.createTable(TableName.Claims, (table) => {
        table.increments("id").primary();
        table.string("claimNumber").notNullable().unique();
        table.integer("workOrderId").comment("WorkOrders.id (FK reference)");
        table.string("claimStatus").notNullable();
        table.decimal("claimAmount", 10, 2);
        table.timestamp("createdAt").defaultTo(knex.fn.now())
        table.integer("createdBy");
    });

    // charges 
    await knex.schema.createTable(TableName.Charges, (table) => {
        table.increments("id").primary();
        table.integer("workOrderId").comment("WorkOrders.id (FK reference)");
        table.string("name").notNullable();
        table.decimal("amount", 10, 2);
        table.string("currency").notNullable();
        table.timestamp("createdAt").defaultTo(knex.fn.now())
        table.integer("createdBy");
    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists(TableName.WorkOrders);
    await knex.schema.dropTableIfExists(TableName.Charges);
    await knex.schema.dropTableIfExists(TableName.Claims);
    await knex.schema.dropTableIfExists(TableName.WorkOrderJobReason);
    await knex.schema.dropTableIfExists(TableName.WorkOrderSubStatus);
    await knex.schema.dropTableIfExists(TableName.WorkOrderStatus);
    await knex.schema.dropTableIfExists(TableName.IrisCodes);
}

