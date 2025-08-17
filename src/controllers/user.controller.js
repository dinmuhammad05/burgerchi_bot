import { Markup } from "telegraf";

import config from "../config/index.js";
import userServices from "../services/user.services.js";

export function userCommands(bot) {
    // Oddiy user uchun start
    bot.start((ctx) => {
        if (ctx.from.id != config.superAdmin.id) {
            return ctx.reply(
                "Telefon raqamingizni yuboring 📱",
                Markup.keyboard([
                    [Markup.button.contactRequest("📲 Nomerimni yuborish")],
                ])
                    .resize()
                    .oneTime()
            );
        }
    });

    bot.on("contact", async (ctx) => {
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

    bot.on("message", async (ctx) => {
        if (ctx.from.id != config.superAdmin.id) {
            await ctx.sendChatAction("typing");
            await new Promise((r) => setTimeout(r, 2000));
            await ctx.reply("Burger tayyor! 🍔");
        }
    });
}
