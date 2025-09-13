import { Body, Controller, Delete, Get, HttpCode, Inject, Param, Post, Put, Query, Request } from '@nestjs/common';
import { StatusCodes } from 'http-status-codes';
import { NoteAuthorListResponse, NoteDetailResponse, NoteInsertedResponse, NoteInsertRequest, NoteUpdatedResponse, NoteUpdateRequest } from './notes-model';
import { NOTES_SERVICE_TOKENS } from 'src/services/notes/token/notes.token';
import { INotesQueryService } from 'src/services/notes/inotes-query.service';
import { INotesService } from 'src/services/notes/inotes.service';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { NOTES_CONTROLLER_TOKENS } from './token/notes.token';
import { INotesMapping } from './inotes-mapping';

@Controller('author/:authorId/notes')
export class NotesController {

    constructor(
        @Inject(NOTES_SERVICE_TOKENS.SERVICE) private readonly service: INotesService,
        @Inject(NOTES_SERVICE_TOKENS.QUERY_SERVICE) private readonly queryService: INotesQueryService,
        @Inject(NOTES_CONTROLLER_TOKENS.MAPPING) private readonly mapping: INotesMapping
    ) { }

    @ApiBearerAuth()
    @ApiCreatedResponse({
        description: 'Note created',
        type: NoteInsertedResponse
    })
    @Post()
    @HttpCode(StatusCodes.CREATED)
    public async insert(@Request() request: Request, @Param('authorId') authorId: string, @Body() body: NoteInsertRequest): Promise<NoteInsertedResponse> {
        const dto = await this.service.insert({ ...body, author: request['user'].id }, authorId)
        return this.mapping.toNoteInsertedResponse(dto)
    }

    @ApiBearerAuth()
    @ApiOkResponse({
        description: 'Note updated',
        type: NoteUpdatedResponse
    })
    @Put(':id')
    @HttpCode(StatusCodes.OK)
    public async update(@Request() request: Request, @Param('id') id: string, @Param('authorId') authorId: string, @Body() body: NoteUpdateRequest): Promise<NoteUpdatedResponse> {
        const dto = await this.service.update({ ...body, id, author: request['user'].id }, authorId)
        return this.mapping.toNoteUpdatedResponse(dto)
    }

    @ApiBearerAuth()
    @ApiOkResponse({
        description: 'Note deleted',
    })
    @Delete(':id')
    @HttpCode(StatusCodes.NO_CONTENT)
    public async delete(@Request() request: Request, @Param('authorId') authorId: string, @Param('id') id: string): Promise<void> {
        await this.service.delete(id, authorId, request['user'].id)
    }

    @ApiBearerAuth()
    @ApiOkResponse({
        description: 'Note updated',
        type: NoteAuthorListResponse,
        isArray: true
    })
    @Get('')
    @ApiQuery({
        name: 'query',
        required: false,
        description: 'Filter notes by author',
        type: String,
    })
    public async findByAuthorLikeText(@Request() request: Request, @Param('authorId') authorId: string, @Query('query') query: string): Promise<NoteAuthorListResponse[]> {
        const dto = await this.queryService.findByAuthorAndLikeText(authorId, request['user'].id, query)
        return this.mapping.toNoteAuthorListResponse(dto)
    }

    @ApiBearerAuth()
    @ApiOkResponse({
        description: 'Note updated',
        type: NoteDetailResponse,
    })
    @Get(':id')
    public async findById(@Request() request: Request, @Param('authorId') authorId: string, @Param('id') id: string): Promise<NoteDetailResponse> {
        const dto = await this.queryService.findById(id, authorId, request['user'].id)
        return this.mapping.toNoteDetailResponse(dto)
    }

}
