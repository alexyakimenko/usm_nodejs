import {DataTypes, Model, Sequelize} from "sequelize";

export class Permission extends Model {
    public id!: number;
    public name!: string;
}

export const PermissionFactory = (sequelize: Sequelize) => {
    Permission.init({
            id: {type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true},
            name: {type: DataTypes.STRING(100), allowNull: false, unique: true},
        },
        {
            sequelize,
            tableName: 'permissions',
            timestamps: false,
        }
    )
    return Permission;
}

export enum Permissions {
    ChangeTodo = 'change_todo',
    ViewTodo = 'view_todo',
    ChangeCategory = 'change_category',
}

export const PermissionSeeder = async () => {
    return await Promise.all(
        Object.values(Permissions).map(permission => Permission.findOrCreate({where: {name: permission}}))
    );
}