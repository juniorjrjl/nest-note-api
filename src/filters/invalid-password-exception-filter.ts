import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { InvalidPasswordException } from "src/services/users/users-exception";
import { Response } from 'express';
import { ErrorResponse } from "./error-response";

@Catch(InvalidPasswordException)
export class InvalidPasswordExceptionFilter implements ExceptionFilter {

    catch(exception: InvalidPasswordException, host: ArgumentsHost) {
        console.error(exception.stack)
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = HttpStatus.BAD_REQUEST

        response
            .status(status)
            .json(new ErrorResponse(status, new Date(), exception.message))
    }

}