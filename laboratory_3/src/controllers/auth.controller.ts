import {Request, Response} from "express";
import {Role, User} from "@/models";
import config from "@/config/config"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const register = async (req: Request, res: Response) => {
    const {username, email, password} = req.body;

    if (!username || !email || !password) {
        return res.status(400).send({message: 'Username, email and password is required'});
    }

    const takenUsername = await User.findOne({where: {username}});
    if (takenUsername) {
        return res.status(400).send({message: 'Username already exists'});
    }

    const takenEmail = await User.findOne({where: {email}});
    if (takenEmail) {
        return res.status(400).send({message: 'Email already exists'});
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
        return res.status(400).send({message: 'Username and password is required'});
    }

    const user = await User.findOne({where: {username}});
    if (!user) {
        return res.status(400).send({message: 'Username or password is incorrect'});
    }

    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
        return res.status(400).send({message: 'Username or password is incorrect'});
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
        return res.status(401).send({message: 'Unauthorized'});
    }

    const user = await User.findByPk(tokenUser.uid, {
        attributes: ['id', 'username', 'email' ],
        include: [{model: Role, as: "roles", attributes: ['name'], through: {attributes: []}},],
    })

    return res.status(200).send({user})
}