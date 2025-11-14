import {Model, Sequelize, DataTypes} from "sequelize";
import {Permission} from "@/models/permission.model";

export class Role extends Model {
    public id!: number;
    public name!: string;
}

export const RoleFactory = (sequelize: Sequelize) => {
    Role.init({
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    },
    {
        sequelize,
        tableName: 'roles',
        timestamps: false,
    });
    return Role;
}

export enum Roles {
    Admin = "admin",
    Manager = "manager",
    User = "user",
}

export const RoleSeeder = async () => {
    return await Promise.all(
        Object.values(Roles).map(role => Role.findOrCreate({where: {name: role}}))
    );
}