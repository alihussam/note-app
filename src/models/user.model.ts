import { DataTypes, ModelDefined, Optional } from "sequelize";
import bcrypt from "bcrypt";
import { sequelizeConnection } from "../config";
import { getEnvConfig } from "../utils/env.utils";

export const USER_MODEL_NAME = "User";
export const USERS_COLLECTION = "users";

const { PASSWORD_HASH_ROUNDS } = getEnvConfig();

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
}

type UserCreationAttributes = Optional<User, "id">;

/**
 * Init model
 */
const UserModel: ModelDefined<User, UserCreationAttributes> =
  sequelizeConnection.define(
    USER_MODEL_NAME,
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
      email: {
        type: new DataTypes.STRING(128),
        unique: true,
        allowNull: false,
      }, // unique constraint
      password: {
        type: new DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      timestamps: true,
      tableName: USERS_COLLECTION,
      modelName: USER_MODEL_NAME,
      indexes: [
        {
          unique: true,
          fields: ["email"],
        },
      ],
      hooks: {
        // has password before create and update
        beforeCreate: (user: any) => {
          const salt = bcrypt.genSaltSync(PASSWORD_HASH_ROUNDS);
          user.password = bcrypt.hashSync(user.password, salt);
        },
        beforeUpdate: (user) => {
          if (user.password) {
            const salt = bcrypt.genSaltSync(PASSWORD_HASH_ROUNDS);
            user.password = bcrypt.hashSync(user.password, salt);
          }
        },
      },
    }
  );

export { UserModel };
