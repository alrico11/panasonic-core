import { Knex } from "knex";
import { constants } from "@lib";
const { TableName } = constants

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    // await knex(TableName.Table_name).del();

    // Inserts seed entries
    let insertModules = await knex(TableName.Modules).insert([
        {
            slug: 'user',
            moduleName: 'User',
            description: 'User Management ',
            // order: '',
            // permissions: '',
            // permissionsHash: '',
            // menus: '',
            // menusHash: '',
            isActive: true,
        },
        {
            slug: 'role',
            moduleName: 'Role',
            description: 'Role User Management ',
            // order: '',
            // permissions: '',
            // permissionsHash: '',
            // menus: '',
            // menusHash: '',
            isActive: true,
        },
        {
            slug: 'customer',
            moduleName: 'Customer',
            description: 'Manage customers',
            // order: '',
            // permissions: '',
            // permissionsHash: '',
            // menus: '',
            // menusHash: '',
            isActive: true,
        },
        {
            slug: 'profile',
            moduleName: 'Profile',
            description: 'Manage own profile',
            // order: '',
            // permissions: '',
            // permissionsHash: '',
            // menus: '',
            // menusHash: '',
            isActive: true,
        },
        {
            slug: 'customer_portal',
            moduleName: 'Customer Portal',
            description: 'Customer portal dashboard',
            // order: '',
            // permissions: '',
            // permissionsHash: '',
            // menus: '',
            // menusHash: '',
            isActive: true,
        }
    ])
        .onConflict('slug').ignore().returning('*')

    if (insertModules.length == 0) {
        insertModules = await knex(TableName.Modules).select('*')
    }

    const modules = Object.fromEntries(insertModules.map(v => [v.slug, v.id]))

    let insertPermissions = await knex(TableName.Permissions).insert([
        // Profile
        {
            moduleId: modules.profile,
            // moduleName: '',
            slug: 'view',
            name: 'View',
            // path: '',
            // method: '',
            // deps: '',
            // tMenus: '',
        },
        {
            moduleId: modules.profile,
            // moduleName: '',
            slug: 'edit',
            name: 'Edit',
            // path: '',
            // method: '',
            // deps: '',
            // tMenus: '',
        },

        // Customer
        {
            moduleId: modules.customer,
            // moduleName: '',
            slug: 'create',
            name: 'Create',
            // path: '',
            // method: '',
            // deps: '',
            // tMenus: '',
        },
        {
            moduleId: modules.customer,
            // moduleName: '',
            slug: 'edit',
            name: 'Edit',
            // path: '',
            // method: '',
            // deps: '',
            // tMenus: '',
        },
        {
            moduleId: modules.customer,
            // moduleName: '',
            slug: 'detail',
            name: 'Detail',
            // path: '',
            // method: '',
            // deps: '',
            // tMenus: '',
        },
        {
            moduleId: modules.customer,
            // moduleName: '',
            slug: 'delete',
            name: 'Delete',
            // path: '',
            // method: '',
            // deps: '',
            // tMenus: '',
        },
        {
            moduleId: modules.customer,
            // moduleName: '',
            slug: 'search',
            name: 'Search',
            // path: '',
            // method: '',
            // deps: '',
            // tMenus: '',
        },
        {
            moduleId: modules.customer,
            // moduleName: '',
            slug: 'filter',
            name: 'Filter',
            // path: '',
            // method: '',
            // deps: '',
            // tMenus: '',
        },

        // User
        {
            moduleId: modules.user,
            // moduleName: '',
            slug: 'create',
            name: 'Create',
            // path: '',
            // method: '',
            // deps: '',
            // tMenus: '',
        },
        {
            moduleId: modules.user,
            // moduleName: '',
            slug: 'edit',
            name: 'Edit',
            // path: '',
            // method: '',
            // deps: '',
            // tMenus: '',
        },
        {
            moduleId: modules.user,
            // moduleName: '',
            slug: 'detail',
            name: 'Detail',
            // path: '',
            // method: '',
            // deps: '',
            // tMenus: '',
        },
        {
            moduleId: modules.user,
            // moduleName: '',
            slug: 'delete',
            name: 'Delete',
            // path: '',
            // method: '',
            // deps: '',
            // tMenus: '',
        },
        {
            moduleId: modules.user,
            // moduleName: '',
            slug: 'search',
            name: 'Search',
            // path: '',
            // method: '',
            // deps: '',
            // tMenus: '',
        },
        {
            moduleId: modules.user,
            // moduleName: '',
            slug: 'filter',
            name: 'Filter',
            // path: '',
            // method: '',
            // deps: '',
            // tMenus: '',
        },
        // Role
        {
            moduleId: modules.role,
            // moduleName: '',
            slug: 'create',
            name: 'Create',
            // path: '',
            // method: '',
            // deps: '',
            // tMenus: '',
        },
        {
            moduleId: modules.role,
            // moduleName: '',
            slug: 'edit',
            name: 'Edit',
            // path: '',
            // method: '',
            // deps: '',
            // tMenus: '',
        },
        {
            moduleId: modules.role,
            // moduleName: '',
            slug: 'detail',
            name: 'Detail',
            // path: '',
            // method: '',
            // deps: '',
            // tMenus: '',
        },
        {
            moduleId: modules.role,
            // moduleName: '',
            slug: 'delete',
            name: 'Delete',
            // path: '',
            // method: '',
            // deps: '',
            // tMenus: '',

            // Customer portal
        },
        {
            moduleId: modules.customer_portal,
            // moduleName: '',
            slug: 'all',
            name: 'Allow all customer portal features',
            // path: '',
            // method: '',
            // deps: '',
            // tMenus: '',
        },
        // 1. Konsumen	View
        // 2. Bisnis	View
        // 3. Promosi	View
        // 4. Berita	View
        // 5. Tentang Kami	View
        // 6. Lokasi Pembelian	View
        // 7. Chat Panasonic Support	Live Chat
        // 8. Dukungan	View
        // 8.1 Pertanyaan Umum	View
        // 8.2 Hubungi Kami	Selected feature
        // 8.3.1 Pusat layanan pelanggan	View
        // 8.3.2 Pusat Service	View
        //     Search location
        // 8.3.3 Formulir Permintaan	Create  
        // 8.4 Garansi Elektronik	Selected feature
        // 8.4.1 Pendaftaran Baru	Create  
        // 8.4.2 Syarat dan Ketentuan Garansi	View
        // 8.5 Unduh Produk Bisnis	Selected feature
        // 8.5.1 Solusi Kemanan	View
        // 8.5.2 Pencitraan Komunikasi	View
        // 8.6 Lainnya	View per product
        // 8.7. Icon Profil	Selected feature
        // 8.7.1 Login & Create Account	Register & login
        // 8.7.2 My Account	View
        // 8.7.3 My Warranty History	View
        // 8.7.4 My Ticket History	View
        // 8.7.5 My Repair Order	View
        // 8.7.6 My AUth Setting	Update
        // 8.7.7 Logout	Logout


    ]).onConflict(['moduleId', 'slug']).ignore().returning('*')

    if (insertPermissions.length == 0) {
        insertPermissions = await knex(TableName.Permissions).select('*')
    }
    const P = Object.fromEntries(
        Object.entries(modules).map(([moduleSlug, moduleId]) => [
            moduleSlug,
            Object.fromEntries(insertPermissions.filter(v => v.moduleId == moduleId).map(
                p => [p.slug, p.id]
            ))
        ])
    )
    console.log('permissions', P)
    // Role matrices
    const allPemissions = [
        P.profile.view,
        P.profile.edit,
        P.customer.create,
        P.customer.edit,
        P.customer.detail,
        P.customer.delete,
        P.customer.search,
        P.customer.filter,
        P.user.create,
        P.user.edit,
        P.user.detail,
        P.user.delete,
        P.user.search,
        P.user.filter,
        P.role.create,
        P.role.edit,
        P.role.detail,
        P.role.delete,
    ]
    const setAPemissions = [
        P.profile.view,
        P.profile.edit,
        P.customer.create,
        P.customer.edit,
        P.customer.detail,
        P.customer.delete,
        P.customer.search,
        P.customer.filter,
        P.user.create,
        P.user.edit,
        P.user.detail,
        P.user.delete,
        P.user.search,
        P.user.filter,
        // P.role.create,
        // P.role.edit,
        // P.role.detail,
        // P.role.delete,
    ]
    const minimumPermissions = [
        P.profile.view,
        P.profile.edit,
    ]
    const roles = await knex(TableName.Roles).insert([
        {
            slug: 'super-admin',
            name: 'Super admin',
            description: 'Roles for Super admin',
            // isAdmin: '',
            // isArea: '',
            permissions: allPemissions,
            // status: '',
        },
        {
            slug: 'pmi',
            name: 'PMI',
            description: 'Roles for PMI',
            // isAdmin: '',
            // isArea: '',
            permissions: minimumPermissions,
            // status: '',
        },
        {
            slug: 'pgi-ho-engineering',
            name: 'PGI HO Engineering',
            description: 'Roles for PGI HO Engineering',
            // isAdmin: '',
            // isArea: '',
            permissions: setAPemissions,
            // status: '',
        },
        {
            slug: 'pgi-ho-cs',
            name: 'PGI HO CS',
            description: 'Roles for PGI HO CS',
            // isAdmin: '',
            // isArea: '',
            permissions: setAPemissions,
            // status: '',
        },
        {
            slug: 'gdn-ho',
            name: 'GDN HO',
            description: 'Roles for GDN HO',
            // isAdmin: '',
            // isArea: '',
            permissions: setAPemissions,
            // status: '',
        },
        {
            slug: 'gdn-sc',
            name: 'GDN SC',
            description: 'Roles for GDN SC',
            // isAdmin: '',
            // isArea: '',
            permissions: minimumPermissions,
            // status: '',
        },
        {
            slug: 'ccc',
            name: 'CCC',
            description: 'Roles for CCC',
            // isAdmin: '',
            // isArea: '',
            permissions: minimumPermissions,
            // status: '',
        },
        {
            slug: 'dealer',
            name: 'Dealer',
            description: 'Roles for Dealer',
            // isAdmin: '',
            // isArea: '',
            permissions: minimumPermissions,
            // status: '',
        },
        {
            slug: 'technis-gdn',
            name: 'Technis GDN',
            description: 'Roles for Technis GDN',
            // isAdmin: '',
            // isArea: '',
            permissions: minimumPermissions,
            // status: '',
        },
        {
            slug: 'pass',
            name: 'PASS',
            description: 'Roles for PASS',
            // isAdmin: '',
            // isArea: '',
            permissions: setAPemissions,
            // status: '',
        },
        {
            slug: 'technisi-pass',
            name: 'Technisi PASS',
            description: 'Roles for Technisi',
            // isAdmin: '',
            // isArea: '',
            permissions: minimumPermissions,
            // status: '',
        },
        {
            slug: 'customer',
            name: 'Customer',
            description: 'Roles for Customer',
            // isAdmin: '',
            // isArea: '',
            permissions: [...minimumPermissions, P.customer_portal.all],
            // status: '',
        }
    ]).onConflict('slug').ignore().returning('*')

    console.log('Created roles', roles)
};
