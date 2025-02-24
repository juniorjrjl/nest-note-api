import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { ConstraintInfo, ConstraintViolationException } from 'src/exception';

export abstract class ValidateUUIDMiddleware implements NestMiddleware {

    private readonly paramName: string

    constructor(paramName: string) {
        this.paramName = paramName
    }

    use(req: Request, res: Response, next: NextFunction) {
        const uuid = req.params[this.paramName];
        if (!mongoose.Types.ObjectId.isValid(uuid)) {
            throw new ConstraintViolationException(
                'A requisição contém erros',
                [
                    new ConstraintInfo(
                        this.paramName,
                        ['informe um identificador válido']
                    )
                ]
            )
        }
        next();
    }

}