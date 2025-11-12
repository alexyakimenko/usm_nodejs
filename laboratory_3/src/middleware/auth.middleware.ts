import {NextFunction, Request, Response} from 'express'
import jwt from "jsonwebtoken";
import config from "@/config/config";
import {Permission, Role, Todo, User} from "@/models";
import {Permissions} from "@/models/permission.model";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header) {
        return res.status(401).json({
            message: 'Unauthorized',
        })
    }
    const token = header.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            message: 'Unauthorized',
        })
    }

    try {
        (req as any).user = jwt.verify(token, config.auth.jwt);
        next()
    } catch (error) {
        return res.status(401).json({
            message: 'Invalid token',
        })
    }

}


export const authorize = (permissions: Permissions[], ownership: boolean = false) => async (req: Request, res: Response, next: NextFunction) => {
    const jwtUser = (req as any).user;
    if (!jwtUser) {
        return res.status(401).json({
            message: 'Unauthorized',
        })
    }

    if(ownership) {
        const todoId = req.params.id;
        const todo = await Todo.findByPk(todoId);
        if(!todo) {
            return res.status(404).json({ message: 'Todo not found' })
        }
        if(todo.user_id === jwtUser.uid) {
           return next();
        }
    }

    const user = await User.findByPk(jwtUser.uid, {
        include: [{
            model: Role,
            as: "roles",
            attributes: ['id', 'name'],
            include: [{
                model: Permission,
                as: "permissions",
                attributes: ['name'],
            }]
        }],
    });


    // @ts-ignore
    const roles: Role[] = user.roles;

    let permissions_left = new Set([...permissions])

    roles.forEach(role => {
        // @ts-ignore
        const permissions: Permission[] = role.permissions;
        permissions.forEach(permission => {
            if(permissions_left.has(permission.name)) {
                permissions_left.delete(permission.name as Permissions);
            }
        })
    })

    if(permissions_left.size === 0) {
        return next()
    } else {
        return res.status(403).json({
            message: 'Permission Denied',
        })
    }
}