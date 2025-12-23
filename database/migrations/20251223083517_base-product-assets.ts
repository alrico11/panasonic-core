import type { Knex } from "knex";
import { constants } from "@lib";
const { TableName } = constants

export async function up(knex: Knex): Promise<void> {
    // Models Table
    await knex.schema.createTable(TableName.Models, (table) => {
        table.increments('id').primary()
        table.string('name').notNullable()
        table.bigint('price').notNullable()
        table.string('regionalCategory')
        table.integer('createdBy')
        table.integer('updatedBy')
        table.timestamps(true, true)
    })

    // Products Table
    await knex.schema.createTable(TableName.Products, (table) => {
        table.increments('id').primary()
        table.string('name').notNullable()
        table.string('materialNumber')
        table.date('expiryDate')
        table.date('launchDate')
        table.text('description')
        table.text('altDescription')
        table.enum('pricingType', ['fixed', 'variable']).defaultTo('fixed')
        table.string('profitCenterWtyIn')
        table.string('profitCenterWtyOut')
        table.string('profitCenterCode')
        table.string('serviceProfitCenter')
        table.string('defaultWarrantyPeriod')
        table.boolean('status').defaultTo(true)
        table.string('quantityUnitOfMeasure')
        table.integer('modelId').unsigned()//.references('id').inTable('models')
        table.integer('createdBy')
        table.integer('updatedBy')
        table.timestamps(true, true)
    })

    // Dealers Table
    await knex.schema.createTable(TableName.Dealers, (table) => {
        table.increments('id').primary()
        table.string('name').notNullable()
        table.string('email')
        table.string('mobilePhone')
        table.string('officePhone')
        table.integer('createdBy')
        table.integer('updatedBy')
        table.timestamps(true, true)
    })

    // Warranties Table
    await knex.schema.createTable(TableName.Warranties, (table) => {
        table.increments('id').primary()
        table.integer('customerId').unsigned()
        table.integer('dealerId').unsigned()//.references('id').inTable('dealers')
        table.string('factoryExternalId')
        table.string('serialNumber')
        table.date('shipmentData')
        table.string('salesOrderNumber')
        table.integer('categoryId').unsigned()
        table.date('purchaseDate')
        table.string('purchaseFrom')
        table.string('purchaseInvoiceNo')
        table.string('placeOfPurchase')
        table.boolean('proofOfPurchaseVerified').defaultTo(false)
        table.string('proofOfPurchase')
        table.string('proofOfUploaded')
        table.date('currentDateUnderEW')
        table.date('ewEndDate')
        table.decimal('price', 12, 2)
        table.string('sourceOfRegistration')
        table.date('installationDate')
        table.string('status')
        table.date('registrationDate')
        table.string('countryOfOrigin')
        table.integer('createdBy')
        table.integer('updatedBy')
        table.timestamps(true, true)
    })

    // Assets Table
    await knex.schema.createTable(TableName.Assets, (table) => {
        table.increments('id').primary()
        table.integer('parentAssetId').unsigned()//.references('id').inTable('assets')
        table.string('name').notNullable()
        table.text('description')
        table.text('foreignModel')
        table.string('compressorNo')
        table.integer('customerId').unsigned()
        table.integer('productId').unsigned()//.references('id').inTable('products')
        table.integer('modelId').unsigned()//.references('id').inTable('models')
        table.string('serialNumberType')
        table.boolean('isDiscountModel').defaultTo(false)
        table.string('status')
        table.integer('warantyId').unsigned()//.references('id').inTable('warranties')
        table.date('purchaseDate')
        table.integer('createdBy')
        table.integer('updatedBy')
        table.timestamps(true, true)
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists(TableName.Assets)
    await knex.schema.dropTableIfExists(TableName.Warranties)
    await knex.schema.dropTableIfExists(TableName.Dealers)
    await knex.schema.dropTableIfExists(TableName.Products)
    await knex.schema.dropTableIfExists(TableName.Models)
}

