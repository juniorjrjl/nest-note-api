import { JWTInfo } from "src/services/auth/auth-model";
import { UserDetail, UserInserted, UserUpdated } from "src/services/users/users-model";
import { IUsersMapping } from "./iusers-mapping";
import { UserInsertedResponse, LoginInfoResponse, UserUpdatedResponse, UserFoundResponse } from "./users-model";

export class UsersMapping implements IUsersMapping {

    toUserInsertedResponse(dto: UserInserted): UserInsertedResponse {
        return new UserInsertedResponse(dto.id, dto.name, dto.email, dto.createdAt, dto.updatedAt)
    }

    toLoginInfoResponse(dto: JWTInfo): LoginInfoResponse {
        return new LoginInfoResponse(dto.accessToken, dto.accessTokenExpiresIn)
    }

    toUserUpdatedResponse(dto: UserUpdated): UserUpdatedResponse {
        return new UserUpdatedResponse(dto.id, dto.name, dto.email, dto.createdAt, dto.updatedAt)
    }

    toUserFoundResponse(dto: UserDetail): UserFoundResponse {
        return new UserFoundResponse(dto.id, dto.name, dto.email, dto.createdAt, dto.updatedAt)
    }

}