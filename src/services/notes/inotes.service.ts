import { NoteInsert, NoteInserted, NoteUpdate, NoteUpdated } from "./notes-model"

export interface INotesService {

    insert(dto: NoteInsert): Promise<NoteInserted>

    update(dto: NoteUpdate): Promise<NoteUpdated>

    delete(id: string): Promise<void>

}