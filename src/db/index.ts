import Knex from "knex";
// @ts-ignore
import knexStringcase from "knex-stringcase";
import { Model } from "objection";

import config from "./knexfile";

const knex = Knex(knexStringcase(config));

Model.knex(knex);

export default knex;
