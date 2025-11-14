import AppError from "@/errors/app/app.error";

class DatabaseError extends AppError {
    constructor(message: string = "Database Error") {
        super(message, 500);
        this.name = "DatabaseError";
    }
}

export default DatabaseError;