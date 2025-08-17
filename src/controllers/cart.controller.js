import { Markup } from "telegraf";

import { getUserCart, clearCart } from "../utils/cart.utils.js";
import { burgerNarxlari } from "../constants/burger.js";

export default function cartController(bot) {
    // Savatni ko'rish
    bot.hears("🛒 Savatni ko'rish", async (ctx) => {
        await ctx.sendChatAction("typing");
        const userId = ctx.from.id;
        const userCart = getUserCart(userId);

        if (!userCart || userCart.items.length === 0) {
            return ctx.reply("🛒 Savatingiz bo'sh");
        }

        // Burgerlarni sanash
        let counts = {};
        let sum = 0;

        for (let i = 0; i < userCart.items.length; i++) {
            const type = userCart.items[i].type;
            const price = userCart.items[i].price;

            counts[type] = (counts[type] || 0) + 1;
            sum += price;
        }

        // Javob matnini tayyorlash
        let message = "🛒 Savatingiz:\n\n";
        for (const [type, qty] of Object.entries(counts)) {
            message += `🍔 ${
                type.charAt(0).toUpperCase() + type.slice(1)
            } Burger * ${qty} — ${(
                burgerNarxlari[type] * qty
            ).toLocaleString()} so'm\n`;
        }

        message += `\n💰 Umumiy summa: ${sum.toLocaleString()} so'm`;
        ctx.reply(message);
    });

    // Savatni tozalash
    bot.hears("bekor qilish", (ctx) => {
        const userId = ctx.from.id;
        const userCart = getUserCart(userId);

        if (!userCart || userCart.items.length === 0) {
            return ctx.reply("🛒 Savatingiz bo'sh");
        }

        clearCart(userId);
        ctx.reply("buyurtmangiz bekor qilindi");
    });

    // Buyurtmani amalga oshirish
    bot.hears("Buyurtmani amalga oshirish", (ctx) => {
        const userId = ctx.from.id;
        const userCart = getUserCart(userId);

        if (!userCart || userCart.items.length === 0) {
            return ctx.reply("🛒 Savatingiz bo'sh");
        }

        ctx.reply("buyurtmangiz qabul qilindi", Markup.removeKeyboard());
    });
}
