import type { Knex } from "knex";
import { constants } from "@lib";
const { TableName } = constants

export async function up(knex: Knex): Promise<void> {
    // Users table
    await knex.schema.createTable(TableName.Users, (table) => {
        table.increments("id").primary().comment("PK")
        table.integer("roleId").comment("Roles.id (FK reference, constraint not enforced)")
        table.integer("transcxpId").comment("user123 (FK reference)")
        table.integer("territoryId").comment("ServiceTerritories.id master-data (FK reference)")
        table.integer("nscBranchId").comment("nscBranch.id (FK reference)")
        table.string("salutation").comment("SalutationEnum")
        table.string("email").comment("buat info saja")
        table.string("accountName")
        table.string("firstName")
        table.string("middleName")
        table.string("lastName")
        table.string("mobilePhone").comment("buat info saja")
        table.string("homePhone")
        table.string("businessPhone")
        table.string("suffix")
        table.string("taxPayerId").comment("NPWP")
        table.string("gender").comment("GenderEnum")
        table.string("status").comment("UserStatusEnum")
        table.text("remark")
        table.timestamp("createdAt").defaultTo(knex.fn.now())
        table.timestamp("updatedAt")
        table.timestamp("deletedAt")
        table.integer("createdBy").comment("Users.id (FK reference)")
        table.integer("updatedBy").comment("Users.id (FK reference)")
        table.integer("deletedBy").comment("Users.id (FK reference)")
    })

    // User addresses (named as in the spec: user_adresses)
    await knex.schema.createTable(TableName.UserAdresses, (table) => {
        table.increments("id").primary().comment("PK");
        table.integer("userId").comment("Users.id (FK reference)");
        table.string("addressType").comment("AddressTypeEnum");
        table.string("country");
        table.text("street");
        table.string("city");
        table.string("subDistrict");
        table.string("stateOrProvince");
        table.integer("zipOrPostalCode");
    });

    // Partners
    await knex.schema.createTable(TableName.Partners, (table) => {
        table.increments("id").primary().comment("PK");
        table.integer("userId").comment("Users.id (FK reference)");
        table.string("password");
        table.string("forgotPassword").comment("redis?");
        table.string("activationCode");
        table.integer("loginAttempts");
        table.date("lockUntil").nullable();
        table.date("lastLogin").nullable();
        table.date("lastNotifUpdatePassword").nullable();
        table.date("lastUpdatePassword").nullable();
        table.timestamp("createdAt").defaultTo(knex.fn.now()).comment("created timestamp");
        table.timestamp("updatedAt").comment("updated timestamp");
        table.timestamp("deletedAt").nullable().comment("soft delete timestamp");
        table.integer("createdBy").comment("Users.id (FK reference)");
        table.integer("updatedBy").comment("Users.id (FK reference)");
        table.integer("deletedBy").comment("Users.id (FK reference)");
    });

    // Technicians
    await knex.schema.createTable(TableName.Technicians, (table) => {
        table.increments("id").primary().comment("PK");
        table.integer("userId").comment("Users.id (FK reference)");
        table.string("nsc").comment("NSCEnum");
        table.date("startDate").nullable().comment("masa (kontrak) kerja");
        table.date("endDate").nullable();
        table.string("password");
        table.string("forgotPassword").comment("redis?");
        table.string("activationCode");
        table.integer("loginAttempts");
        table.date("lockUntil").nullable();
        table.date("lastLogin").nullable();
        table.date("lastNotifUpdatePassword").nullable();
        table.date("lastUpdatePassword").nullable();
    });

    // Roles
    await knex.schema.createTable(TableName.Roles, (table) => {
        table.increments("id").primary().comment("PK");
        table.string("slug").unique();
        table.string("name").comment("RoleEnum");
        table.text("description");
        table.boolean("isAdmin").defaultTo(false).comment("allow access all territories");
        table.boolean("isArea").defaultTo(false).comment("allow access nested territories of their coverages");
        table.specificType("permissions", "integer[]").comment("store list permission permitted");
        table.boolean("status").defaultTo(true);
    });

    // Menus
    await knex.schema.createTable(TableName.Menus, (table) => {
        table.increments("id").primary().comment("PK");
        table.integer("moduleId");
        table.string("group").comment("fitur group. eg: Reports");
        table.integer("groupOrder").comment("order number group");
        table.string("name").comment("name of menu, eg: Reporting");
        table.string("slug").comment("eg: m.report.invoice");
        table.string("action").comment("link, void");
        table.string("type").comment("menu, other");
        table.integer("order").comment("order of menu or submenus (has parentId)");
        table.integer("parentId");
    });

    // Modules
    await knex.schema.createTable(TableName.Modules, (table) => {
        table.increments("id").primary().comment("PK");
        table.string("slug").unique().comment("eg: reports.invoices");
        table.string("moduleName").comment("eg: Report Invoices");
        table.text("description").comment("module for report invoices");
        table.integer("order").comment("sort list module on role management");
        table.jsonb("permissions").comment('eg: [{"deps": [], "name": "Dashboard", "path": "dashboard", "slug": "dashboard.list", "method": "GET", "tMenus": ["m.dashboard.list"]}]');
        table.string("permissionsHash").comment("for security reason");
        table.jsonb("menus").comment('eg: [{"name": "Dashboard", "slug": "m.dashboard.list", "type": "menu", "child": [], "order": 0, "action": "link"}]');
        table.string("menusHash").comment("for security reason");
        table.boolean("isActive").defaultTo(true);
    });

    // Permissions
    await knex.schema.createTable(TableName.Permissions, (table) => {
        table.increments("id").primary().comment("PK");
        table.integer("moduleId").comment("Modules.id");
        table.string("moduleName");
        table.string("slug").comment("eg: customer.delete");
        table.string("name");
        table.string("path").comment("customer/:id");
        table.string("method").comment("GET, POST, PATCH, DELETE");
        table.specificType("deps", "text[]").comment("this store dependency permission to access. eg: [customer.list, customer.get]");
        table.specificType("tMenus", "text[]").comment("list menu thats affected. eg: [b.customer.fraud.delete]");
        // composite unique
        table.unique(['moduleId', 'slug'])
    });

    // Customers
    await knex.schema.createTable(TableName.Customers, (table) => {
        table.increments("id").primary().comment("PK");
        table.string("oldCustomerId").comment("for migration data prevent loss data");
        table.integer("userId")
        table.boolean("deleteFlag").defaultTo(false);
        table.string("email").comment("constraint with mobilePhone");
        table.string("accountName");
        table.string("firstName");
        table.string("middleName");
        table.string("lastName");
        table.string("mobilePhone").comment("constraint with mobilePhone");
        table.string("membershipType").comment("MembershipTypeEnum");
        table.boolean("multiFactorAuthentication").defaultTo(false);
        table.integer("otpCodeAttempt");
        table.string("otpCode").comment("redis?");
        table.boolean("qrOtpCode").comment("redis?");
        table.timestamp("otpExpiredAt").nullable();
        table.boolean("isOtpUsed").defaultTo(false);
        table.integer("loginAttempts").comment("redis?");
        table.timestamp("lockUntil").nullable().comment("redis?");
        table.timestamp("lastLogin").nullable();
        table.boolean("byEmail").defaultTo(false);
        table.boolean("byPost").defaultTo(false);
        table.boolean("byWhatsapp").defaultTo(false);
        table.boolean("byFacebookMessenger").defaultTo(false);
        table.boolean("bySms").defaultTo(false);
        table.boolean("byTelephone").defaultTo(false);
        table.timestamp("createdAt").defaultTo(knex.fn.now())
        table.timestamp("updatedAt")
        table.timestamp("deletedAt")
        table.integer("createdBy").comment("Users.id (FK reference)")
        table.integer("updatedBy").comment("Users.id (FK reference)")
        table.integer("deletedBy").comment("Users.id (FK reference)")
        table.string("profilePicture").nullable().comment("link to profile picture");
    });

}


export async function down(knex: Knex): Promise<void> {
    // Drop in reverse order of creation
    await knex.schema.dropTableIfExists(TableName.Customers);
    await knex.schema.dropTableIfExists(TableName.Permissions);
    await knex.schema.dropTableIfExists(TableName.Modules);
    await knex.schema.dropTableIfExists(TableName.Menus);
    await knex.schema.dropTableIfExists(TableName.Roles);
    await knex.schema.dropTableIfExists(TableName.Technicians);
    await knex.schema.dropTableIfExists(TableName.Partners);
    await knex.schema.dropTableIfExists(TableName.UserAdresses);
    await knex.schema.dropTableIfExists(TableName.Users);
}
