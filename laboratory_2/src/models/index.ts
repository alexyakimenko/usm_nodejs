import { Sequelize } from "sequelize";
import config from "@/config/config";
import {CategoryFactory} from "@/models/category.model";
import {TodoFactory} from "@/models/todo.model";

const sequelize = new Sequelize(`postgres://${config.db.user}:${config.db.password}@localhost:${config.db.port}/${config.db.name}`, {
    logging: false,
});

const Category = CategoryFactory(sequelize);
const Todo = TodoFactory(sequelize);

Category.hasMany(Todo, { foreignKey: 'category_id', as: 'todos' });
Todo.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });

export { sequelize, Todo, Category };
