import { getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { Model } from "mongoose";
import { IUser, User, UserDocument } from "../../../../src/db/user.schema";
import { UsersQueryService } from "../../../../src/services/users/impl/users-query.service";
import { IUsersQueryService } from "../../../../src/services/users/iusers-query.service";
import { USERS_SERVICE_TOKENS } from "../../../../src/services/users/token/users.token";
import { userDocumentFactory } from "../../../bots/services/users-model.factory";
import * as bcrypt from 'bcrypt';
import { ObjectId } from "mongodb";
import { faker } from "@faker-js/faker/.";
import { NotFoundException, UnauthorizedException } from "@nestjs/common";

describe('UsersQueryService', () => {
    let queryService: IUsersQueryService
    const userModelMock = {
        findById: jest.fn(),
        findOne: jest.fn(),
    } as jest.Mocked<Partial<Model<UserDocument>>>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                { provide: USERS_SERVICE_TOKENS.QUERY_SERVICE, useClass: UsersQueryService },
                { provide: getModelToken(User.name), useValue: userModelMock }
            ],
        }).compile();
        queryService = module.get<IUsersQueryService>(USERS_SERVICE_TOKENS.QUERY_SERVICE)
    })

    it('when user is stored and try find it by id then return it', async () => {
        const storedUser = userDocumentFactory.build() as IUser
        userModelMock.findById!.mockResolvedValue(storedUser as UserDocument)
        const actual = await queryService.findById(storedUser.id, storedUser.id)
        expect(actual).toEqual(storedUser)
        expect(userModelMock.findById).toHaveBeenCalledWith(storedUser.id);
    })

    it('when received ids is differents then throw error', async () => {
        const storedUser = userDocumentFactory.build() as IUser
        const anotherId = new ObjectId().toHexString()
        userModelMock.findById!.mockResolvedValue(storedUser as UserDocument)
        await expect(queryService.findById(storedUser.id, anotherId)).rejects.toThrow(UnauthorizedException)
        expect(userModelMock.findById).toHaveBeenCalledWith(storedUser.id);
    })

    it('when user isn`t stored and try find it by id  then throw error', async () => {
        const id = new ObjectId().toHexString()
        userModelMock.findById!.mockResolvedValue(undefined)
        await expect(queryService.findById(id, id)).rejects.toThrow(NotFoundException)
        expect(userModelMock.findById).toHaveBeenCalledWith(id);
    })

    it('when user is stored and try find it by email then return it', async () => {
        const storedUser = userDocumentFactory.build() as IUser
        userModelMock.findOne!.mockResolvedValue(storedUser as UserDocument)
        const actual = await queryService.findByEmail(storedUser.email)
        expect(actual).toEqual(storedUser)
        expect(userModelMock.findOne).toHaveBeenCalledWith({ email: storedUser.email });
    })

    it('when user isn`t stored and try find it by email  then throw error', async () => {
        const email = faker.internet.email()
        userModelMock.findOne!.mockResolvedValue(undefined)
        await expect(queryService.findByEmail(email)).rejects.toThrow(NotFoundException)
        expect(userModelMock.findOne).toHaveBeenCalledWith({ email });
    })

    it('when password is match return true', async () => {
        const password = faker.lorem.word()
        const hashed = await bcrypt.hash(password, 10)
        const actual = await queryService.passwordIsMatch(password, hashed)
        expect(actual).toBeTruthy()
    })

    it('when password isn`t match return false', async () => {
        const password = faker.lorem.word()
        const hashed = await bcrypt.hash(password + faker.lorem.word(), 10)
        const actual = await queryService.passwordIsMatch(password, hashed)
        expect(actual).toBeFalsy()
    })

})