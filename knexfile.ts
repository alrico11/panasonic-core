import "dotenv/config"
import type { Knex } from "knex";

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
  }
}
module.exports = config;
