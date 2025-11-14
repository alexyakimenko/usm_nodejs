import AppError from "@/errors/app/app.error";

class AuthenticationError extends AppError {
    constructor(message: string = "Authentication Failed") {
        super(message, 401);
        this.name = "AuthenticationError";
    }
}

export default AuthenticationError;