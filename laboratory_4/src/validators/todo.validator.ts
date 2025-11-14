import {body, param} from "express-validator";

const id = param("id")
    .exists()

const title = body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({min: 3})
    .withMessage("Title should be at least 3 characters")


export const createTodoValidator = [title]
export const paramTodoValidator = [id]
