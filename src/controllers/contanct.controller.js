import { Markup } from "telegraf";

import userServices from "../services/user.services.js";

export default function contactController(bot) {
    bot.on("contact", async (ctx) => {
        await ctx.sendChatAction("typing");
        const phone = ctx.message.contact.phone_number;
        const username = ctx.from.username || ctx.from.first_name || "NoName";
        const userId = ctx.from.id;

        await userServices.create(userId, username, phone);
        ctx.reply(
            "✅ Raqamingiz saqlandi!\nEndi burger menyudan tanlang 🍔",
            Markup.keyboard([
                ["🍔 Burger buyurtma qilish"],
                ["❌ Bekor qilish"],
            ])
                .resize()
                .oneTime()
        );
    });
}
