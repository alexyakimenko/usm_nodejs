import { Sequelize } from "sequelize";
import config from "@/config/config";
import {CategoryFactory} from "@/models/category.model";
import {TodoFactory} from "@/models/todo.model";
import {UserFactory} from "@/models/user.model";
import {RoleFactory, Roles, RoleSeeder} from "@/models/role.model";
import {PermissionFactory, Permissions, PermissionSeeder} from "@/models/permission.model";

const sequelize = new Sequelize(`postgres://${config.db.user}:${config.db.password}@localhost:${config.db.port}/${config.db.name}`, {
    logging: false,
});

const Category = CategoryFactory(sequelize);
const Todo = TodoFactory(sequelize);
const User = UserFactory(sequelize);
const Role = RoleFactory(sequelize);
const Permission = PermissionFactory(sequelize);

Category.hasMany(Todo, { foreignKey: 'category_id', as: 'todos' });
Todo.belongsTo(Category, { foreignKey: 'category_id', as: 'category' });
User.hasMany(Todo, { foreignKey: 'user_id', as: 'todos' });
Todo.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// RBAC
User.belongsToMany(Role, {
    through: "user_roles",
    foreignKey: 'user_id',
    as: 'roles',
    timestamps: false,
})
Role.belongsToMany(User, {
    through: "user_roles",
    foreignKey: 'role_id',
    as: 'users',
    timestamps: false,
});

Role.belongsToMany(Permission, {
    through: "role_permissions",
    foreignKey: 'role_id',
    as: 'permissions',
    timestamps: false
})
Permission.belongsToMany(Role, {
    through: "role_permissions",
    foreignKey: 'permission_id',
    as: 'roles',
    timestamps: false
})

const role_permission = {
    [Roles.Admin]: [Permissions.ChangeCategory, Permissions.ChangeTodo, Permissions.ViewTodo],
    [Roles.Manager]: [Permissions.ChangeCategory, Permissions.ViewTodo],
    [Roles.User]: [Permissions.ViewTodo],
}

export const seeders = async () => {
    const [permissions, roles] = await Promise.all([
        await PermissionSeeder(),
        await RoleSeeder(),
    ])

    roles.forEach(([role]) => {
        // @ts-ignore
        role.setPermissions(
            permissions.map(([permission]) => permission)
                .filter(permission => role_permission[role.name as Roles].includes(permission.name as Permissions))
        )
    })
}

export { sequelize, Todo, Category, User, Role, Permission };
