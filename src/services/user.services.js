import model from "../models/user.model.js";

class userServices {
    async create(chat_id, user_name, phone) {
        let phone_number = `${phone}`.startsWith("+") ? phone : "+" + phone;
        const exists = await model.findOne({ where: { phone_number } });
        if (exists) return;
        const newUser = await model.create({
            chat_id,
            user_name,
            phone_number,
        });

        return;
    }

    async getByPhoneNumber(phone_number) {

        const exists = await model.findOne({ where: { phone_number } });

        if (!exists) return "404 telegon nomer topilmadi!!";

        return `foydalanuvchi:\n ${JSON.stringify(exists, null, 2)}`;
    }

    async getAll() {
        const data = await model.findAll({
            order: [["createdAt", "DESC"]],
        });

        return data;
    }

    async delete(phone_number) {
        const data = await model.destroy({
            where: { phone_number },
            returning: true,
        });

        if (!data) return "not found", 404;

        return `🗑 O'chirildi:\n${JSON.stringify(data, null, 2)}`;
    }
}

export default new userServices();
