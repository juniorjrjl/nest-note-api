export class ErrorResponse {
    status: number
    timestamp: Date
    message: string
    fields?: FieldError[]
    constructor(status: number, timestamp: Date, message: string, fields?: FieldError[]) {
        this.status = status
        this.timestamp = timestamp
        this.message = message
        this.fields = fields
    }
}

export class FieldError {
    name: string
    message: string
    constructor(name: string, message: string) {
        this.name = name
        this.message = message
    }
}