import { NoteModel } from "./note.model";
import { UserModel } from "./user.model";

export const associateModels = () => {
  // create note belongs to a user association
  UserModel.hasMany(NoteModel, {
    as: "Owner",
    foreignKey: "ownerId",
  }); // foreign key is ownerId in NoteModel
};
