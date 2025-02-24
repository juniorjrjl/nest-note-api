export class ConstraintViolationException extends Error {

    fieldError: ConstraintInfo[]

    constructor(message: string, fieldError: ConstraintInfo[]) {
        super(message)
        this.fieldError = fieldError
    }

}

export class ConstraintInfo {
    field: string
    messages: string[]

    constructor(field: string, messages: string[]) {
        this.field = field
        this.messages = messages
    }
}
