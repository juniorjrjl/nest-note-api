import { Body, Controller, Delete, Get, HttpCode, Inject, Param, Post, Put, Query } from '@nestjs/common';
import { StatusCodes } from 'http-status-codes';
import { NoteAuthorListResponse, NoteDetailResponse, NoteInsertedResponse, NoteInsertRequest, NoteUpdatedResponse, NoteUpdateRequest } from './notes-model';
import { NOTES_SERVICE_TOKENS } from 'src/services/notes/token/notes.token';
import { INotesQueryService } from 'src/services/notes/inotes-query.service';
import { INotesService } from 'src/services/notes/inotes.service';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { NOTES_CONTROLLER_TOKENS } from './token/notes.token';
import { INotesMapping } from './inotes-mapping';

@Controller('notes')
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
    public async insert(@Body() body: NoteInsertRequest): Promise<NoteInsertedResponse> {
        const dto = await this.service.insert({ ...body, author: '678bbe6894c9c00d25dfc0a6' })
        return this.mapping.toNoteInsertedResponse(dto)
    }

    @ApiBearerAuth()
    @ApiOkResponse({
        description: 'Note updated',
        type: NoteUpdatedResponse
    })
    @Put(':id')
    @HttpCode(StatusCodes.OK)
    public async update(@Param('id') id: string, @Body() body: NoteUpdateRequest): Promise<NoteUpdatedResponse> {
        const dto = await this.service.update({ ...body, id })
        return this.mapping.toNoteUpdatedResponse(dto)
    }

    @ApiBearerAuth()
    @ApiOkResponse({
        description: 'Note deleted',
    })
    @Delete(':id')
    @HttpCode(StatusCodes.NO_CONTENT)
    public async delete(@Param('id') id: string): Promise<void> {
        await this.service.delete(id)
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
    public async findByAuthorLikeText(@Query('query') query: string): Promise<NoteAuthorListResponse[]> {
        const dto = await this.queryService.findByAuthorAndLikeText('678bbe6894c9c00d25dfc0a6', query)
        return this.mapping.toNoteAuthorListResponse(dto)
    }

    @ApiBearerAuth()
    @ApiOkResponse({
        description: 'Note updated',
        type: NoteDetailResponse,
    })
    @Get(':id')
    public async findById(@Param('id') id: string): Promise<NoteDetailResponse> {
        const dto = await this.queryService.findById(id)
        return this.mapping.toNoteDetailResponse(dto)
    }

}
