import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { Response } from 'express';
import { ConstraintViolationException } from "src/exception";
import { ErrorResponse, FieldError } from "./error-response";

@Catch(ConstraintViolationException)
export class ConstraintViolationExceptionFilter implements ExceptionFilter {

    catch(exception: ConstraintViolationException, host: ArgumentsHost) {
        console.error(exception.stack)
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = HttpStatus.BAD_REQUEST

        const errors = exception.fieldError.map(f => f.messages.map(m => new FieldError(f.field, m))).flat()

        response
            .status(status)
            .json(new ErrorResponse(status, new Date(), exception.message, errors))
    }

}