import { Markup } from "telegraf";

import config from "../config/index.js";

export default function startController(bot) {
    bot.start((ctx) => {
        if (ctx.from.id == config.superAdmin.id) {
            return ctx.reply(
                "Assalamu alaykum hurmatli Admin",
                Markup.keyboard([
                    ["getAllUsers", "getByPhoneNumber", "deleteUsers"],
                    ["AddProduct", "DelProduct", 'getAllProduct'],
                    ["getByName", "updateProduct"]
                ]).resize()
            );
        }
        ctx.reply(
            "Telefon raqamingizni yuboring 📱",
            Markup.keyboard([
                [Markup.button.contactRequest("📲 Nomerimni yuborish")],
            ])
                .resize()
                .oneTime()
        );
    });
}
