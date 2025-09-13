import { NoteInsert, NoteInserted, NoteUpdate, NoteUpdated } from "./notes-model"

export interface INotesService {

    insert(dto: NoteInsert, authorId: string): Promise<NoteInserted>

    update(dto: NoteUpdate, authorId: string): Promise<NoteUpdated>

    delete(id: string, authorId: string, tokenId: string): Promise<void>

}