import { DataTypes, Model, Sequelize } from "sequelize";

export class Todo extends Model {
    public id!: string;
    public title!: string;
    public completed!: boolean;
    public due_date?: Date;
    public category_id?: number;
    public user_id?: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const TodoFactory = (sequelize: Sequelize) => {
    Todo.init({
        id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
        title: { type: DataTypes.STRING(120), allowNull: false, validate: { len: [2, 120] } },
        completed: { type: DataTypes.BOOLEAN, defaultValue: false },
        due_date: { type: DataTypes.DATE, allowNull: true },
        category_id: { type: DataTypes.INTEGER, allowNull: true },
    }, {
        sequelize,
        tableName: 'todos',
        timestamps: true,
        underscored: true,
    });
    return Todo;
};
