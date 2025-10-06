import type {Status, Task} from '../models/todo.ts'

interface ITodoRepository {
    get(): Task[]
    add(task: Task): void
    toggle(id: string): void
    remove(id: string): void
}

class TodoRepository implements ITodoRepository {
    tasks: Task[] = []

    get(status?: Status): Task[] { 
        if(status === 'active') {
            return this.tasks.filter(task => !task.completed)
        }
        if(status === 'completed') {
            return this.tasks.filter(task => task.completed)
        }

        return this.tasks
    }

    add(task: Task): void {
        this.tasks.push(task)
    }

    toggle(id: string): void {
        const task = this.tasks.find(task => {
            return task.id === id
        })

        if(!task) return

        task.completed = !task.completed
    }

    remove(id: string): void {
        this.tasks = this.tasks.filter(task => task.id !== id)
    }
}

export default new TodoRepository()