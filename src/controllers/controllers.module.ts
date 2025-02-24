import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { UsersController } from './users/users.controller';
import { NotesController } from './notes/notes.controller';
import { ServicesModule } from 'src/services/services.module';
import { NOTES_CONTROLLER_TOKENS } from './notes/token/notes.token';
import { NotesMapping } from './notes/notes-mapping';
import { USERS_CONTROLLER_TOKENS } from './users/token/users.token';
import { UsersMapping } from './users/users-mapping';
import { ValidateIDMiddleware } from 'src/middleware/validate-id-middleware';

@Module({
    imports: [ServicesModule],
    providers: [
        { provide: NOTES_CONTROLLER_TOKENS.MAPPING, useClass: NotesMapping },
        { provide: USERS_CONTROLLER_TOKENS.MAPPING, useClass: UsersMapping }
    ],
    controllers: [UsersController, NotesController]
})
export class ControllersModule implements NestModule {

    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(ValidateIDMiddleware)
            .forRoutes(
                { path: 'users/:id', method: RequestMethod.DELETE },
                { path: 'users/:id', method: RequestMethod.PUT },
                { path: 'notes/:id', method: RequestMethod.GET },
                { path: 'notes/:id', method: RequestMethod.PUT },
                { path: 'notes/:id', method: RequestMethod.DELETE },
            )
    }

}
