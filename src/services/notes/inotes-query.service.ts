import { NoteDetail, NoteAuthorList } from "./notes-model"

export interface INotesQueryService {

    findByAuthorAndLikeText(author: string, query?: string): Promise<NoteAuthorList[]>
    findById(id: string): Promise<NoteDetail>

}