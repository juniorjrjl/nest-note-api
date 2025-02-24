import { Test, TestingModule } from "@nestjs/testing"
import { IUsersMapping } from "../../../../src/controllers/users/iusers-mapping"
import { USERS_CONTROLLER_TOKENS } from "../../../../src/controllers/users/token/users.token"
import { UsersMapping } from "../../../../src/controllers/users/users-mapping"
import { jwtInfoFactory, userInsertedFactory, userUpdatedFactory } from "../../../bots/controllers/users-model.factory"

describe('UserMapping', () => {
    let mapping: IUsersMapping

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [{ provide: USERS_CONTROLLER_TOKENS.MAPPING, useClass: UsersMapping }]
        }).compile();

        mapping = module.get<IUsersMapping>(USERS_CONTROLLER_TOKENS.MAPPING)
    })

    it('map to NoteInsertedResponse', () => {
        expect(mapping).toBeDefined();
        const dto = userInsertedFactory.build()
        const actual = mapping.toUserInsertedResponse(dto)
        expect(actual).toEqual(dto)
    })

    it('map to LoginInfoResponse', () => {
        expect(mapping).toBeDefined();
        const dto = jwtInfoFactory.build()
        const actual = mapping.toLoginInfoResponse(dto)
        expect(actual).toEqual(dto)
    })

    it('map to UserUpdatedResponse', () => {
        expect(mapping).toBeDefined();
        const dto = userUpdatedFactory.build()
        const actual = mapping.toUserUpdatedResponse(dto)
        expect(actual).toEqual(dto)
    })

})
