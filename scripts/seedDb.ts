import { associateModels } from "../src/models/modelAssociations";
import { NoteModel } from "../src/models/note.model";
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
  });
  await NoteModel.create({
    id: 2,
    text: "Hacking robots",
    title: "I am Robo Hacker",
    ownerId: 1,
  });

  console.log("Seed done");
}

/* WARNING THIS WILL DROP THE CURRENT DATABASE */
seed();
