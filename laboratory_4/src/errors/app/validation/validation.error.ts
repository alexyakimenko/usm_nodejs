import AppError from "@/errors/app/app.error";

export interface ValidationErrorDetail {
    field: string;
    message: string;
}

class ValidationAppError extends AppError {
    public readonly errors: ValidationErrorDetail[];

    constructor(message: string = 'Validation Failed', errors: ValidationErrorDetail[]) {
        super(message, 400);
        this.errors = errors;
        this.name = "ValidationError";
    }
}

export default ValidationAppError;