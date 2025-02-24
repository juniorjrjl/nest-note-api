import { Module } from '@nestjs/common';
import { Note, NoteSchema } from './note.schema'
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.schema';

@Module({
    imports: [MongooseModule.forFeature([
        { name: Note.name, schema: NoteSchema },
        { name: User.name, schema: UserSchema }
    ])],
    exports: [MongooseModule]
})
export class DbModule { }
