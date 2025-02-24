import { UserInserted, UserUpdated } from "src/services/users/users-model";
import { LoginInfoResponse, UserInsertedResponse, UserUpdatedResponse } from "./users-model";
import { JWTInfo } from "src/services/auth/auth-model";

export interface IUsersMapping {

    toUserInsertedResponse(dto: UserInserted): UserInsertedResponse

    toLoginInfoResponse(dto: JWTInfo): LoginInfoResponse

    toUserUpdatedResponse(dto: UserUpdated): UserUpdatedResponse

}