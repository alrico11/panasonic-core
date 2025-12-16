import { Knex } from "knex"
import { PartnerModel, RoleModel, UserModel } from "@lib"
import { PartialModelObject } from "objection"
import * as bcrypt from "bcrypt"


export async function seed(knex: Knex): Promise<void> {
    return knex.transaction(async trx => {
        const role = await RoleModel.query(trx).where("slug", "super-admin").first()
        if (!role) return Promise.reject(new Error("No super-admin role. Forgot to run 'initial-roles.ts' seed?"))
        const email = 'ps-adm-dev@vomoto.com'
        const user = await UserModel.query(trx).insert({
            roleId: role.id,
            accountName: 'Super Admin',
            firstName: 'Super',
            // middleName: '',
            lastName: 'Admin',
            remark: 'Dummy user for development'
        } as PartialModelObject<UserModel>)
            .catch(e => {
                console.warn(`Error creating user`, e)
                return Promise.reject(e)
            })

        const partnerUser = await PartnerModel.query(trx).insert({
            userId: user.id,
            ['pas' + 'sword']: bcrypt.hashSync(email, 10)
        }).catch(e => {
            console.warn(`Error creating partner-user`, e)
            return Promise.reject(e)
        })
        console.debug(partnerUser)
        console.debug(`Created new user with email: ${email}, pass: see the code`)
    })
}
