import {Router} from 'express'
import todoController from '../controllers/todoController.ts'
import aboutController from '../controllers/aboutController.ts'
import { validate } from '../middleware/validate.ts'
import { taskSchema } from '../models/todo.ts'

const router = Router()

router.get('/', todoController.get)

router.get('/new', todoController.renderAdd)
router.post('/new', validate(taskSchema), todoController.add)

router.post('/:id/toggle', todoController.toggle)
router.post('/:id/delete', todoController.delete)

router.get('/about', aboutController.render)


export default router