import type { Knex } from "knex";
import { constants } from "@lib";
const { TableName } = constants;

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable(TableName.IrisCodes, (table) => {
        table.dropColumn("conditionCode");
        table.dropColumn("conditionDetail");
        table.dropColumn("symptomCode");
        table.dropColumn("symptomDetail");
        table.dropColumn("defectCode");
        table.dropColumn("defectDetail");
        table.dropColumn("repairCode");
        table.dropColumn("repairDetail");
        table.dropColumn("technicalRemark");
        table.dropColumn("productCondition");
        table.dropColumn("specialInstructionsToPartAdmin");

        table.string("code");
        table.string("regionalCategory");
        table.string("irisCodeName");

    })
    await knex.schema.alterTable(TableName.WorkOrders, (table) => {
        table.string("conditionCode");
        table.text("conditionDetail");
        table.string("symptomCode");
        table.text("symptomDetail");
        table.string("defectCode");
        table.text("defectDetail");
        table.string("repairCode");
        table.text("repairDetail");
        table.text("technicalRemark");
        table.text("productCondition");
        table.text("specialInstructionsToPartAdmin");
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable(TableName.IrisCodes, (table) => {
        table.string("conditionCode").notNullable();
        table.text("conditionDetail");
        table.string("symptomCode").notNullable();
        table.text("symptomDetail");
        table.string("defectCode");
        table.text("defectDetail");
        table.string("repairCode");
        table.text("repairDetail");
        table.text("technicalRemark");
        table.text("productCondition");
        table.text("specialInstructionsToPartAdmin");

        table.dropColumn("code");
        table.dropColumn("regionalCategory");
        table.dropColumn("irisCodeName");
    })
    await knex.schema.alterTable(TableName.WorkOrders, (table) => {
        table.dropColumn("conditionCode");
        table.dropColumn("conditionDetail");
        table.dropColumn("symptomCode");
        table.dropColumn("symptomDetail");
        table.dropColumn("defectCode");
        table.dropColumn("defectDetail");
        table.dropColumn("repairCode");
        table.dropColumn("repairDetail");
        table.dropColumn("technicalRemark");
        table.dropColumn("productCondition");
        table.dropColumn("specialInstructionsToPartAdmin");
    })
}

