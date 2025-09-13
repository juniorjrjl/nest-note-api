import * as Factory from "factory.ts";
import { ObjectId } from 'mongodb';
import { faker } from "@faker-js/faker";
import { INote } from "src/db/note.schema";
import { userDocumentFactory } from "./users-model.factory";
import { NoteInsert, NoteUpdate, NoteUpdated } from "src/services/notes/notes-model";

export type INoteFactory = Omit<INote | 'id' | '_id', keyof Document>;

export const noteDocumentFactory = Factory.makeFactory<INoteFactory>({
    id: new ObjectId().toHexString(),
    _id: function () { return this.id },
    title: faker.lorem.word(),
    body: faker.lorem.word(),
    author: userDocumentFactory.build(),
    createdAt: faker.date.birthdate(),
    updatedAt: faker.date.birthdate(),
})

export const noteUpdateFactory = Factory.makeFactory<NoteUpdate>({
    id: new ObjectId().toHexString(),
    title: faker.lorem.word(),
    body: faker.lorem.word(),
    author: new ObjectId().toHexString()
})

export const noteUpdatedFactory = Factory.makeFactory<NoteUpdated>({
    id: new ObjectId().toHexString(),
    title: faker.lorem.word(),
    body: faker.lorem.word(),
    author: {
        id: new ObjectId().toHexString(),
        name: faker.lorem.word(),
    },
    createdAt: faker.date.birthdate(),
    updatedAt: faker.date.birthdate(),
})

export const noteInsertFactory = Factory.makeFactory<NoteInsert>({
    title: faker.lorem.word(),
    body: faker.lorem.word(),
    author: new ObjectId().toHexString()
})
