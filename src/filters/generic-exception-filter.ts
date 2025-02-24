import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, NotFoundException } from "@nestjs/common";
import { ErrorResponse } from "./error-response";
import { Response } from 'express';

@Catch()
export class GenericExceptionFilter implements ExceptionFilter {

    catch(exception: Error, host: ArgumentsHost) {
        console.error(exception.stack)
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = HttpStatus.INTERNAL_SERVER_ERROR

        response
            .status(status)
            .json(new ErrorResponse(status, new Date(), exception.message))
    }

}