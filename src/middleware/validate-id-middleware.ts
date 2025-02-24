import { Injectable } from "@nestjs/common";
import { ValidateUUIDMiddleware } from "./validate-uuid-middleware";

@Injectable()
export class ValidateIDMiddleware extends ValidateUUIDMiddleware {

    constructor() {
        super('id')
    }

}