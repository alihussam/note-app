import { Sequelize } from "sequelize";

// create and export sequelize instance/connection
export const sequelizeConnection = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite3",
});

/**
 * Get transaction for DB
 *
 * @returns Transaction
 */
export const getTransaction = async () => sequelizeConnection.transaction();
