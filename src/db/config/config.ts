import { Sequelize } from "sequelize";

const developmentURI = "postgres://postgres:password@localhost:5432/mindfulnet";
const testURI = `${developmentURI}_test`;

const getDatabaseConnectionString = () => {
  if (process.env.NODE_ENV === "development") return developmentURI;
  if (process.env.NODE_ENV === "test") return testURI;
  if (process.env.DB_CONNECTION_STRING) return process.env.DB_CONNECTION_STRING;

  throw Error("No database connection string provided");
};

const dbConnectionString = getDatabaseConnectionString();

const sequelize = new Sequelize(dbConnectionString, {
  host: "localhost",
  dialect: "postgres",
  ssl: true,
});

export default sequelize;
