import path from "path";
import { loadEnvConfig } from "@next/env";
import knex from "../db";

loadEnvConfig(
  path.resolve(__dirname, "../../"),
  process.env.NODE_ENV !== "production"
);

// Ensure database is configured
// eslint-disable-next-line no-unused-expressions
knex;
