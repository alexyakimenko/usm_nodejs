# Лабораторная работа №2. Работа с базой данных

## Цель работы

1. Научиться проектировать и реализовывать REST API с несколькими связанными сущностями.
2. Освоить работу с PostgreSQL в приложении на Node.js + Express с использованием ORM или сырых SQL-запросов.
3. Реализовать корректные операции CRUD, а также фильтрацию, сортировку и пагинацию.
4. Освоить принципы работы связей «один ко многим» (1:N) в реляционных базах данных.

## Шаг 1. Создание базы данных и моделей

В своем проекте я использую Sequelize ORM с PostgreSQL

Первым делом я определяю модели в приложении

```ts
export const CategoryFactory = (sequelize: Sequelize) => {
    Category.init({
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING(100), allowNull: false },
    }, {
        sequelize,
        tableName: 'categories',
        timestamps: true,
        underscored: true,
    });
    return Category;
};
```

После чего, создаю между ними связь

```ts
const Category = CategoryFactory(sequelize);
const Todo = TodoFactory(sequelize);

Category.hasMany(Todo, { foreignKey: 'category_id', as: 'todos' });
Todo.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });
```

И провожу миграции перед тем как запустить сервер

```ts
sequelize.sync({ alter: true }).then(() => {
    app.listen(config.app.port, () => {
        // ...
    });
});
```

## Шаг 2. Реализация API

Имея доступ к базе данных, остается лишь предоставить публичное API
Для этого создаю контроллеры `Categories` и `Todos` в которых определяю `CRUD` операции

```ts
// Например: getCategories
export const getCategories = async (req: Request, res: Response) => {
    const categories = await Category.findAll();
    res.json(categories);
}
```

В случае `Todos`, поскольку она может иметь категорию, то при выводе нужно выводить и ее

```ts
export const getTodo = async (req: Request, res: Response) => {
    const todo = await Todo.findByPk(req.params.id, { include: ["category"] }); // Сделать join с категориями
    if (!todo) return res.status(404).json({ message: "Todo not found" });
    res.json(todo);
};
```

## Шаг 3. Дополнительные задания. Фильтрация, поиск и пагинация

Поскольку многие из данных пунктов будут включать в себя запрос `where`, то создаю объект в котором накопительным образом будут собираться необходимые фильтры

```ts
    const where: any = {};
```

### Фильтрация 

Фильтрация по категории

```ts
if (category) where.category_id = category;
```

### Поиск

Поиск по названию 

```ts
if (search) where.title = { [Op.iLike]: `%${search}%` }; // case insensitive like :3
```

### Сортировка

Сортировка по указанному полю
Для начала отделяю их

```ts
const [sortField, sortOrder] = (sort as string).split(":");
```

Затем в методе поиска указываю их в поле для очереди

```ts
order: [[sortField, sortOrder.toUpperCase()]]
```

### Пагинация

При запросе указываю limit и offset, что помогает распределить получаемые сущности на страницы

Затем собрав все данные возвращаю их в формате удобном для имплементации пагинации клиентами

```ts
res.json({
    data: rows,
    meta: {
        total: count, // вернул метод FindAndCountAll
        count: rows.length,
        limit: Number(limit),
        pages: Math.ceil(count / Number(limit)),
        currentPage: Number(page)
    }
});
```

## Документация

Установив `Swagger` и настроив базовое отображение, ему необходимо указать файлы в которых находятся пути.
Затем при помощи документации описывается функционал метода.

```ts
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
```

Затем на созданной страничке с документацией появиться данный эндпоинт, и возможность его протестировать

## Контрольные вопросы

> Что такое реляционная база данных и какие преимущества она предоставляет?

Реляционная база данных - база данных, в которой данные хранятся в виде таблиц, где можно связать при помощи ключей

> Какие типы связей между таблицами существуют в реляционных базах данных?

1. Один к одному
2. Один ко многим
3. Многие ко многим

> Что такое RESTful API и для чего он используется?

RESTful API - архитектурный стиль передачи состояния в веб приложениях в формате JSON/XML, используется для общения между клиентом и сервером при помощи HTTP методов

> Что такое SQL-инъекция и как защититься от неё?

SQL-инъекция - уязвимость, при которой пользовательский ввод вставляется напрямую в SQL запрос

> В чем разница между ORM и сырыми SQL-запросами? Какие преимущества и недостатки у каждого подхода?

ORM - предоставляет простоту использования и уже определенную архитектуру, однако из-за огромного количества абстракций могут работать значительно медленнее, чем сырые SQL-запросы
Сырые SQL-запросы - больше мароки, больше кода, больше рисков ошибиться, однако дают гибкость и полный контроль над производительностью  