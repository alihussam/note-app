import { DataTypes, ModelDefined, Optional } from "sequelize";
import { sequelizeConnection } from "../config";

export const NOTE_MODEL_NAME = "Note";
export const NOTES_COLLECTION = "notes";

export interface Note {
  id: number;
  title: string;
  text: string;
  ownerId: number;
}

type NoteCreationAttributes = Optional<Note, "id">;

// order of InferAttributes & InferCreationAttributes is important.
const NoteModel: ModelDefined<Note, NoteCreationAttributes> =
  sequelizeConnection.define(
    NOTE_MODEL_NAME,
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      title: {
        type: new DataTypes.STRING(128),
        allowNull: false,
      },
      text: {
        type: new DataTypes.TEXT(),
        allowNull: false,
      },
    },
    {
      timestamps: true,
      tableName: NOTES_COLLECTION,
      modelName: NOTE_MODEL_NAME,
    }
  );

export { NoteModel };
