import * as Factory from "factory.ts";
import { ObjectId } from 'mongodb';
import { faker } from "@faker-js/faker";
import { UserInserted, UserUpdated } from "src/services/users/users-model"
import { JWTInfo } from "src/services/auth/auth-model";

export const userInsertedFactory = Factory.makeFactory<UserInserted>({
    id: new ObjectId().toHexString(),
    name: faker.lorem.word(),
    email: faker.internet.email(),
    createdAt: faker.date.birthdate(),
    updatedAt: faker.date.birthdate()
})

export const jwtInfoFactory = Factory.makeFactory<JWTInfo>({
    accessToken: faker.lorem.word(),
    accessTokenExpiresIn: faker.number.int()
})

export const userUpdatedFactory = Factory.makeFactory<UserUpdated>({
    id: new ObjectId().toHexString(),
    name: faker.lorem.word(),
    email: faker.internet.email(),
    createdAt: faker.date.birthdate(),
    updatedAt: faker.date.birthdate()
})
