import { Markup } from "telegraf";

import { burgerNarxlari } from "../constants/burger.js";
import { addToCart } from "../utils/cart.utils.js";

export default function burgerController(bot) {
    // Burger menyusini ko'rsatish
    bot.hears("🍔 Burger buyurtma qilish", async (ctx) => {
        await ctx.sendChatAction("typing");
        const buttons = [];

        for (const [key, price] of Object.entries(burgerNarxlari)) {
            buttons.push([
                Markup.button.callback(
                    `${
                        key.charAt(0).toUpperCase() + key.slice(1)
                    } Burger - ${price.toLocaleString()} so'm`,
                    `burger_${key}`
                ),
            ]);
        }

        ctx.reply(
            "🍔 Qaysi burgerni tanlaysiz?",
            Markup.inlineKeyboard(buttons)
        );
    });

    // Burger tanlash
    bot.action(/burger_(.+)/, (ctx) => {
        const burgerType = ctx.match[1];
        const userId = ctx.from.id;
        const narx = burgerNarxlari[burgerType];

        addToCart(userId, burgerType, narx);

        ctx.answerCbQuery("✅ Savatga qoshildi!");
        ctx.reply(
            `🛒 "${burgerType}" burger savatga qoshildi!\n💰 Narxi: ${narx.toLocaleString()} so'm`,
            Markup.keyboard([
                ["Buyurtmani amalga oshirish"],
                [`🛒 Savatni ko'rish`, "bekor qilish"],
            ]).resize()
        );
    });

    // Bekor qilish
    bot.hears("❌ Bekor qilish", async (ctx) => {
        await ctx.sendChatAction("typing");
        return ctx.reply("❌ Amaliyot bekor qilindi");
    });
}
