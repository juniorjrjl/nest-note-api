import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "src/services/users/impl/users.service";
import { IUsersQueryService } from "src/services/users/iusers-query.service";
import { IUsersService } from "src/services/users/iusers.service";
import { USERS_SERVICE_TOKENS } from "src/services/users/token/users.token";
import { ObjectId } from "mongodb";
import { userDetailFactory, userDocumentFactory, userInsertFactory, userUpdateFactory, userUpdatePasswordFactory } from "../../../bots/services/users-model.factory";
import { User, UserDocument } from "src/db/user.schema";
import { Model } from "mongoose";
import { getModelToken } from "@nestjs/mongoose";
import { NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InvalidPasswordException } from "src/services/users/users-exception";

describe('usersService', () => {
    let service: IUsersService
    const queryServiceMock = {
        findById: jest.fn(),
        findByEmail: jest.fn(),
        passwordIsMatch: jest.fn()
    } as jest.Mocked<Partial<IUsersQueryService>>;
    const userModelMock = {
        findByIdAndDelete: jest.fn(),
        findOneAndUpdate: jest.fn(),
        populate: jest.fn(),
        create: jest.fn()
    } as jest.Mocked<Partial<Model<UserDocument>>>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                { provide: USERS_SERVICE_TOKENS.SERVICE, useClass: UsersService },
                { provide: getModelToken(User.name), useValue: userModelMock },
                { provide: USERS_SERVICE_TOKENS.QUERY_SERVICE, useValue: queryServiceMock }
            ]
        }).compile();
        service = module.get<IUsersService>(USERS_SERVICE_TOKENS.SERVICE)
    })

    afterEach(async () => jest.clearAllMocks())

    it('when try insert then do it', async () => {
        const userInsert = userInsertFactory.build()
        const model = userDocumentFactory.build() as any

        userModelMock.create!.mockResolvedValue(model)
        await service.insert(userInsert)
    })

    it('when try update stored user then return it', async () => {
        const noteUpdate = userUpdateFactory.build()
        const founded = userDetailFactory.build()
        const { id, ...propsToUpdate } = noteUpdate
        const updated = userDocumentFactory.build() as UserDocument
        queryServiceMock.findById!.mockResolvedValue(founded)
        userModelMock.findOneAndUpdate!.mockResolvedValue(updated)

        await expect(service.update(noteUpdate, noteUpdate.id)).resolves.not.toThrow()

        expect(queryServiceMock.findById).toHaveBeenCalledWith(noteUpdate.id)
        expect(userModelMock.findOneAndUpdate).toHaveBeenCalledWith(
            { _id: id },
            { $set: { ...propsToUpdate } },
            { new: true }
        )
    })

    it('when try update using different user id then throw error', async () => {
        const noteUpdate = userUpdateFactory.build()
        const founded = userDetailFactory.build()
        const updated = userDocumentFactory.build() as UserDocument
        queryServiceMock.findById!.mockResolvedValue(founded)
        userModelMock.findOneAndUpdate!.mockResolvedValue(updated)

        await expect(service.update(noteUpdate, new ObjectId().toHexString())).rejects.toThrow(UnauthorizedException)
        expect(queryServiceMock.findById).not.toHaveBeenCalled()
        expect(userModelMock.findOneAndUpdate).not.toHaveBeenCalled()
    })

    it('when try update user not found then throw error', async () => {
        const noteUpdate = userUpdateFactory.build()
        queryServiceMock.findById!.mockRejectedValue(new NotFoundException(''))

        await expect(service.update(noteUpdate, noteUpdate.id)).rejects.toThrow(NotFoundException)
        expect(queryServiceMock.findById).toHaveBeenCalledWith(noteUpdate.id)
        expect(userModelMock.findOneAndUpdate).not.toHaveBeenCalled()
        expect(userModelMock.populate).not.toHaveBeenCalled()
    })

    it('when send correct old password then updeta password', async () => {
        const changePassword = userUpdatePasswordFactory.build()
        const founded = userDetailFactory.build({ password: changePassword.oldPassword })

        queryServiceMock.findByEmail!.mockResolvedValue(founded)
        queryServiceMock.passwordIsMatch!.mockResolvedValue(true)
        userModelMock.findOneAndUpdate!.mockResolvedValue(undefined)

        await expect(service.changePassword(changePassword)).resolves.not.toThrow()
        expect(queryServiceMock.findByEmail).toHaveBeenLastCalledWith(changePassword.email)
        expect(queryServiceMock.passwordIsMatch).toHaveBeenLastCalledWith(changePassword.oldPassword, founded.password)
    })

    it('when send incorrect old password then throw error', async () => {
        const changePassword = userUpdatePasswordFactory.build()
        const founded = userDetailFactory.build({ password: changePassword.oldPassword })

        queryServiceMock.findByEmail!.mockResolvedValue(founded)
        queryServiceMock.passwordIsMatch!.mockResolvedValue(false)

        await expect(service.changePassword(changePassword)).rejects.toThrow(InvalidPasswordException)
        expect(queryServiceMock.findByEmail).toHaveBeenCalledWith(changePassword.email)
        expect(queryServiceMock.passwordIsMatch).toHaveBeenCalledWith(changePassword.oldPassword, founded.password)
    })

    it('when user not found then throw error', async () => {
        const changePassword = userUpdatePasswordFactory.build()

        queryServiceMock.findByEmail!.mockRejectedValue(new NotFoundException(''))

        await expect(service.changePassword(changePassword)).rejects.toThrow(NotFoundException)
        expect(queryServiceMock.findByEmail).toHaveBeenLastCalledWith(changePassword.email)
        expect(queryServiceMock.passwordIsMatch).not.toHaveBeenCalled()
    })

    it('when user is deleted then not throw error', async () => {
        const id = new ObjectId().toHexString()
        const userDetail = userDetailFactory.build()
        queryServiceMock.findById!.mockResolvedValue(userDetail)
        userModelMock.findByIdAndDelete!.mockResolvedValue(undefined)

        await expect(service.delete(id, id)).resolves.not.toThrow()
        expect(queryServiceMock.findById).toHaveBeenCalledWith(id)
        expect(userModelMock.findByIdAndDelete).toHaveBeenCalledWith(id)
    })

    it('when try to delete using different user id then throw error', async () => {
        const id = new ObjectId().toHexString()
        const differentId = new ObjectId().toHexString()
        const userDetail = userDetailFactory.build()
        queryServiceMock.findById!.mockResolvedValue(userDetail)
        userModelMock.findByIdAndDelete!.mockResolvedValue(undefined)

        await expect(service.delete(id, differentId)).rejects.toThrow(UnauthorizedException)
        expect(queryServiceMock.findById).not.toHaveBeenCalledWith(id)
        expect(userModelMock.findByIdAndDelete).not.toHaveBeenCalledWith(id)
    })

    it('when user not found then throw error', async () => {
        const id = new ObjectId().toHexString()
        queryServiceMock.findById!.mockRejectedValue(new NotFoundException(''))

        await expect(service.delete(id, id)).rejects.toThrow(NotFoundException)
        expect(queryServiceMock.findById).toHaveBeenCalledWith(id)
        expect(userModelMock.findByIdAndDelete).not.toHaveBeenCalled()
    })

})