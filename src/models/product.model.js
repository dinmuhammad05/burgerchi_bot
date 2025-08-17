import { DataTypes } from "sequelize";
import sequelize from "../db/index.js";

const Products = sequelize.define(
    "burgerchi_productlar",
    {
        nomi: { type: DataTypes.STRING, allowNull: true },
        narxi: { type: DataTypes.STRING, allowNull: true },
        image_url: { type: DataTypes.STRING, allowNull: true },
    },
    {
        freezeTableName: true,
    }
);

export default Products;
