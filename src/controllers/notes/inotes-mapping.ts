import { NoteAuthorList, NoteDetail, NoteInserted, NoteUpdated } from "src/services/notes/notes-model";
import { NoteAuthorListResponse, NoteDetailResponse, NoteInsertedResponse, NoteUpdatedResponse } from "./notes-model";

export interface INotesMapping {

    toNoteInsertedResponse(dto: NoteInserted): NoteInsertedResponse

    toNoteUpdatedResponse(dto: NoteUpdated): NoteUpdatedResponse

    toNoteAuthorListResponse(dto: NoteAuthorList[]): NoteAuthorListResponse[]

    toNoteDetailResponse(dto: NoteDetail): NoteDetailResponse

}