import { UserInsert, UserInserted, UserUpdate, UserUpdated, UserUpdatePassword } from './users-model';

export interface IUsersService {

    insert(dto: UserInsert): Promise<UserInserted>

    update(dto: UserUpdate): Promise<UserUpdated>

    changePassword(dto: UserUpdatePassword): Promise<void>

    delete(id: string): Promise<void>

    hashPassword(password: string): Promise<string>

}
