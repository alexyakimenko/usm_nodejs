class AppError extends Error {
    public readonly code: number;

    constructor(message: string, code: number = 500) {
        super(message);
        this.code = code;

        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;