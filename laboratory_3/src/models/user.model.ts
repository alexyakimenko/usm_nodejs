import {Model, DataTypes, Sequelize} from "sequelize";
import {Role} from "@/models/role.model";

export class User extends Model {
    public id!: number;
    public username!: string;
    public email!: string;
    public password!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const UserFactory = (sequelize: Sequelize) => {
    User.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            username: {
                type: DataTypes.STRING(50),
                allowNull: false,
                unique: true,
                validate: {
                    len: [3, 50],
                },
            },
            email: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true,
                validate: {
                    isEmail: true,
                },
            },
            password: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: 'users',
            timestamps: true,
            underscored: true,
        }
    );

    return User;
};