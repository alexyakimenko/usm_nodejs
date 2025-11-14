import {Request, Response} from "express";
import {Role, User} from "@/models";
import config from "@/config/config"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import ValidationError, {ValidationErrorDetails} from "@/errors/app/validation/validation.error";
import AuthenticationError from "@/errors/app/authentication/authentication.error";

export const register = async (req: Request, res: Response) => {
    const {username, email, password} = req.body;

    if (!username || !email || !password) {
        const errors: ValidationErrorDetails = {}
        if(!username) errors.username = "Username is required"
        if(!email) errors.email = "Email is required"
        if(!password) errors.password = "Password is required"

        throw new ValidationError("Validation errors", errors);
    }

    const takenUsername = await User.findOne({where: {username}});
    if (takenUsername) {
        throw new AuthenticationError("Username already exists")
    }

    const takenEmail = await User.findOne({where: {email}});
    if (takenEmail) {
        throw new AuthenticationError("Email already exists")
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
        username,
        email,
        password: hash,
    })

    // @ts-ignore
    await user.addRole(await Role.findOne({where: {name: 'user'}}))

    return res.status(201).send({
        message: 'User successfully registered',
    })
}

export const login = async (req: Request, res: Response) => {
    const {username, password} = req.body;

    if (!username || !password) {
        const errors: ValidationErrorDetails = {}
        if(!username) errors.username = "Username is required"
        if(!password) errors.password = "Password is required"

        throw new ValidationError("Validation errors", errors);
    }

    const user = await User.findOne({where: {username}});
    if (!user) {
        throw new AuthenticationError("Invalid credentials")
    }

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
        throw new AuthenticationError("Invalid credentials")
    }

    const token = jwt.sign({
        uid: user.id,
        username: user.username,
    },
    config.auth.jwt,{
        expiresIn: '24h',
    });

    return res.status(200).send({token})
}

export const profile = async (req: Request, res: Response) => {
    const tokenUser = (req as any).user;
    if (!tokenUser) {
        throw new AuthenticationError("Unauthorized");
    }

    const user = await User.findByPk(tokenUser.uid, {
        attributes: ['id', 'username', 'email' ],
        include: [{model: Role, as: "roles", attributes: ['name'], through: {attributes: []}},],
    })

    return res.status(200).send({user})
}