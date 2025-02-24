import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, NotFoundException } from "@nestjs/common";
import { ErrorResponse } from "./error-response";
import { Response } from 'express';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {

    catch(exception: NotFoundException, host: ArgumentsHost) {
        console.error(exception.stack)
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = HttpStatus.NOT_FOUND

        response
            .status(status)
            .json(new ErrorResponse(status, new Date(), exception.message))
    }

}