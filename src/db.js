import { Sequelize } from "sequelize";
import {
  DB_DATABASE,
  DB_HOST,
  DB_PASSWORD,
  DB_PORT,
  DB_USER,
} from "./config.js";

const sequelize = new Sequelize(
  `mysql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`,
  {
    dialect: "mysql",
  }
);
const UserModel = sequelize.define(
  "user",
  {
    user_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: Sequelize.STRING,
      unique: true,
    },
    password: {
      type: Sequelize.INTEGER,
    },
  },
  {
    tableName: "user",
    timestamps: false, // exclude createdAt and updatedAt columns
  }
);

export default UserModel;
