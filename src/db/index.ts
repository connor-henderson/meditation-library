import Knex from "knex";
import { Model } from "objection";

import config from "./knexfile";

const knex = Knex(config);

Model.knex(knex);

export default knex;
