import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
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

    public async insert(dto: NoteInsert, authorId: string): Promise<NoteInserted> {
        this.validateAuthor(dto.author, authorId, "Você não tem permissão para criar uma nota para outro autor");

        const author = await this.userQueryService.findById(dto.author, authorId)
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

    public async update(dto: NoteUpdate, authorId: string): Promise<NoteUpdated> {
        this.validateAuthor(dto.author, authorId, "Você não tem permissão para atualizar uma nota de outro autor");

        await this.queryService.findById(dto.id, dto.author, authorId)
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

    public async delete(id: string, authorId: string, tokenId: string): Promise<void> {
        this.validateAuthor(authorId, tokenId, "Você não tem permissão para excluir uma nota de outro autor");

        await this.queryService.findById(id, authorId, tokenId)
        await this.model.findByIdAndDelete(id)
    }

    private validateAuthor(id: string, tokenId: string, errorMessage: string): void {
        if (id !== tokenId) throw new UnauthorizedException(errorMessage);
    }

}
