import { Body, Controller, Delete, HttpCode, Inject, Param, Post, Put, Request } from '@nestjs/common';
import { StatusCodes } from 'http-status-codes';
import { IUsersService } from 'src/services/users/iusers.service';
import { LoginInfoRequest, LoginInfoResponse, UserChangePasswordRequest, UserInsertedResponse, UserInsertRequest, UserUpdatedResponse, UserUpdateRequest } from './users-model';
import { Public } from 'src/services/auth/decorators/public.decorator';
import { USERS_SERVICE_TOKENS } from 'src/services/users/token/users.token';
import { IAuthService } from 'src/services/auth/iauth.service';
import { AUTH_SERVICE_TOKENS } from 'src/services/auth/tokens/auth.token';
import { USERS_CONTROLLER_TOKENS } from './token/users.token';
import { IUsersMapping } from './iusers-mapping';
import { ApiBearerAuth, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';

@Controller('users')
export class UsersController {

    constructor(
        @Inject(AUTH_SERVICE_TOKENS.SERVICE) private readonly authService: IAuthService,
        @Inject(USERS_SERVICE_TOKENS.SERVICE) private readonly service: IUsersService,
        @Inject(USERS_CONTROLLER_TOKENS.MAPPING) private readonly mapping: IUsersMapping
    ) { }

    @ApiCreatedResponse({
        description: 'User created',
        type: UserInsertedResponse
    })
    @Public()
    @Post('register')
    @HttpCode(StatusCodes.CREATED)
    public async register(@Body() body: UserInsertRequest): Promise<UserInsertedResponse> {
        const dto = await this.service.insert(body)
        return this.mapping.toUserInsertedResponse(dto)
    }

    @ApiOperation({ summary: 'Login and generate JWT token' })
    @ApiCreatedResponse({
        description: 'User loged',
        type: LoginInfoResponse
    })
    @Public()
    @Post('login')
    @HttpCode(StatusCodes.CREATED)
    public async login(@Body() body: LoginInfoRequest): Promise<LoginInfoResponse> {
        const dto = await this.authService.generateToken(body.email, body.password)
        return this.mapping.toLoginInfoResponse(dto)
    }


    @ApiBearerAuth()
    @ApiOkResponse({
        description: 'user updated',
        type: UserUpdatedResponse
    })
    @Put()
    @HttpCode(StatusCodes.OK)
    public async update(@Request() request: Request, @Body() body: UserUpdateRequest): Promise<UserUpdatedResponse> {
        const dto = await this.service.update({ ...body, id: request['user'].id })
        return this.mapping.toUserUpdatedResponse(dto)
    }

    @ApiBearerAuth()
    @ApiNoContentResponse({
        description: 'Password changed'
    })
    @Put('password/change')
    @HttpCode(StatusCodes.NO_CONTENT)
    public async changePassword(@Body() body: UserChangePasswordRequest) {
        await this.service.changePassword(body)
    }

    @ApiBearerAuth()
    @ApiNoContentResponse({
        description: 'User deleted'
    })
    @Delete(':id')
    @HttpCode(StatusCodes.NO_CONTENT)
    public async delete(@Param('id') id: string): Promise<void> {
        await this.service.delete(id)
    }

}
