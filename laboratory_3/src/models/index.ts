import { Sequelize } from "sequelize";
import config from "@/config/config";
import {CategoryFactory} from "@/models/category.model";
import {TodoFactory} from "@/models/todo.model";
import {UserFactory} from "@/models/user.model";

const sequelize = new Sequelize(`postgres://${config.db.user}:${config.db.password}@localhost:${config.db.port}/${config.db.name}`, {
    logging: false,
});

const Category = CategoryFactory(sequelize);
const Todo = TodoFactory(sequelize);
const User = UserFactory(sequelize);

Category.hasMany(Todo, { foreignKey: 'category_id', as: 'todos' });
Todo.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });
User.hasMany(Todo, { foreignKey: 'user_id', as: 'todos' });
Todo.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

export { sequelize, Todo, Category, User };
