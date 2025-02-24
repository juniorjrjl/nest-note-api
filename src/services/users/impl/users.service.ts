import { Inject, Injectable } from '@nestjs/common';
import { UserInsert, UserInserted, UserUpdate, UserUpdated, UserUpdatePassword } from './../users-model';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/db/user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { InvalidPasswordException } from '../users-exception';
import { UsersQueryService } from './users-query.service';
import { USERS_SERVICE_TOKENS } from '../token/users.token';
import { IUsersService } from '../iusers.service';

@Injectable()
export class UsersService implements IUsersService {

    constructor(
        @InjectModel(User.name) private readonly model: Model<UserDocument>,
        @Inject(USERS_SERVICE_TOKENS.QUERY_SERVICE) private readonly queryService: UsersQueryService
    ) { }

    public async insert(dto: UserInsert): Promise<UserInserted> {
        const document = await this.model.create({ ...dto, password: await this.hashPassword(dto.password) })
        return document
    }

    public async update({ id, ...props }: UserUpdate): Promise<UserUpdated> {
        await this.queryService.findById(id)
        const document = await this.model.findOneAndUpdate(
            { _id: id },
            { $set: props },
            { new: true }
        )
        return document
    }

    public async changePassword(dto: UserUpdatePassword): Promise<void> {
        const user = await this.queryService.findByEmail(dto.email)
        if (!await this.queryService.passwordIsMatch(dto.oldPassword, user.password)) {
            throw new InvalidPasswordException("A senha informada não corresponde com a senha do usuário")
        }

        await this.model.findOneAndUpdate(
            { email: dto.email },
            { $set: { password: await this.hashPassword(dto.newPassword) } }
        )
    }

    public async delete(id: string): Promise<void> {
        await this.queryService.findById(id)
        await this.model.findByIdAndDelete(id)
    }

    public async hashPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10)
    }

}
