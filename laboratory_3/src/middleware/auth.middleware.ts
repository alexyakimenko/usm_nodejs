import {NextFunction, Request, Response} from 'express'
import jwt from "jsonwebtoken";
import config from "@/config/config";
import {Todo} from "@/models";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header) {
        return res.status(401).send({
            message: 'Unauthorized',
        })
    }
    const token = header.split(' ')[1];

    if (!token) {
        return res.status(401).send({
            message: 'Unauthorized',
        })
    }

    try {
        (req as any).user = jwt.verify(token, config.auth.jwt);
        next()
    } catch (error) {
        return res.status(401).send({
            message: 'Invalid token',
        })
    }

}

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user) {
        return res.status(401).send({
            message: 'Unauthorized',
        })
    }

    if(user.role !== 'admin') {
        return res.status(401).send({
            message: 'Access denied',
        })
    }

    next()
}

export const isOwnerOrAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) {
        return res.status(401).send({
            message: 'Unauthorized',
        })
    }

    const todoId = req.params.id;

    const todo = await Todo.findByPk(todoId);
    if(!todo) return res.status(401).send({ message: 'Todo not found', })

    if(user.role === 'admin') next();

    if(todo.user_id !== user.id) return res.status(401).send({
        message: 'Access denied',
    })

    next();
}