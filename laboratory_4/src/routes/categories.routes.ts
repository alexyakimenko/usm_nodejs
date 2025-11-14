import {Router} from "express";
import * as controller from "@/controllers/categories.controller";
import {authenticate, authorize} from "@/middleware/auth.middleware";
import {Permissions} from "@/models/permission.model";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Управление категориями задач
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Получить список всех категорий
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Список категорий
 */
router.get("/", [authenticate], controller.getCategories);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Получить категорию по ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Найдена
 *       404:
 *         description: Не найдена
 */
router.get("/:id", [authenticate], controller.getCategory);

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Создать новую категорию
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Учёба"
 *     responses:
 *       201:
 *         description: Создана
 */
router.post("/", [authenticate, authorize([Permissions.ChangeCategory])], controller.createCategory);

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Изменить категорию
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Обновлена
 *       404:
 *         description: Не найдена
 */
router.put("/:id", [authenticate, authorize([Permissions.ChangeCategory])], controller.updateCategory);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Удалить категорию
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Успешное удаление
 *       404:
 *         description: Не найдена
 */
router.delete("/:id", [authenticate, authorize([Permissions.ChangeCategory])], controller.deleteCategory);

export default router;
