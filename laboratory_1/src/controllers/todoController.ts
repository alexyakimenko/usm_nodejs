import type { Request, Response } from "express"
import { v4 as uuidv4 } from 'uuid'

import todoRepository from "../repository/todoRepository.ts"
import type { Status, Task } from "../models/todo.ts"

class TodoController {
    get(req: Request, res: Response) {
        const status = req.query.status as Status

        const tasks = todoRepository.get(status)

        res.render('index', {tasks, status})
    }

    add(req: Request, res: Response) {
        const title = req.body.title

        const task: Task = {
            id: uuidv4(),
            title: title,
            completed: false
        }

        todoRepository.add(task)

        res.redirect('/') // main page
    }

    renderAdd(req: Request, res: Response) {
        res.render('new')
    }

    toggle(req: Request, res: Response) {
        const id = req.params.id

        todoRepository.toggle(id)

        res.redirect('/')
    }


    delete(req: Request, res: Response) {
        const id = req.params.id

        todoRepository.remove(id)

        res.redirect('/')
    }
}

export default new TodoController()