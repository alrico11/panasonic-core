import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    // await knex("table_name").del();

    // Inserts seed entries
    let insertModules = await knex("modules").insert([
        {
            slug: 'user',
            module_name: 'User',
            description: 'User Management ',
            // order: '',
            // permissions: '',
            // permissions_hash: '',
            // menus: '',
            // menus_hash: '',
            is_active: true,
        },
        {
            slug: 'role',
            module_name: 'Role',
            description: 'Role User Management ',
            // order: '',
            // permissions: '',
            // permissions_hash: '',
            // menus: '',
            // menus_hash: '',
            is_active: true,
        },
        {
            slug: 'customer',
            module_name: 'Customer',
            description: 'Manage customers',
            // order: '',
            // permissions: '',
            // permissions_hash: '',
            // menus: '',
            // menus_hash: '',
            is_active: true,
        },
        {
            slug: 'profile',
            module_name: 'Profile',
            description: 'Manage own profile',
            // order: '',
            // permissions: '',
            // permissions_hash: '',
            // menus: '',
            // menus_hash: '',
            is_active: true,
        },
        {
            slug: 'customer_portal',
            module_name: 'Customer Portal',
            description: 'Customer portal dashboard',
            // order: '',
            // permissions: '',
            // permissions_hash: '',
            // menus: '',
            // menus_hash: '',
            is_active: true,
        }
    ])
        .onConflict('slug').ignore().returning('*')

    if (insertModules.length == 0) {
        insertModules = await knex('modules').select('*')
    }

    const modules = Object.fromEntries(insertModules.map(v => [v.slug, v.id]))

    let insertPermissions = await knex("permissions").insert([
        // Profile
        {
            module_id: modules.profile,
            // module_name: '',
            slug: 'view',
            name: 'View',
            // path: '',
            // method: '',
            // deps: '',
            // tMenus: '',
        },
        {
            module_id: modules.profile,
            // module_name: '',
            slug: 'edit',
            name: 'Edit',
            // path: '',
            // method: '',
            // deps: '',
            // tMenus: '',
        },

        // Customer
        {
            module_id: modules.customer,
            // module_name: '',
            slug: 'create',
            name: 'Create',
            // path: '',
            // method: '',
            // deps: '',
            // tMenus: '',
        },
        {
            module_id: modules.customer,
            // module_name: '',
            slug: 'edit',
            name: 'Edit',
            // path: '',
            // method: '',
            // deps: '',
            // tMenus: '',
        },
        {
            module_id: modules.customer,
            // module_name: '',
            slug: 'detail',
            name: 'Detail',
            // path: '',
            // method: '',
            // deps: '',
            // tMenus: '',
        },
        {
            module_id: modules.customer,
            // module_name: '',
            slug: 'delete',
            name: 'Delete',
            // path: '',
            // method: '',
            // deps: '',
            // tMenus: '',
        },
        {
            module_id: modules.customer,
            // module_name: '',
            slug: 'search',
            name: 'Search',
            // path: '',
            // method: '',
            // deps: '',
            // tMenus: '',
        },
        {
            module_id: modules.customer,
            // module_name: '',
            slug: 'filter',
            name: 'Filter',
            // path: '',
            // method: '',
            // deps: '',
            // tMenus: '',
        },

        // User
        {
            module_id: modules.user,
            // module_name: '',
            slug: 'create',
            name: 'Create',
            // path: '',
            // method: '',
            // deps: '',
            // tMenus: '',
        },
        {
            module_id: modules.user,
            // module_name: '',
            slug: 'edit',
            name: 'Edit',
            // path: '',
            // method: '',
            // deps: '',
            // tMenus: '',
        },
        {
            module_id: modules.user,
            // module_name: '',
            slug: 'detail',
            name: 'Detail',
            // path: '',
            // method: '',
            // deps: '',
            // tMenus: '',
        },
        {
            module_id: modules.user,
            // module_name: '',
            slug: 'delete',
            name: 'Delete',
            // path: '',
            // method: '',
            // deps: '',
            // tMenus: '',
        },
        {
            module_id: modules.user,
            // module_name: '',
            slug: 'search',
            name: 'Search',
            // path: '',
            // method: '',
            // deps: '',
            // tMenus: '',
        },
        {
            module_id: modules.user,
            // module_name: '',
            slug: 'filter',
            name: 'Filter',
            // path: '',
            // method: '',
            // deps: '',
            // tMenus: '',
        },
        // Role
        {
            module_id: modules.role,
            // module_name: '',
            slug: 'create',
            name: 'Create',
            // path: '',
            // method: '',
            // deps: '',
            // tMenus: '',
        },
        {
            module_id: modules.role,
            // module_name: '',
            slug: 'edit',
            name: 'Edit',
            // path: '',
            // method: '',
            // deps: '',
            // tMenus: '',
        },
        {
            module_id: modules.role,
            // module_name: '',
            slug: 'detail',
            name: 'Detail',
            // path: '',
            // method: '',
            // deps: '',
            // tMenus: '',
        },
        {
            module_id: modules.role,
            // module_name: '',
            slug: 'delete',
            name: 'Delete',
            // path: '',
            // method: '',
            // deps: '',
            // tMenus: '',

            // Customer portal
        },
        {
            module_id: modules.customer_portal,
            // module_name: '',
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


    ]).onConflict(['module_id', 'slug']).ignore().returning('*')

    if (insertPermissions.length == 0) {
        insertPermissions = await knex('permissions').select('*')
    }
    const P = Object.fromEntries(
        Object.entries(modules).map(([moduleSlug, module_id]) => [
            moduleSlug,
            Object.fromEntries(insertPermissions.filter(v => v.module_id == module_id).map(
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
    const minimumPemissions = [
        P.profile.view,
        P.profile.edit,
    ]
    const roles = await knex("roles").insert([
        {
            slug: 'super-admin',
            name: 'Super admin',
            description: 'Roles for Super admin',
            // is_admin: '',
            // is_area: '',
            permissions: allPemissions,
            // status: '',
        },
        {
            slug: 'pmi',
            name: 'PMI',
            description: 'Roles for PMI',
            // is_admin: '',
            // is_area: '',
            permissions: minimumPemissions,
            // status: '',
        },
        {
            slug: 'pgi-ho-engineering',
            name: 'PGI HO Engineering',
            description: 'Roles for PGI HO Engineering',
            // is_admin: '',
            // is_area: '',
            permissions: setAPemissions,
            // status: '',
        },
        {
            slug: 'pgi-ho-cs',
            name: 'PGI HO CS',
            description: 'Roles for PGI HO CS',
            // is_admin: '',
            // is_area: '',
            permissions: setAPemissions,
            // status: '',
        },
        {
            slug: 'gdn-ho',
            name: 'GDN HO',
            description: 'Roles for GDN HO',
            // is_admin: '',
            // is_area: '',
            permissions: setAPemissions,
            // status: '',
        },
        {
            slug: 'gdn-sc',
            name: 'GDN SC',
            description: 'Roles for GDN SC',
            // is_admin: '',
            // is_area: '',
            permissions: minimumPemissions,
            // status: '',
        },
        {
            slug: 'ccc',
            name: 'CCC',
            description: 'Roles for CCC',
            // is_admin: '',
            // is_area: '',
            permissions: minimumPemissions,
            // status: '',
        },
        {
            slug: 'dealer',
            name: 'Dealer',
            description: 'Roles for Dealer',
            // is_admin: '',
            // is_area: '',
            permissions: minimumPemissions,
            // status: '',
        },
        {
            slug: 'technis-gdn',
            name: 'Technis GDN',
            description: 'Roles for Technis GDN',
            // is_admin: '',
            // is_area: '',
            permissions: minimumPemissions,
            // status: '',
        },
        {
            slug: 'pass',
            name: 'PASS',
            description: 'Roles for PASS',
            // is_admin: '',
            // is_area: '',
            permissions: setAPemissions,
            // status: '',
        },
        {
            slug: 'technisi-pass',
            name: 'Technisi PASS',
            description: 'Roles for Technisi',
            // is_admin: '',
            // is_area: '',
            permissions: minimumPemissions,
            // status: '',
        },
        {
            slug: 'customer',
            name: 'Customer',
            description: 'Roles for Customer',
            // is_admin: '',
            // is_area: '',
            permissions: [...minimumPemissions, P.customer_portal.all],
            // status: '',
        }
    ]).onConflict('slug').ignore().returning('*')

    console.log('Created roles', roles)
};
