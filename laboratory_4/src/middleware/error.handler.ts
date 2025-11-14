import {NextFunction, Request, Response} from "express";
import AppError from "@/errors/app/app.error";
import ValidationError, {ValidationErrorDetail} from "@/errors/app/validation/validation.error";

interface ResponseObject {
    status: "error" | "success";
    message: string;
    errors?: ValidationErrorDetail[];
    stack?: string;
}

const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
    const isDev = process.env.NODE_ENV === 'development';
    const code = error instanceof AppError ? error.code : 500;

    const response: ResponseObject = {
        status: "error",
        message: error.message || "Unexpected error",
    }

    if (error instanceof ValidationError) {
        response.errors = error.errors;
    }

    if (isDev) {
        response.stack = error.stack;
    }

    console.error(`[${new Date().toISOString()}] ${error.name}: ${error.message}`);

    res.status(code).json(response);
}

export default errorHandler;