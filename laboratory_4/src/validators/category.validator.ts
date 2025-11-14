import {body, param} from "express-validator";

const id = param("id")
    .trim()
    .notEmpty()
    .withMessage("Id is required")

const name = body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({min: 3})
    .withMessage("Name should be at least 3 characters")

export const createCategoryValidator = [name]
export const paramCategoryValidator = [id]