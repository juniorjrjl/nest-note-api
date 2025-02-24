import { NoteAuthorList, NoteDetail, NoteInserted, NoteUpdated } from "src/services/notes/notes-model";
import { INotesMapping } from "./inotes-mapping";
import { AuthorNoteInsertedResponse, AuthorNoteUpdatedResponse, NoteAuthorListResponse, NoteDetailResponse, NoteInsertedResponse, NoteUpdatedResponse } from "./notes-model";

export class NotesMapping implements INotesMapping {

    public toNoteInsertedResponse(dto: NoteInserted): NoteInsertedResponse {
        return new NoteInsertedResponse(
            dto.id,
            dto.title,
            dto.body,
            new AuthorNoteInsertedResponse(dto.author.id, dto.author.name),
            dto.createdAt,
            dto.updatedAt
        )
    }

    public toNoteUpdatedResponse(dto: NoteUpdated): NoteUpdatedResponse {
        return new NoteUpdatedResponse(
            dto.id,
            dto.title,
            dto.body,
            new AuthorNoteUpdatedResponse(dto.author.id, dto.author.name),
            dto.createdAt,
            dto.updatedAt
        )
    }

    public toNoteAuthorListResponse(dto: NoteAuthorList[]): NoteAuthorListResponse[] {
        return dto.map(d => this.toNoteAuthorListResponseSingle(d))
    }

    private toNoteAuthorListResponseSingle(dto: NoteAuthorList): NoteAuthorListResponse {
        return new NoteAuthorListResponse(dto.id, dto.title, dto.createdAt, dto.updatedAt)
    }

    public toNoteDetailResponse(dto: NoteDetail): NoteDetailResponse {
        return new NoteDetailResponse(
            dto.id,
            dto.title,
            dto.body,
            dto.createdAt,
            dto.updatedAt
        )
    }

}