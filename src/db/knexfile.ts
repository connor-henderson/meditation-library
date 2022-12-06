import path from "path";
import { loadEnvConfig } from "@next/env";

if (!process.env.DB_CONNECTION_STRING && !process.env.DB_DATABASE) {
  loadEnvConfig(
    path.resolve(__dirname, "../../"),
    process.env.NODE_ENV !== "production"
  );
}

const partialConfig = {
  client: "pg",
  migrations: {
    tableName: "knex_migrations",
    directory: "migrations",
    stub: "migration.stub.ts",
  },
  timezone: "UTC",
};

const devConnection = {
  database: "mindfulnet",
  user: "postgres",
  password: "password",
};

const testConnection = {
  devConnection,
  database: `${devConnection.database}_test`,
};

const prodConnection = process.env.PROD_DB_CONNECTION_STRING;

const production = { ...partialConfig, connection: prodConnection };
const test = { ...partialConfig, connection: testConnection };
const development = { ...partialConfig, connection: devConnection };

const getKnexConfigFromEnv = () => {
  if (process.env.NODE_ENV === "production") return production;
  if (process.env.NODE_ENV === "test") return test;
  return development;
};

const knexConfig = getKnexConfigFromEnv();

export default knexConfig;
