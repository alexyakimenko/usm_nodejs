import {NextFunction, Request, Response} from 'express'
import jwt from "jsonwebtoken";
import config from "@/config/config";
import {Permission, Role, Todo, User} from "@/models";
import {Permissions} from "@/models/permission.model";
import AuthenticationError from "@/errors/app/authentication/authentication.error";
import NotFoundError from "@/errors/app/not-found/not-found.error";
import ForbiddenError from "@/errors/app/forbidden/forbidden.error";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header) {
        throw new AuthenticationError("User unauthorized");
    }
    const token = header.split(' ')[1];

    if (!token) {
        throw new AuthenticationError("User unauthorized");
    }

    try {
        (req as any).user = jwt.verify(token, config.auth.jwt);
        next()
    } catch (error) {
        throw new AuthenticationError("Invalid Token");
    }

}


export const authorize = (permissions: Permissions[], ownership: boolean = false) => async (req: Request, res: Response, next: NextFunction) => {
    const jwtUser = (req as any).user;
    if (!jwtUser) {
        throw new AuthenticationError("User unauthorized");
    }

    if(ownership) {
        const todoId = req.params.id;
        const todo = await Todo.findByPk(todoId);
        if(!todo) {
            throw new NotFoundError(`Todo with id ${todoId} not found`);
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

    if (!user) {
        throw new NotFoundError(`User not found`);
    }

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
        throw new ForbiddenError(`Not enough permissions`);
    }
}