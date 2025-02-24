import { Module } from '@nestjs/common';
import { DbModule } from 'src/db/db.module';
import { AuthService } from './auth/impl/auth.service';
import { LocalStrategy } from './auth/impl/local.auth';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './auth/impl/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { NOTES_SERVICE_TOKENS } from './notes/token/notes.token';
import { NotesQueryService } from './notes/impl/notes-query.service';
import { NotesService } from './notes/impl/notes.service';
import { USERS_SERVICE_TOKENS } from './users/token/users.token';
import { UsersQueryService } from './users/impl/users-query.service';
import { UsersService } from './users/impl/users.service';
import { AUTH_SERVICE_TOKENS } from './auth/tokens/auth.token';

@Module({
    imports: [DbModule, JwtModule],
    exports: [NOTES_SERVICE_TOKENS.QUERY_SERVICE,
    NOTES_SERVICE_TOKENS.SERVICE,
    USERS_SERVICE_TOKENS.QUERY_SERVICE,
    USERS_SERVICE_TOKENS.SERVICE,
    AUTH_SERVICE_TOKENS.SERVICE],

    providers: [{ provide: NOTES_SERVICE_TOKENS.QUERY_SERVICE, useClass: NotesQueryService },
    { provide: USERS_SERVICE_TOKENS.QUERY_SERVICE, useClass: UsersQueryService },
    { provide: NOTES_SERVICE_TOKENS.SERVICE, useClass: NotesService },
    { provide: USERS_SERVICE_TOKENS.SERVICE, useClass: UsersService },
    { provide: AUTH_SERVICE_TOKENS.SERVICE, useClass: AuthService },
        LocalStrategy,
    {
        provide: APP_GUARD,
        useClass: AuthGuard
    }]
})
export class ServicesModule { }
