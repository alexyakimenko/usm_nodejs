import { DataTypes, Model, Sequelize } from "sequelize";

export class Category extends Model {
    public id!: number;
    public name!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

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
