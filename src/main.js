import { Telegraf, Markup } from "telegraf";
import fs from "fs";
import path from "path";
import config from "./config/index.js";

const bot = new Telegraf(config.bot.TOKEN);
const telFile = path.join(process.cwd(), "tel.json");
const cartFile = path.join(process.cwd(), "cart.json");

// Burger narxlari
const burgerNarxlari = {
    cheese: 40000,
    double: 50000,
    chicken: 45000,
};
// slallallladsfaslfmoasmodkl


// /start buyrug'i
bot.start((ctx) => {
    ctx.reply(
        "Telefon raqamingizni yuboring 📱",
        Markup.keyboard([
            [Markup.button.contactRequest("📲 Nomerimni yuborish")],
        ])
            .resize()
            .oneTime()
    );
});

// Telefon raqamini qabul qilish
bot.on("contact", (ctx) => {
    const phone = ctx.message.contact.phone_number;
    const username = ctx.from.username || ctx.from.first_name || "NoName";
    const userId = ctx.from.id;

    let data = [];
    if (fs.existsSync(telFile)) {
        data = JSON.parse(fs.readFileSync(telFile, "utf8"));
    }

    if (!data.some((user) => user.phone === phone)) {
        data.push({ username, phone, userId });
        fs.writeFileSync(telFile, JSON.stringify(data, null, 2));
    }

    ctx.reply(
        "✅ Raqamingiz saqlandi!\nEndi burger menyudan tanlang 🍔",
        Markup.keyboard([["🍔 Burger buyurtma qilish"], ["❌ Bekor qilish"]])
            .resize()
            .oneTime()
    );
});

// Burger menyusini chiqarish (for bilan)
bot.hears("🍔 Burger buyurtma qilish", (ctx) => {
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

    ctx.reply("🍔 Qaysi burgerni tanlaysiz?", Markup.inlineKeyboard(buttons));
});

// Buyurtmani bekor qilish
bot.hears("❌ Bekor qilish", (ctx) => {
    return ctx.reply("❌ Amaliyot bekor qilindi");
});

// Burger tanlanganda savatga qoshish
bot.action(/burger_(.+)/, (ctx) => {
    const burgerType = ctx.match[1]; // cheese / double / chicken
    const userId = ctx.from.id;
    const narx = burgerNarxlari[burgerType];

    // Savatni oqish
    let cart = [];
    if (fs.existsSync(cartFile)) {
        cart = JSON.parse(fs.readFileSync(cartFile, "utf8"));
    }

    // Foydalanuvchi savatini topish yoki yangi yaratish
    let userCart = cart.find((u) => u.userId === userId);
    if (!userCart) {
        userCart = { userId, items: [] };
        cart.push(userCart);
    }

    // Savatga qoshish
    userCart.items.push({
        type: burgerType,
        price: narx,
    });

    // Yozish
    fs.writeFileSync(cartFile, JSON.stringify(cart, null, 2));

    ctx.answerCbQuery("✅ Savatga qoshildi!");
    ctx.reply(
        `🛒 "${burgerType}" burger savatga qoshildi!\n💰 Narxi: ${narx.toLocaleString()} so'm`,
        Markup.keyboard([
            ["Buyurtmani amalga oshirish"],
            [`🛒 Savatni ko'rish`, "bekor qilish"],
        ]).resize()
    );
});

bot.hears("🛒 Savatni ko'rish", (ctx) => {
    const userId = ctx.from.id;
    console.log("");

    // Savatni o'qish
    let cart = [];
    if (fs.existsSync(cartFile)) {
        cart = JSON.parse(fs.readFileSync(cartFile, "utf8"));
    }

    // Foydalanuvchi savatini topish
    let userCart = cart.find((u) => u.userId === userId);
    if (!userCart || userCart.items.length === 0) {
        return ctx.reply("🛒 Savatingiz bo'sh");
    }

    // Burgerlarni sanash
    let counts = {};
    let sum = 0;

    for (let i = 0; i < userCart.items.length; i++) {
        const type = userCart.items[i].type;
        const price = userCart.items[i].price;

        counts[type] = (counts[type] || 0) + 1; // nechta dona
        sum += price; // umumiy summa
    }

    // Javob matnini tayyorlash
    let message = "🛒 Savatingiz:\n\n";
    for (const [type, qty] of Object.entries(counts)) {
        const narx = burgerNarxlari[type].toLocaleString();
        message += `🍔 ${
            type.charAt(0).toUpperCase() + type.slice(1)
        } Burger * ${qty} — ${(
            burgerNarxlari[type] * qty
        ).toLocaleString()} so'm\n`;
    }

    message += `\n💰 Umumiy summa: ${sum.toLocaleString()} so'm`;

    ctx.reply(message);
});


bot.hears("bekor qilish", (ctx) => {
    const userId = ctx.from.id;
    let cart = [];
    if (fs.existsSync(cartFile)) {
        cart = JSON.parse(fs.readFileSync(cartFile, "utf8"));
    }

    // Foydalanuvchi savatini topish
    let userCart = cart.find((u) => u.userId === userId);
    if (!userCart || userCart.items.length === 0) {
        return ctx.reply("🛒 Savatingiz bo'sh");
    }
    userCart.items.splice(0);
    fs.writeFileSync(cartFile, JSON.stringify(cart, null, 2));
    ctx.reply("buyurtmangiz bekor qilindi");
});

bot.hears("Buyurtmani amalga oshirish", (ctx) => {
     const userId = ctx.from.id;
    let cart = [];
    if (fs.existsSync(cartFile)) {
        cart = JSON.parse(fs.readFileSync(cartFile, "utf8"));
    }

    // Foydalanuvchi savatini topish
    let userCart = cart.find((u) => u.userId === userId);
    if (!userCart || userCart.items.length === 0) {
        return ctx.reply("🛒 Savatingiz bo'sh");
    }
    ctx.reply("buyurtmangiz qabul qilindi", Markup.removeKeyboard());
});

bot.launch();
console.log("Bot ishga tushdi 🚀");
