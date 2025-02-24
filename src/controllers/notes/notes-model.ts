import { ApiProperty } from "@nestjs/swagger"
import { IsNotEmpty, Length } from "class-validator"

export class NoteInsertRequest {
    @ApiProperty()
    @Length(5, 100, { message: ({ constraints }) => `O título deve ter entre ${constraints[0]} e ${constraints[1]} caracteres` })
    @IsNotEmpty({ message: 'Informe um título válido' })
    title: string
    @ApiProperty()
    body: string

    constructor(title: string, body: string) {
        this.body = body
        this.title = title
    }
}

export class AuthorNoteInsertedResponse {
    @ApiProperty()
    id: string
    @ApiProperty()
    name: string

    constructor(id: string, name: string) {
        this.id = id
        this.name = name
    }
}

export class NoteInsertedResponse {
    @ApiProperty()
    id: string
    @ApiProperty()
    title: string
    @ApiProperty()
    body: string
    @ApiProperty()
    author: AuthorNoteInsertedResponse
    @ApiProperty()
    createdAt: Date
    @ApiProperty()
    updatedAt: Date
    constructor(id: string, title: string, body: string, author: AuthorNoteInsertedResponse, createdAt: Date, updatedAt: Date) {
        this.id = id
        this.title = title
        this.body = body
        this.author = author
        this.createdAt = createdAt
        this.updatedAt = updatedAt
    }
}

export class NoteUpdateRequest {
    @ApiProperty()
    @Length(5, 100, { message: ({ constraints }) => `O título deve ter entre ${constraints[0]} e ${constraints[1]} caracteres` })
    @IsNotEmpty({ message: 'Informe um título válido' })
    title: string
    @ApiProperty()
    body: string

    constructor(title: string, body: string) {
        this.body = body
        this.title = title
    }
}

export class AuthorNoteUpdatedResponse {
    @ApiProperty()
    id: string
    @ApiProperty()
    name: string

    constructor(id: string, name: string) {
        this.id = id
        this.name = name
    }
}

export class NoteUpdatedResponse {
    @ApiProperty()
    id: string
    @ApiProperty()
    title: string
    @ApiProperty()
    body: string
    @ApiProperty()
    author: AuthorNoteUpdatedResponse
    @ApiProperty()
    createdAt: Date
    @ApiProperty()
    updatedAt: Date
    constructor(id: string, title: string, body: string, author: AuthorNoteUpdatedResponse, createdAt: Date, updatedAt: Date) {
        this.id = id
        this.title = title
        this.body = body
        this.author = author
        this.createdAt = createdAt
        this.updatedAt = updatedAt
    }
}

export class NoteAuthorListResponse {
    @ApiProperty()
    id: string
    @ApiProperty()
    title: string
    @ApiProperty()
    createdAt: Date
    @ApiProperty()
    updatedAt: Date
    constructor(id: string, title: string, createdAt: Date, updatedAt: Date) {
        this.id = id
        this.title = title
        this.createdAt = createdAt
        this.updatedAt = updatedAt
    }
}

export class NoteDetailResponse {
    @ApiProperty()
    id: string
    @ApiProperty()
    title: string
    @ApiProperty()
    body: string
    @ApiProperty()
    createdAt: Date
    @ApiProperty()
    updatedAt: Date
    constructor(id: string, title: string, body: string, createdAt: Date, updatedAt: Date) {
        this.id = id
        this.title = title
        this.body = body
        this.createdAt = createdAt
        this.updatedAt = updatedAt
    }
}
