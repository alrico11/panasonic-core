import type { Knex } from "knex";
import { constants } from "@lib";
const { TableName } = constants

export async function up(knex: Knex): Promise<void> {
    // Add columns to Users table
    await knex.schema.alterTable(TableName.Users, (table) => {

        table.integer("otpCodeAttempt").nullable()
        table.string("otpCode").nullable()
        table.timestamp("otpExpiredAt").nullable();
        table.boolean("isOtpUsed").defaultTo(false);
        table.integer("loginAttempts").nullable()
        table.timestamp("lockUntil").nullable()
        table.timestamp("lastLogin").nullable()
        table.string("profilePicture").nullable().comment("link to profile picture")
    })

    // Drop columns from Customers table
    await knex.schema.alterTable(TableName.Customers, (table) => {
        table.dropColumn("multiFactorAuthentication")
        table.dropColumn("otpCodeAttempt")
        table.dropColumn("otpCode")
        table.dropColumn("qrOtpCode")
        table.dropColumn("otpExpiredAt")
        table.dropColumn("isOtpUsed")
        table.dropColumn("loginAttempts")
        table.dropColumn("lockUntil")
        table.dropColumn("lastLogin")
        // table.dropColumn("profilePicture")
    })
}


export async function down(knex: Knex): Promise<void> {
    // Restore columns to Customers table
    await knex.schema.alterTable(TableName.Customers, (table) => {
        table.boolean("multiFactorAuthentication").defaultTo(false)
        table.integer("otpCodeAttempt")
        table.string("otpCode").comment("redis?")
        table.boolean("qrOtpCode").comment("redis?")
        table.timestamp("otpExpiredAt").nullable();
        table.boolean("isOtpUsed").defaultTo(false);
        table.integer("loginAttempts").comment("redis?")
        table.timestamp("lockUntil").nullable().comment("redis?")
        table.timestamp("lastLogin").nullable()
        // table.string("profilePicture").nullable().comment("link to profile picture")
    })

    // Remove columns from Users table
    await knex.schema.alterTable(TableName.Users, (table) => {
        // table.dropColumn("multiFactorAuthentication")
        table.dropColumn("otpCodeAttempt")
        table.dropColumn("otpCode")
        // table.dropColumn("qrOtpCode")
        table.dropColumn("otpExpiredAt")
        table.dropColumn("isOtpUsed")
        table.dropColumn("loginAttempts")
        table.dropColumn("lockUntil")
        table.dropColumn("lastLogin")
        table.dropColumn("profilePicture")
    })
}

