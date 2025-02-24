import * as Factory from "factory.ts";
import { ObjectId } from 'mongodb';
import { faker } from "@faker-js/faker";
import { UserDetail, UserInsert, UserUpdate, UserUpdatePassword } from "src/services/users/users-model";
import { IUser } from "src/db/user.schema";
import { Document } from "mongoose";

export const usersUpdateFactory = Factory.makeFactory<UserUpdate>({
    id: new ObjectId().toHexString(),
    name: faker.lorem.word(),
    email: faker.internet.email()
})

export type IUserFactory = Omit<IUser | 'id' | '_id', keyof Document>;

export const userDocumentFactory = Factory.makeFactory<IUserFactory>({
    id: new ObjectId().toHexString(),
    _id: function () { return this.id },
    name: faker.lorem.word(),
    email: faker.internet.email(),
    password: faker.lorem.word(),
    createdAt: faker.date.birthdate(),
    updatedAt: faker.date.birthdate()
})

export const userDetailFactory = Factory.makeFactory<UserDetail>({
    id: new ObjectId().toHexString(),
    name: faker.lorem.word(),
    email: faker.internet.email(),
    password: faker.lorem.word(),
    createdAt: faker.date.birthdate(),
    updatedAt: faker.date.birthdate()
})

export const userUpdateFactory = Factory.makeFactory<UserUpdate>({
    id: new ObjectId().toHexString(),
    name: faker.lorem.word(),
    email: faker.internet.email()
})

export const userInsertFactory = Factory.makeFactory<UserInsert>({
    name: faker.lorem.word(),
    email: faker.internet.email(),
    password: faker.lorem.word()
})

export const userUpdatePasswordFactory = Factory.makeFactory<UserUpdatePassword>({
    email: faker.internet.email(),
    oldPassword: faker.lorem.word(),
    newPassword: faker.lorem.word()
})
