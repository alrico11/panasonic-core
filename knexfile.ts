import * as dotenv from "dotenv"
import type { Knex } from "knex";

dotenv.config({
  path: [ '.env.local', '.env.customer-portal.local', '.env.customer-portal']
})

const config: Knex.Config = {
  client: 'pg',
  connection: process.env.DATABASE_URL,
  pool: { min: 2, max: 5 },
  migrations: {
    directory: './database/migrations',
    extension: 'ts'
  },
  seeds: {
    directory: './database/seeds',
    extension: 'ts'
  },
  wrapIdentifier: (value, origImpl) => origImpl(value.replace(/"/g, ''))
}
module.exports = config;
