import Logger from "../src/libs/logger.lib";
import { associateModels } from "../src/models/modelAssociations";
import { NoteModel, NoteType } from "../src/models/note.model";
import { UserModel } from "../src/models/user.model";

async function seed() {
  associateModels();

  // create tables
  await UserModel.sync({ force: true });
  await NoteModel.sync({ force: true });

  //insert data
  await UserModel.create({
    id: 1,
    name: "Robot Hacker",
    email: "robo@hacker.com",
    password: "roboHacker123",
  });
  await UserModel.create({
    id: 2,
    name: "John Wick",
    email: "john@wick.com",
    password: "johnWick123",
  });
  await NoteModel.create({
    id: 1,
    text: "Sad and angry",
    title: "My Dog",
    ownerId: 2,
    type: NoteType.PERSONAL,
  });
  await NoteModel.create({
    id: 2,
    text: "Hacking robots",
    title: "I am Robo Hacker",
    ownerId: 1,
    type: NoteType.PERSONAL,
  });

  Logger.getInstance().info("Seed done");
}

/* WARNING THIS WILL DROP THE CURRENT DATABASE */
seed();
