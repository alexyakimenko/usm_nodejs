import AppError from "@/errors/app/app.error";

export interface ValidationErrorDetails {
    [key: string]: string;
}

class ValidationError extends AppError {
    public readonly errors: ValidationErrorDetails;

    constructor(message: string = 'Validation Failed', errors: ValidationErrorDetails) {
        super(message, 400);
        this.errors = errors;
        this.name = "ValidationError";
    }
}

export default ValidationError;