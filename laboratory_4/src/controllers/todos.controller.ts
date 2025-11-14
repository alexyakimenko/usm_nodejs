import { Request, Response } from "express";
import { Op } from "sequelize";
import {Category, Todo} from "@/models";
import NotFoundError from "@/errors/app/not-found/not-found.error";

export const getTodos = async (req: Request, res: Response) => {
    const { category, search, sort = "created_at:desc", page = 1, limit = 10 } = req.query;

    const where: any = {};
    if (category) where.category_id = category;
    if (search) where.title = { [Op.iLike]: `%${search}%` };

    const [sortField, sortOrder] = (sort as string).split(":");

    const offset = (Number(page) - 1) * Number(limit);

    const { rows, count } = await Todo.findAndCountAll({
        where,
        include: [{ model: Category, as: "category", attributes: ["id", "name"] }],
        order: [[sortField, sortOrder.toUpperCase()]],
        limit: Number(limit),
        offset
    });

    res.json({
        data: rows,
        meta: {
            total: count,
            count: rows.length,
            limit: Number(limit),
            pages: Math.ceil(count / Number(limit)),
            currentPage: Number(page)
        }
    });
};

export const getTodo = async (req: Request, res: Response) => {
    const todo = await Todo.findByPk(req.params.id, { include: ["category"] });
    if (!todo) throw new NotFoundError("Todo not found");
    res.json(todo);
};

export const createTodo = async (req: Request, res: Response) => {
    const { title, category_id, due_date } = req.body;

    const user_id = (req as any).user.uid;

    const todo = await Todo.create({ title, category_id, due_date, user_id });
    res.status(201).json(todo);
};

export const updateTodo = async (req: Request, res: Response) => {
    const todo = await Todo.findByPk(req.params.id);
    if (!todo) throw new NotFoundError("Todo not found");

    const { title, completed, category_id, due_date } = req.body;
    if (title !== undefined) todo.title = title;
    if (completed !== undefined) todo.completed = completed;
    if (category_id !== undefined) todo.category_id = category_id;
    if (due_date !== undefined) todo.due_date = due_date;

    await todo.save();
    res.json(todo);
};

export const toggleTodo = async (req: Request, res: Response) => {
    const todo = await Todo.findByPk(req.params.id);
    if (!todo) throw new NotFoundError("Todo not found");
    todo.completed = !todo.completed;
    await todo.save();
    res.json(todo);
};

export const deleteTodo = async (req: Request, res: Response) => {
    const todo = await Todo.findByPk(req.params.id);
    if (!todo) throw new NotFoundError("Todo not found");
    await todo.destroy();
    res.status(204).send();
};

