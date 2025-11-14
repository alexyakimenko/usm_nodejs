import AppError from "@/errors/app/app.error";

class ForbiddenError extends AppError {
    constructor(message: string = "Forbidden") {
        super(message, 403);
        this.name = "Forbidden";
    }
}

export default ForbiddenError;