import { fa, faker } from "@faker-js/faker/.";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Test, TestingModule } from "@nestjs/testing";
import { IAuthService } from "src/services/auth/iauth.service";
import { AuthService } from "src/services/auth/impl/auth.service";
import { AUTH_SERVICE_TOKENS } from "src/services/auth/tokens/auth.token";
import { IUsersQueryService } from "src/services/users/iusers-query.service";
import { USERS_SERVICE_TOKENS } from "src/services/users/token/users.token";
import { userDetailFactory } from "../../../bots/services/users-model.factory";
import { NotFoundException, UnauthorizedException } from "@nestjs/common";

describe('authService', () => {
    let service: IAuthService
    const userQueryServiceMock = {
        findByEmail: jest.fn(),
        passwordIsMatch: jest.fn()
    } as jest.Mocked<Partial<IUsersQueryService>>;
    const jwtServiceMock = {
        signAsync: jest.fn()
    } as jest.Mocked<Partial<JwtService>>
    const configServiceMock = {
        get: jest.fn()
    } as jest.Mocked<Partial<ConfigService>>
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                { provide: USERS_SERVICE_TOKENS.QUERY_SERVICE, useValue: userQueryServiceMock },
                { provide: JwtService, useValue: jwtServiceMock },
                { provide: ConfigService, useValue: configServiceMock },
                { provide: AUTH_SERVICE_TOKENS.SERVICE, useClass: AuthService }
            ]
        }).compile();
        service = module.get<IAuthService>(AUTH_SERVICE_TOKENS.SERVICE)
    })

    afterEach(async () => jest.clearAllMocks())

    it('when user not found then throw error', async () => {
        const email = faker.internet.email()
        const password = faker.lorem.word()
        userQueryServiceMock.findByEmail!.mockRejectedValue(new NotFoundException(''))

        await expect(service.generateToken(email, password)).rejects.toThrow(UnauthorizedException)

        expect(userQueryServiceMock.findByEmail).toHaveBeenCalledWith(email)
        expect(userQueryServiceMock.passwordIsMatch).not.toHaveBeenCalled()
        expect(configServiceMock.get).not.toHaveBeenCalled()
        expect(jwtServiceMock.signAsync).not.toHaveBeenCalled()
    })

    it('when user found and password not match then throw error', async () => {
        const email = faker.internet.email()
        const password = faker.lorem.word()
        const storedUser = userDetailFactory.build()

        userQueryServiceMock.findByEmail!.mockResolvedValue(storedUser)
        userQueryServiceMock.passwordIsMatch!.mockResolvedValue(false)

        await expect(service.generateToken(email, password)).rejects.toThrow(UnauthorizedException)

        expect(userQueryServiceMock.findByEmail).toHaveBeenCalledWith(email)
        expect(userQueryServiceMock.passwordIsMatch).toHaveBeenLastCalledWith(password, storedUser.password)
        expect(configServiceMock.get).not.toHaveBeenCalled()
        expect(jwtServiceMock.signAsync).not.toHaveBeenCalled()
    })

    it('when email and password is correct then generate token', async () => {
        const email = faker.internet.email()
        const password = faker.lorem.word()
        const storedUser = userDetailFactory.build()
        const secret = faker.lorem.word()
        const expiresIn = `${faker.number.int({ min: 1, max: 60 })}s`
        const token = faker.lorem.word()

        userQueryServiceMock.findByEmail!.mockResolvedValue(storedUser)
        userQueryServiceMock.passwordIsMatch!.mockResolvedValue(true)
        configServiceMock.get!.mockImplementation((key: string) => {
            if (key === 'JWT_SECRET_KEY') return secret as never
            if (key === 'JWT_EXPIRES_IN') return expiresIn as never
            return null as never
        })
        jwtServiceMock.signAsync!.mockResolvedValue(token)

        const actual = await service.generateToken(email, password)

        expect(actual.accessToken).toBe(token)
        expect(actual.accessTokenExpiresIn).not.toBeNull()
        expect(userQueryServiceMock.findByEmail).toHaveBeenCalledWith(email)
        expect(userQueryServiceMock.passwordIsMatch).toHaveBeenLastCalledWith(password, storedUser.password)
        expect(configServiceMock.get).toHaveBeenCalledWith('JWT_SECRET_KEY')
        expect(configServiceMock.get).toHaveBeenCalledWith('JWT_EXPIRES_IN')
        expect(jwtServiceMock.signAsync).toHaveBeenCalledWith({ email, id: storedUser.id }, { secret, expiresIn })

    })

})