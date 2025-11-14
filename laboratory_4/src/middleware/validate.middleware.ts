import {Request, Response, NextFunction} from "express";
import {validationResult} from "express-validator";
import ValidationError, {ValidationErrorDetail} from "@/errors/app/validation/validation.error";

const validate = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        const errorDetails: ValidationErrorDetail[] = errors.array().map(error => {
            const detail: ValidationErrorDetail = {
                field: 'unknown',
                message: error.msg
            }
            if(error.type === 'field') {
                detail.field = error.path
            }

            return detail;
        })

        throw new ValidationError("Validation Failed", errorDetails)
    }
    next()
}

export default validate;