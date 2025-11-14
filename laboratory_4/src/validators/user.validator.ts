import {body} from "express-validator";

const username =
        body("username")
            .trim()
            .notEmpty()
            .withMessage("Username is required")
            .isLength({min: 3, max: 30})
            .withMessage("Username must be between 3 and 30 characters long");

const password =
        body("password")
            .trim()
            .notEmpty()
            .withMessage("Password is required")
            .isLength({min: 6})
            .withMessage("Password must be at least 6 characters long");

const email =
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email format")
        .normalizeEmail()
export const createUserValidator = [username, password, email];
export const loginValidator = [username, password];
