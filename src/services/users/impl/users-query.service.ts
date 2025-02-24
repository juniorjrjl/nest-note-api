import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/db/user.schema';
import { UserDetail } from './../users-model';
import * as bcrypt from 'bcrypt';
import { IUsersQueryService } from '../iusers-query.service';

@Injectable()
export class UsersQueryService implements IUsersQueryService {

    constructor(@InjectModel(User.name) private readonly model: Model<UserDocument>) { }

    public async findById(id: string): Promise<UserDetail> {
        const document = await this.model.findById(id)

        if (!document) {
            throw new NotFoundException(`O usuário com id ${id} não foi encontrado`)
        }

        return document
    }

    public async findByEmail(email: string): Promise<UserDetail> {
        const document = await this.model.findOne({ email })

        if (!document) {
            throw new NotFoundException(`O usuário de email ${email} não foi encontrado`)
        }

        return document
    }

    public async passwordIsMatch(password: string, hashedPassword: string): Promise<boolean> {
        try {
            return await bcrypt.compare(password, hashedPassword)
        } catch (error) {
            return false
        }
    }

}
