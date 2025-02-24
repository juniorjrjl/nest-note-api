import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Note, NoteDocument } from 'src/db/note.schema';
import { NoteInsert, NoteInserted, NoteUpdate, NoteUpdated } from '../notes-model';
import { INotesService } from './../inotes.service';
import { NOTES_SERVICE_TOKENS } from './../token/notes.token';
import { INotesQueryService } from './../inotes-query.service';
import { IUsersQueryService } from 'src/services/users/iusers-query.service';
import { USERS_SERVICE_TOKENS } from 'src/services/users/token/users.token';

@Injectable()
export class NotesService implements INotesService {

    constructor(
        @InjectModel(Note.name) private readonly model: Model<NoteDocument>,
        @Inject(USERS_SERVICE_TOKENS.QUERY_SERVICE) private readonly userQueryService: IUsersQueryService,
        @Inject(NOTES_SERVICE_TOKENS.QUERY_SERVICE) private readonly queryService: INotesQueryService
    ) { }

    public async insert(dto: NoteInsert): Promise<NoteInserted> {
        const author = await this.userQueryService.findById(dto.author)
        const document = await this.model.create({ ...dto })
        return {
            id: document.id,
            title: document.title,
            body: document.body,
            author: {
                id: author.id,
                name: author.name
            },
            createdAt: document.createdAt,
            updatedAt: document.updatedAt
        }
    }

    public async update(dto: NoteUpdate): Promise<NoteUpdated> {
        await this.queryService.findById(dto.id)
        const { id, ...props } = dto
        const document = await this.model.findOneAndUpdate(
            { _id: id },
            { $set: props },
            { new: true }
        ).populate('author')
        return {
            id: document.id,
            title: document.title,
            body: document.body,
            author: {
                id: document.author.id,
                name: document.author.name
            },
            createdAt: document.createdAt,
            updatedAt: document.updatedAt
        }
    }

    public async delete(id: string): Promise<void> {
        await this.queryService.findById(id)
        await this.model.findByIdAndDelete(id)
    }

}
