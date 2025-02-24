import { getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { Model } from "mongoose";
import { faker } from "@faker-js/faker";
import { INote, Note, NoteDocument } from "../../../../src/db/note.schema";
import { NotesQueryService } from "../../../../src/services/notes/impl/notes-query.service";
import { INotesQueryService } from "../../../../src/services/notes/inotes-query.service"
import { NOTES_SERVICE_TOKENS } from "../../../../src/services/notes/token/notes.token";
import { noteDocumentFactory } from "../../../bots/services/notes-model.factory";
import { ObjectId } from "mongodb";
import { NotFoundException } from "@nestjs/common";

describe('NoteQueryService', () => {
    let queryService: INotesQueryService
    const noteModelMock = {
        findById: jest.fn(),
        find: jest.fn()
    } as jest.Mocked<Partial<Model<NoteDocument>>>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                { provide: NOTES_SERVICE_TOKENS.QUERY_SERVICE, useClass: NotesQueryService },
                { provide: getModelToken(Note.name), useValue: noteModelMock }
            ]
        }).compile();
        queryService = module.get<INotesQueryService>(NOTES_SERVICE_TOKENS.QUERY_SERVICE)
    })

    afterEach(async () => jest.clearAllMocks())

    it('when note is stored and try find it by id then return it', async () => {
        const storedNote = noteDocumentFactory.build() as INote
        noteModelMock.findById!.mockResolvedValue(storedNote as NoteDocument)
        const actual = await queryService.findById(storedNote.id)
        expect(actual).toEqual(storedNote)
        expect(noteModelMock.findById).toHaveBeenCalledWith(storedNote.id);
    })

    it('when not isn`t stored and try find it by id  then throw error', async () => {
        const id = new ObjectId().toHexString()
        noteModelMock.findById!.mockResolvedValue(undefined)
        await expect(queryService.findById(id)).rejects.toThrow(NotFoundException)
        expect(noteModelMock.findById).toHaveBeenCalledWith(id);
    })

    it('when request filter by body then filter it', async () => {
        const storedNotes = noteDocumentFactory.buildList(5) as INote[]
        const query = faker.lorem.word()
        const author = faker.lorem.word()
        noteModelMock.find!.mockImplementationOnce(function () { return this }).mockResolvedValueOnce(storedNotes)
        queryService.findByAuthorAndLikeText(author, query)
        expect(noteModelMock.find).toHaveBeenCalledWith({ author })
        expect(noteModelMock.find).toHaveBeenCalledWith({ $text: { $search: query } })
        expect(noteModelMock.find).toHaveBeenCalledTimes(2)
    })

    it('when query filter is null, empty or undefined then no call second filter', async () => {
        const storedNotes = noteDocumentFactory.buildList(5) as INote[]
        const author = faker.lorem.word()
        noteModelMock.find!.mockResolvedValue(storedNotes)
        await queryService.findByAuthorAndLikeText(author)
        expect(noteModelMock.find).toHaveBeenCalledWith({ author })
        expect(noteModelMock.find).toHaveBeenCalledTimes(1)
    })

})
