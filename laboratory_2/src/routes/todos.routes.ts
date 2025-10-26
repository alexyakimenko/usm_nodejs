import { Router } from "express";
import * as controller from "@/controllers/todos.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Todos
 *   description: Управление задачами
 */

/**
 * @swagger
 * /todos:
 *   get:
 *     summary: Получить список всех задач
 *     tags: [Todos]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: integer
 *         description: ID категории для фильтрации
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Поиск по названию
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Поле и порядок сортировки
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Номер страницы
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Количество элементов на странице
 *     responses:
 *       200:
 *         description: Список задач с пагинацией
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       completed:
 *                         type: boolean
 *                       due_date:
 *                         type: string
 *                         format: date-time
 *                       category:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                 meta:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     count:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *                     currentPage:
 *                       type: integer
 */
router.get("/", controller.getTodos);

/**
 * @swagger
 * /todos/{id}:
 *   get:
 *     summary: Получить задачу по ID
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Найденная задача
 *       404:
 *         description: Задача не найдена
 */
router.get("/:id", controller.getTodo);

/**
 * @swagger
 * /todos:
 *   post:
 *     summary: Создать новую задачу
 *     tags: [Todos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Сдать лабораторную работу"
 *               category_id:
 *                 type: integer
 *               due_date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Задача успешно создана
 */
router.post("/", controller.createTodo);

/**
 * @swagger
 * /todos/{id}:
 *   put:
 *     summary: Изменить задачу
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               completed:
 *                 type: boolean
 *               category_id:
 *                 type: integer
 *               due_date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Задача успешно обновлена
 *       404:
 *         description: Не найдено
 */
router.put("/:id", controller.updateTodo);

/**
 * @swagger
 * /todos/{id}/toggle:
 *   patch:
 *     summary: Переключить статус задачи (выполнена/не выполнена)
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Статус успешно изменён
 *       404:
 *         description: Задача не найдена
 */
router.patch("/:id/toggle", controller.toggleTodo);

/**
 * @swagger
 * /todos/{id}:
 *   delete:
 *     summary: Удалить задачу
 *     tags: [Todos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Успешное удаление
 *       404:
 *         description: Не найдено
 */
router.delete("/:id", controller.deleteTodo);

export default router;
