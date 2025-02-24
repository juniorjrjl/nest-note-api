import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Document } from "mongoose";
import { IUser, User } from "./user.schema";

export interface INote extends Document {
    id: string;
    title: string;
    body: string;
    author: IUser;
    createdAt: Date;
    updatedAt: Date;
}

export type NoteDocument = HydratedDocument<INote>;

@Schema({ timestamps: true, collection: 'notes' })
export class Note {
    @Prop({ required: true })
    title: String;
    @Prop({ required: true })
    body: String;
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
    author: User
}

export const NoteSchema = SchemaFactory.createForClass(Note)

NoteSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

NoteSchema.index({ title: 'text', body: 'text' })
