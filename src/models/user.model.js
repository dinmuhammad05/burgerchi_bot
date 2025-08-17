import { DataTypes } from "sequelize";
import sequelize from "../db/index.js";

const Users = sequelize.define(
    "burgerchi_userlar",
    {
        chat_id: { type: DataTypes.BIGINT, allowNull: true },
        user_name: { type: DataTypes.STRING, allowNull: true },
        phone_number: { type: DataTypes.STRING, allowNull: true },
    },
    {
        freezeTableName: true, // 👈 endi Sequelize plural qilmaydi
    }
);

export default Users;
