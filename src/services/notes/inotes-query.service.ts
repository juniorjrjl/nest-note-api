import { NoteDetail, NoteAuthorList } from "./notes-model"

export interface INotesQueryService {

    findByAuthorAndLikeText(author: string, tokenId: string, query?: string): Promise<NoteAuthorList[]>
    findById(id: string, authorId: string, tokenId: string): Promise<NoteDetail>

}