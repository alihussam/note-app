import { Note, NoteModel, NoteType } from "../models/note.model";

/**
 * A note factory to create multiple types of notes
 *
 * This is factory to generate payloads only but can be used to return
 * different db models
 */
export class NoteFactory {
  static async createNote({
    text,
    title,
    type,
    ownerId,
  }: {
    type: NoteType;
    title: string;
    text: string;
    ownerId: number;
  }): Promise<Note> {
    // base payload
    const payload: Omit<Note, "id"> = {
      title,
      text,
      type,
      ownerId,
    };

    switch (type) {
      case NoteType.PERSONAL: {
        // if you were returning model you'd do something like
        // new PersonalNote()
        // where PersonalNote => PersonalNote extends Note
        const result = await NoteModel.create(payload);

        // plain
        const plain = result.toJSON() as Note;

        return plain;
      }
      case NoteType.WORK: {
        // for work note also add tracking
        const result = await NoteModel.create({
          ...payload,
          shouldTrack: true,
        });

        // plain
        const plain = result.toJSON() as Note;

        return plain;
      }
      default:
        throw new Error("Unknown note type");
    }
  }
}
