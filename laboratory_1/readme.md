# Введение в Express.js. Создание простого приложения "ToDo List"

## Цель работы

1. Понять базовую связку Express + MVC: контроллеры, роуты, представления.
1. Научиться обрабатывать формы (GET/POST), передавать данные в шаблоны и делать redirect после успешной отправки.
1. Реализовать минимальное приложение без БД с хранением данных в памяти процесса.

## Условие

Разработать приложение "ToDo List" с возможностью:

- Просмотра списка задач.
- Создания новой задачи.
- Переключения статуса задачи (выполнена/не выполнена).
- Удаления задачи.

## Выполнение

### Конфиг

Отвечает за хранение конфигурационных данных

```ts
const config: Config = {
    server: {
        port: Number(process.env.PORT) ?? 3000
    },
    app: {
        name: process.env.APP_NAME ?? ""
    }
}
```

### Шаблонизатор

В качестве шаблонизаторы был выбран Pug 

```ts
app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

app.locals = { // global variable to all views
    site: {
        title: config.app.name
    }
}
```

### Другое

```ts
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
```

Для работы со статическими файлами используется `express.static()`
Для того чтобы в `req.body` передавались значения форм используется `express.urlencoded()`

### Todo Repository

```ts
interface ITodoRepository {
    get(): Task[]
    add(task: Task): void
    toggle(id: string): void
    remove(id: string): void
}
```

Предоставляет методы работы с задачами

### Task Model

```ts
export interface Task {
    id: string,
    title: string,
    completed: boolean
}

export type Status = 'active' | 'completed'

export const taskSchema = yup.object({
    title: yup.string().required('Title is required')
})
```

Объявляет интерфейс модели и тип выполненности, а также схема для валедации

### Todo Controller

Контроллер в основном подготавливает данные прежде чем вызвать метод репозитория
Например:

```ts
// Метод добавления нового таска
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
```

### Middleware

Для валидации был использован `yup`, для упрощениея работы с ним был создан специальный `middleware`

```ts
export const validate = (schema: Schema) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await schema.validate(req.body, { abortEarly: false });
    next(); 
  } catch (error: any) {
    res.status(400).render('error', { errors: error.errors });
  }
};
```

Проверяет и возвращает страницу с ошибкой, если таковые были найдены

### Router

```ts
const router = Router()

router.get('/', todoController.get)

router.get('/new', todoController.renderAdd)
router.post('/new', validate(taskSchema), todoController.add)

router.post('/:id/toggle', todoController.toggle)
router.post('/:id/delete', todoController.delete)

router.get('/about', aboutController.render)
```

Соеденяет методы контроллеров и `endpoint`-ы

### Pug 

Pug можно разделять на блоки что позволяет совмещать несколько файлов в одну разметку при помощи `block (block name)` и `extends (layout name)`

## Контрольные вопросы

Чем отличаются `HTML`-маршруты от `REST API`?
- `HTML`-маршруты - возвращают `html` разметку
- 'RestApi` возвращает `json` либо `xml`


Что такое `res.render` и `res.json`? В каких случаях что использовать?
- `res.render` возвращает `html` разметку при помощи указанного шаблонизатора
- `res.json` возвращает `json` 

Что такое middleware в Express и для чего используется `express.urlencoded`?
- `middleware` в `express ` это промежуточный функционал между конечной точкой и запросом, они позволяют менять запрос и менять функционал в зависимости от каких-либо условий
- `express.urlencoded` - `middleware`, который парсит данные из HTML-форм и возвращает их при помощи `req.body`
