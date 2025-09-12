import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsNotEmpty, Length } from "class-validator"
import { IsPasswordsMatch } from "../../custom-validators/is-password-match"

export class LoginInfoRequest {
    @ApiProperty()
    @IsEmail({}, { message: 'Informe um e-mail válido' })
    @IsNotEmpty({ message: 'Informe um e-mail válido' })
    email: string
    @ApiProperty()
    @IsNotEmpty({ message: 'Informe uma senha válida' })
    @Length(5, Number.MAX_VALUE, { message: ({ constraints }) => `A senha deve ter no mínimo ${constraints[0]} caracteres` })
    password: string
    constructor(email: string, password: string) {
        this.email = email
        this.password = password
    }
}

export class LoginInfoResponse {
    @ApiProperty()
    accessToken: string
    @ApiProperty()
    accessTokenExpiresIn: number
    constructor(accessToken: string, accessTokenExpiresIn: number) {
        this.accessToken = accessToken
        this.accessTokenExpiresIn = accessTokenExpiresIn
    }
}

export class UserInsertRequest {
    @ApiProperty()
    @IsNotEmpty({ message: 'Informe um nome válido' })
    @Length(2, 100, { message: ({ constraints }) => `O nome deve ter entre ${constraints[0]} e ${constraints[1]} caracteres` })
    name: string
    @ApiProperty()
    @IsEmail({}, { message: 'Informe um e-mail válido' })
    @IsNotEmpty({ message: 'Informe um e-mail válido' })
    email: string
    @ApiProperty()
    @IsNotEmpty({ message: 'Informe uma senha válida' })
    @Length(5, Number.MAX_VALUE, { message: ({ constraints }) => `A senha deve ter no mínimo ${constraints[0]} caracteres` })
    password: string
    constructor(name: string, email: string, password: string) {
        this.name = name
        this.email = email
        this.password = password
    }
}

export class UserInsertedResponse {
    @ApiProperty()
    id: string
    @ApiProperty()
    name: string
    @ApiProperty()
    email: string
    @ApiProperty()
    createdAt: Date
    @ApiProperty()
    updatedAt: Date
    constructor(id: string, name: string, email: string, createdAt: Date, updatedAt: Date) {
        this.id = id
        this.name = name
        this.email = email
        this.createdAt = createdAt
        this.updatedAt = updatedAt
    }
}

export class UserUpdateRequest {
    @ApiProperty()
    @IsNotEmpty({ message: 'Informe um nome válido' })
    @Length(5, 100, { message: ({ constraints }) => `O nome deve ter entre ${constraints[0]} e ${constraints[1]} caracteres` })
    name: string
    @ApiProperty()
    @IsEmail({}, { message: 'Informe um e-mail válido' })
    @IsNotEmpty({ message: 'Informe um e-mail válido' })
    email: string
    constructor(name: string, email: string) {
        this.name = name
        this.email = email
    }
}

export class UserUpdatedResponse {
    @ApiProperty()
    id: string
    @ApiProperty()
    name: string
    @ApiProperty()
    email: string
    @ApiProperty()
    createdAt: Date
    @ApiProperty()
    updatedAt: Date
    constructor(id: string, name: string, email: string, createdAt: Date, updatedAt: Date) {
        this.id = id
        this.name = name
        this.email = email
        this.createdAt = createdAt
        this.updatedAt = updatedAt
    }
}

export class UserChangePasswordRequest {
    @ApiProperty()
    @IsEmail({}, { message: 'Informe um e-mail válido' })
    @IsNotEmpty({ message: 'Informe um e-mail válido' })
    email: string
    @ApiProperty()
    @IsNotEmpty({ message: 'Informe uma senha válida' })
    @Length(5, Number.MAX_VALUE, { message: ({ constraints }) => `A senha deve ter no mínimo ${constraints[0]} caracteres` })
    @IsPasswordsMatch('confirmOldPassword', { message: 'Os campos de senha e confirmação de senha estão diferentes' })
    oldPassword: string
    @ApiProperty()
    @IsNotEmpty({ message: 'Informe uma senha válida' })
    @Length(5, Number.MAX_VALUE, { message: ({ constraints }) => `A senha deve ter no mínimo ${constraints[0]} caracteres` })
    confirmOldPassword: string
    @ApiProperty()
    @IsNotEmpty({ message: 'Informe uma senha válida' })
    @Length(5, Number.MAX_VALUE, { message: ({ constraints }) => `A senha deve ter no mínimo ${constraints[0]} caracteres` })
    newPassword: string
    constructor(email: string, oldPassword: string, confirmOldPassword: string, newPassword: string) {
        this.email = email
        this.oldPassword = oldPassword
        this.confirmOldPassword = confirmOldPassword
        this.newPassword = newPassword
    }
}
