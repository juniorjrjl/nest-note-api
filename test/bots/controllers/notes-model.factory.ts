import * as Factory from "factory.ts";
import { ObjectId } from 'mongodb';
import { faker } from "@faker-js/faker";
import { NoteAuthorList, NoteDetail, NoteInserted, NoteUpdated } from "src/services/notes/notes-model";

export const noteInsertedFactory = Factory.makeFactory<NoteInserted>({
    id: new ObjectId().toHexString(),
    title: faker.lorem.word(),
    body: faker.lorem.word(),
    author: {
        id: new ObjectId().toHexString(),
        name: faker.lorem.word()
    },
    createdAt: faker.date.birthdate(),
    updatedAt: faker.date.birthdate(),
})

export const noteUpdatedFactory = Factory.makeFactory<NoteUpdated>({
    id: new ObjectId().toHexString(),
    title: faker.lorem.word(),
    body: faker.lorem.word(),
    author: {
        id: new ObjectId().toHexString(),
        name: faker.lorem.word()
    },
    createdAt: faker.date.birthdate(),
    updatedAt: faker.date.birthdate(),
})

export const noteDetailFactory = Factory.makeFactory<NoteDetail>({
    id: new ObjectId().toHexString(),
    title: faker.lorem.word(),
    body: faker.lorem.word(),
    createdAt: faker.date.birthdate(),
    updatedAt: faker.date.birthdate(),
})

export const noteAuthorListFactory = Factory.makeFactory<NoteAuthorList>({
    id: new ObjectId().toHexString(),
    title: faker.lorem.word(),
    createdAt: faker.date.birthdate(),
    updatedAt: faker.date.birthdate(),
})
