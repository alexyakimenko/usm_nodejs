import AppError from "@/errors/app/app.error";

class NotFoundError extends AppError {
    constructor(message: string = 'Resource Not Found') {
        super(message, 404);
        this.name = "NotFoundError";
    }
}

export default NotFoundError;