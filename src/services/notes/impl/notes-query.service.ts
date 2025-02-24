import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Note, NoteDocument } from 'src/db/note.schema';
import { NoteAuthorList, NoteDetail } from '../notes-model';
import { INotesQueryService } from './../inotes-query.service';

@Injectable()
export class NotesQueryService implements INotesQueryService {

    constructor(@InjectModel(Note.name) private readonly model: Model<NoteDocument>) { }

    public async findByAuthorAndLikeText(author: string, query?: string): Promise<NoteAuthorList[]> {
        return query ? (await this.model.find({ author })
            .find({ $text: { $search: query } })) :
            (await this.model.find({ author }))
    }

    public async findById(id: string): Promise<NoteDetail> {
        const document = await this.model.findById(id)

        if (!document) {
            throw new NotFoundException(`A nota com id ${id} não foi encontrada`)
        }

        return document
    }

}
