import { sequelizeConnection } from "../config";
import { NoteModel } from "./note.model";
import { UserModel } from "./user.model";

export const associateModels = () => {
  // create note belongs to a user association
  UserModel.hasMany(NoteModel, {
    as: "Owner",
    foreignKey: "ownerId",
  }); // foreign key is ownerId in NoteModel

  /**
   * NOTE: This is not a recommend method for production and should
   * be done using migrations in real environment
   */
  sequelizeConnection.sync({ force: false });
};
