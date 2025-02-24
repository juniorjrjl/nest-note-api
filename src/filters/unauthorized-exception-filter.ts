import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, UnauthorizedException } from "@nestjs/common";
import { ErrorResponse } from "./error-response";
import { Response } from 'express';

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {

    catch(exception: UnauthorizedException, host: ArgumentsHost) {
        console.error(exception.stack)
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = HttpStatus.UNAUTHORIZED

        response
            .status(status)
            .json(new ErrorResponse(status, new Date(), exception.message))
    }

}