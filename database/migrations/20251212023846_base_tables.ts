import type { Knex } from "knex";
export async function up(knex: Knex): Promise<void> {
    // Users table
    await knex.schema.createTable("users", (table) => {
        table.increments("id").primary().comment("PK")
        table.integer("role_id").comment("roles.id (FK reference, constraint not enforced)")
        table.integer("transcxp_id").comment("user123 (FK reference)")
        table.integer("territory_id").comment("service_territories.id master-data (FK reference)")
        table.integer("nsc_branch_id").comment("nsc_branch.id (FK reference)")
        table.string("salutation").comment("SalutationEnum")
        table.string("email").comment("buat info saja")
        table.string("account_name")
        table.string("first_name")
        table.string("middle_name")
        table.string("last_name")
        table.string("mobile_phone").comment("buat info saja")
        table.string("home_phone")
        table.string("business_phone")
        table.string("suffix")
        table.string("tax_payer_id").comment("NPWP")
        table.string("gender").comment("GenderEnum")
        table.string("status").comment("UserStatusEnum")
        table.text("remark")
        table.timestamp("created_at").defaultTo(knex.fn.now())
        table.timestamp("updated_at")
        table.timestamp("deleted_at")
        table.integer("created_by").comment("users.id (FK reference)")
        table.integer("updated_by").comment("users.id (FK reference)")
        table.integer("deleted_by").comment("users.id (FK reference)")
    })

    // User addresses (named as in the spec: user_adresses)
    await knex.schema.createTable("user_adresses", (table) => {
        table.increments("id").primary().comment("PK");
        table.integer("user_id").comment("users.id (FK reference)");
        table.string("address_type").comment("AddressTypeEnum");
        table.string("country");
        table.text("street");
        table.string("city");
        table.string("sub_district");
        table.string("state_or_province");
        table.integer("zip_or_postal_code");
    });

    // Partners
    await knex.schema.createTable("partners", (table) => {
        table.increments("id").primary().comment("PK");
        table.integer("user_id").comment("users.id (FK reference)");
        table.string("password");
        table.string("forgot_password").comment("redis?");
        table.string("activation_code");
        table.integer("login_attempts");
        table.date("lock_until").nullable();
        table.date("last_login").nullable();
        table.date("last_notif_update_password").nullable();
        table.date("last_update_password").nullable();
    });

    // Technicians
    await knex.schema.createTable("technicians", (table) => {
        table.increments("id").primary().comment("PK");
        table.integer("user_id").comment("users.id (FK reference)");
        table.string("nsc").comment("NSCEnum");
        table.date("start_date").nullable().comment("masa (kontrak) kerja");
        table.date("end_date").nullable();
        table.string("password");
        table.string("forgot_password").comment("redis?");
        table.string("activation_code");
        table.integer("login_attempts");
        table.date("lock_until").nullable();
        table.date("last_login").nullable();
        table.date("last_notif_update_password").nullable();
        table.date("last_update_password").nullable();
    });

    // Roles
    await knex.schema.createTable("roles", (table) => {
        table.increments("id").primary().comment("PK");
        table.string("slug");
        table.string("name").comment("RoleEnum");
        table.text("description");
        table.boolean("is_admin").defaultTo(false).comment("allow access all territories");
        table.boolean("is_area").defaultTo(false).comment("allow access nested territories of their coverages");
        table.specificType("permissions", "integer[]").comment("store list permission permitted");
        table.boolean("status").defaultTo(true);
    });

    // Menus
    await knex.schema.createTable("menus", (table) => {
        table.increments("id").primary().comment("PK");
        table.integer("module_id");
        table.string("group").comment("fitur group. eg: Reports");
        table.integer("group_order").comment("order number group");
        table.string("name").comment("name of menu, eg: Reporting");
        table.string("slug").comment("eg: m.report.invoice");
        table.string("action").comment("link, void");
        table.string("type").comment("menu, other");
        table.integer("order").comment("order of menu or submenus (has parent_id)");
        table.integer("parent_id");
    });

    // Modules
    await knex.schema.createTable("modules", (table) => {
        table.increments("id").primary().comment("PK");
        table.string("slug").comment("eg: reports.invoices");
        table.string("module_name").comment("eg: Report Invoices");
        table.text("description").comment("module for report invoices");
        table.integer("order").comment("sort list module on role management");
        table.jsonb("permissions").comment('eg: [{"deps": [], "name": "Dashboard", "path": "dashboard", "slug": "dashboard.list", "method": "GET", "tMenus": ["m.dashboard.list"]}]');
        table.string("permissions_hash").comment("for security reason");
        table.jsonb("menus").comment('eg: [{"name": "Dashboard", "slug": "m.dashboard.list", "type": "menu", "child": [], "order": 0, "action": "link"}]');
        table.string("menus_hash").comment("for security reason");
        table.boolean("is_active").defaultTo(true);
    });

    // Permissions
    await knex.schema.createTable("permissions", (table) => {
        table.increments("id").primary().comment("PK");
        table.integer("module_id").comment("modules.id");
        table.string("module_name");
        table.string("slug").comment("eg: customer.delete");
        table.string("name");
        table.string("path").comment("customer/:id");
        table.string("method").comment("GET, POST, PATCH, DELETE");
        table.specificType("deps", "text[]").comment("this store dependency permission to access. eg: [customer.list, customer.get]");
        table.specificType("tMenus", "text[]").comment("list menu thats affected. eg: [b.customer.fraud.delete]");
    });

    // Customers
    await knex.schema.createTable("customers", (table) => {
        table.increments("id").primary().comment("PK");
        table.string("old_customer_id").comment("for migration data prevent loss data");
        table.integer("user_id")
        table.boolean("delete_flag").defaultTo(false);
        table.string("email").comment("constraint with mobile_phone");
        table.string("account_name");
        table.string("first_name");
        table.string("middle_name");
        table.string("last_name");
        table.string("mobile_phone").comment("constraint with mobile_phone");
        table.string("membership_type").comment("MembershipTypeEnum");
        table.boolean("multi_factor_athentication").defaultTo(false);
        table.integer("otp_code_attempt");
        table.string("otp_code").comment("redis?");
        table.string("qr_otp_code").comment("redis?");
        table.integer("login_attempts").comment("redis?");
        table.date("lock_until").nullable().comment("redis?");
        table.date("last_login").nullable();
        table.boolean("by_email").defaultTo(false);
        table.boolean("by_post").defaultTo(false);
        table.boolean("by_whatsapp").defaultTo(false);
        table.boolean("by_facebook_messenger").defaultTo(false);
        table.boolean("by_sms").defaultTo(false);
        table.boolean("by_telephone").defaultTo(false);
    });

}


export async function down(knex: Knex): Promise<void> {
    // Drop in reverse order of creation
    await knex.schema.dropTableIfExists("customers");
    await knex.schema.dropTableIfExists("permissions");
    await knex.schema.dropTableIfExists("modules");
    await knex.schema.dropTableIfExists("menus");
    await knex.schema.dropTableIfExists("roles");
    await knex.schema.dropTableIfExists("technicians");
    await knex.schema.dropTableIfExists("partners");
    await knex.schema.dropTableIfExists("user_adresses");
    await knex.schema.dropTableIfExists("users");
}
