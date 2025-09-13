import { UserDetail } from './users-model';

export interface IUsersQueryService {

    findById(id: string, tokenId: string): Promise<UserDetail>

    findByEmail(email: string): Promise<UserDetail>

    passwordIsMatch(password: string, hashedPassword: string): Promise<boolean>

}
