import { getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { Model } from "mongoose";
import { Note, NoteDocument } from "src/db/note.schema";
import { NotesService } from "src/services/notes/impl/notes.service"
import { INotesQueryService } from "src/services/notes/inotes-query.service";
import { INotesService } from "src/services/notes/inotes.service";
import { NOTES_SERVICE_TOKENS } from "src/services/notes/token/notes.token";
import { IUsersQueryService } from "src/services/users/iusers-query.service";
import { USERS_SERVICE_TOKENS } from "src/services/users/token/users.token";
import { ObjectId } from "mongodb";
import { noteDetailFactory } from "../../../bots/controllers/notes-model.factory";
import { NotFoundException } from "@nestjs/common";
import { noteDocumentFactory, noteInsertFactory, noteUpdateFactory } from "../../../bots/services/notes-model.factory";
import { userDetailFactory } from "../../../bots/services/users-model.factory";

describe('NoteService', () => {
    let service: INotesService
    const noteModelMock = {
        findByIdAndDelete: jest.fn(),
        findOneAndUpdate: jest.fn(),
        populate: jest.fn(),
        create: jest.fn()
    } as jest.Mocked<Partial<Model<NoteDocument>>>;
    const userQueryServiceMock = {
        findById: jest.fn(),
    } as jest.Mocked<Partial<IUsersQueryService>>;
    const queryServiceMock = {
        findById: jest.fn(),
    } as jest.Mocked<Partial<INotesQueryService>>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                { provide: NOTES_SERVICE_TOKENS.SERVICE, useClass: NotesService },
                { provide: getModelToken(Note.name), useValue: noteModelMock },
                { provide: USERS_SERVICE_TOKENS.QUERY_SERVICE, useValue: userQueryServiceMock },
                { provide: NOTES_SERVICE_TOKENS.QUERY_SERVICE, useValue: queryServiceMock },
            ]
        }).compile();
        service = module.get<INotesService>(NOTES_SERVICE_TOKENS.SERVICE)
    })

    afterEach(async () => jest.clearAllMocks())

    it('when try insert with author then do it', async () => {
        const noteInsert = noteInsertFactory.build()
        const author = userDetailFactory.build()
        const model = noteDocumentFactory.build() as any

        userQueryServiceMock.findById!.mockResolvedValue(author)
        noteModelMock.create!.mockResolvedValue(model)
        await service.insert(noteInsert)

        expect(userQueryServiceMock.findById).toHaveBeenCalledWith(noteInsert.author)
        expect(noteModelMock.create).toHaveBeenCalledWith({ ...noteInsert })
    })

    it('when try insert with non stored author then throw error', async () => {
        const noteInsert = noteInsertFactory.build()

        userQueryServiceMock.findById!.mockRejectedValue(new NotFoundException(''))
        await expect(service.insert(noteInsert)).rejects.toThrow(NotFoundException)

        expect(userQueryServiceMock.findById).toHaveBeenCalledWith(noteInsert.author)
        expect(noteModelMock.create).not.toHaveBeenCalledWith({ ...noteInsert })
    })

    it('when try update stored note then return it', async () => {
        const noteUpdate = noteUpdateFactory.build()
        const founded = noteDetailFactory.build()
        const { id, ...propsToUpdate } = noteUpdate
        const updated = noteDocumentFactory.build() as NoteDocument
        queryServiceMock.findById!.mockResolvedValue(founded)
        noteModelMock.findOneAndUpdate!.mockReturnThis()
        noteModelMock.populate!.mockResolvedValue(updated)

        await expect(service.update(noteUpdate)).resolves.not.toThrow()

        expect(queryServiceMock.findById).toHaveBeenCalledWith(noteUpdate.id)
        expect(noteModelMock.findOneAndUpdate).toHaveBeenCalledWith(
            { _id: id },
            { $set: { ...propsToUpdate } },
            { new: true }
        )
        expect(noteModelMock.populate).toHaveBeenCalledWith('author')
    })

    it('when try update note not found then throw error', async () => {
        const noteUpdate = noteUpdateFactory.build()
        queryServiceMock.findById!.mockRejectedValue(new NotFoundException(''))

        await expect(service.update(noteUpdate)).rejects.toThrow(NotFoundException)
        expect(queryServiceMock.findById).toHaveBeenCalledWith(noteUpdate.id)
        await expect(noteModelMock.findOneAndUpdate).not.toHaveBeenCalled()
        expect(noteModelMock.populate).not.toHaveBeenCalled()
    })

    it('when note is deleted then not throw error', async () => {
        const id = new ObjectId().toHexString()
        const noteDetail = noteDetailFactory.build()
        queryServiceMock.findById!.mockResolvedValue(noteDetail)
        noteModelMock.findByIdAndDelete!.mockResolvedValue(undefined)

        await expect(service.delete(id)).resolves.not.toThrow()
        expect(queryServiceMock.findById).toHaveBeenCalledWith(id)
        expect(noteModelMock.findByIdAndDelete).toHaveBeenCalledWith(id)
    })

    it('when note not found then throw error', async () => {
        const id = new ObjectId().toHexString()
        queryServiceMock.findById!.mockRejectedValue(new NotFoundException(''))

        await expect(service.delete(id)).rejects.toThrow(NotFoundException)
        expect(queryServiceMock.findById).toHaveBeenCalledWith(id)
        expect(noteModelMock.findByIdAndDelete).not.toHaveBeenCalled()
    })
})