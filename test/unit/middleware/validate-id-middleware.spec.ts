import { ValidateIDMiddleware } from "src/middleware/validate-id-middleware"
import { Request, Response, NextFunction } from 'express';
import { ValidateUUIDMiddleware } from "src/middleware/validate-uuid-middleware"
import { ObjectId } from "mongodb";
import { faker } from "@faker-js/faker/.";
import { ConstraintInfo } from "src/exception";

describe('validateIdMiddlewate', () => {
    let validateIdMiddleware: ValidateUUIDMiddleware

    beforeEach(() => validateIdMiddleware = new ValidateIDMiddleware())

    it('when send valid uuid then call next', () => {
        let req: Partial<Request> = { params: { id: new ObjectId().toHexString() } }
        let res: Partial<Response>
        let next: Partial<NextFunction> = () => { }
        expect(() => validateIdMiddleware.use(req as Request, res as Response, next as NextFunction)).not.toThrow()
    })

    test.each([
        [faker.lorem.word()],
        [''],
        [' '],
        [undefined],
        [null]
    ])('when send invalid uuid then throw error', (id) => {
        let req: Partial<Request> = { params: { id } }
        let res: Partial<Response>
        let next: Partial<NextFunction> = () => { throw new Error('Invalid call') }
        expect(() => validateIdMiddleware.use(req as Request, res as Response, next as NextFunction))
            .toThrow(expect.objectContaining({
                name: 'ConstraintViolationException',
                fieldError: [new ConstraintInfo('id', ['informe um identificador válido'])]
            }))
    })

})