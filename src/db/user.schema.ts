import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types, Document } from "mongoose";

export interface IUser extends Document {
    id: string;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

export type UserDocument = HydratedDocument<IUser>;

@Schema({ timestamps: true, collection: 'users' })
export class User {
    @Prop({ required: true })
    name: string;
    @Prop({ required: true, unique: true })
    email: string;
    @Prop({ required: true })
    password: string;
}

export const UserSchema = SchemaFactory.createForClass(User)

UserSchema.virtual('id').get(function () {
    return this._id.toHexString()
})
