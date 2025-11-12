import {Request, Response} from "express";
import {Category} from "@/models";

export const getCategories = async (req: Request, res: Response) => {
    const categories = await Category.findAll();
    res.json(categories);
}

export const getCategory = async (req: Request, res: Response) => {
    const category = await Category.findByPk(req.params.id);

    if (!category)
        return res.status(404).json({ message: "Category not found" });

    res.json(category);
}

export const createCategory = async (req: Request, res: Response) => {
    const { name } = req.body;
    const category = await Category.create({ name });
    return res.status(201).json(category);
}

export const updateCategory = async (req: Request, res: Response) => {
    const category = await Category.findByPk(req.params.id);

    if (!category)
        return res.status(404).json({ message: "Category not found" });

    category.name = req.body.name;

    await category.save();
    res.json(category);
}

export const deleteCategory = async (req: Request, res: Response) => {
    const category = await Category.findByPk(req.params.id);

    if (!category)
        return res.status(404).json({ message: "Category not found" });

    await category.destroy();
    res.status(204).send();
};