import {Model, DataTypes, Sequelize} from "sequelize";

export class User extends Model {
    public id!: number;
    public username!: string;
    public email!: string;
    public password!: string;
    public role!: 'user' | 'admin';
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
            role: {
                type: DataTypes.STRING(20),
                allowNull: false,
                defaultValue: 'user',
                validate: {
                    isIn: [['user', 'admin']],
                },
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