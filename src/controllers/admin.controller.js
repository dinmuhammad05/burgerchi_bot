import fs from "node:fs";
import { join } from "node:path";

import userServices from "../services/user.services.js";
import productServices from "../services/product.services.js";
import saveImage from "../utils/Image.utils.js";

class AdminController {
    async db(bot) {
        try {
            bot.hears(
                [
                    "getAllUsers",
                    "getByPhoneNumber",
                    "deleteUsers",
                    "AddProduct",
                    "DelProduct",
                    "getAllProduct",
                    "getByName",
                    "updateProduct",
                ],
                async (ctx) => {
                    if (ctx.match[0] === "getAllUsers") {
                        await ctx.sendChatAction("typing");
                        const users = await userServices.getAll();

                        let msg = "";

                        for (const user of users) {
                            msg += `________________________________________
                            🆔 DB_ID: ${user.id}
                            👤 Username: @${user.user_name}
                            📱 Telefon: ${user.phone_number}
                            🆔 TG_ID: ${user.chat_id}
                            📅 Yaratilgan: ${user.createdAt}
                            ♻️ Yangilangan: ${user.updatedAt}
                            `;
                        }
                        return await ctx.reply(msg ?? "mavjud emas");
                    }
                    if (ctx.match[0] === "getByPhoneNumber")
                        return ctx.reply(
                            "nomerni shu ko'rinishda kiriting: getuser: +998..."
                        );

                    if (ctx.match[0] === "deleteUsers")
                        return ctx.reply(
                            "nomerni shu ko'rinishda kiriting: deluser: +998..."
                        );

                    if (ctx.match[0] === "AddProduct")
                        return ctx.reply(
                            `shu ko'rinishda  birgalikda junating:\n rasm add: nomi: productNomi,\nnarxi:00`
                        );

                    if (ctx.match[0] === "getAllProduct") {
                        await ctx.sendChatAction("typing");
                        const products = await productServices.getAll();

                        if (!products.length) {
                            return await ctx.reply(
                                "❌ Hozircha mahsulot mavjud emas"
                            );
                        }

                        let msg = "";
                        for (const product of products) {
                            msg += `________________________________________
                                    🆔 DB_ID: ${product.id}
                                    👤 productname: ${product.nomi}
                                    💰 narxi:${product.narxi}\n\n`;
                        }

                        return await ctx.reply(msg);
                    }

                    if (ctx.match[0] === "getByName")
                        return ctx.reply(
                            `shu ko'rinishda kirirting: getproduct: nomi`
                        );

                    if (ctx.match[0] === "updateProduct") {
                        return ctx.replyWithPhoto(
                            {
                                source: fs.createReadStream(
                                    `/home/dinmuhammad/Documents/4-oy/telegraf-15-08/src/images/forUpdate.jpg`
                                ),
                            },
                            {
                                caption: `o'zgartirmoqchi bo'lgan qatoringizni shu ko'rinishda kiriting: updateproduct:\n id: 0, \nnomi:nomi, \nnarxi:00\nagar rasmni ham o'zgartirmoqchi bo'lsangiz rasm ham joylaysiz bo'masa shart emas faqat bitta narx yoki nomni ham o'zgartirsangiz bo'ladi. ID kiritish majburiy!`,
                            }
                        );
                    }

                    if (ctx.match[0] === "DelProduct")
                        return ctx.reply(
                            `shu korinishda kiriting: delproduct: nomi`
                        );
                }
            );
        } catch (error) {
            console.error(
                "errorin function db() /admin.controlerrs",
                error.message
            );
        }
    }

    async admin_commands(bot) {
        bot.on("text", async (ctx) => {
            try {
                const msg = ctx.message.text.split(":");

                if (msg[0] === "getuser") {
                    await ctx.sendChatAction("typing");
                    const data = await userServices.getByPhoneNumber(
                        msg[1].trim()
                    );

                    ctx.reply(data);
                }

                if (msg[0] === "deluser") {
                    await ctx.sendChatAction("typing");
                    const deleted = await userServices.delete(msg[1].trim());

                    ctx.reply(deleted);
                }

                if (msg[0] === "getproduct") {
                    console.log(msg[1]);

                    const result = await productServices.getByName(
                        msg[1].trim()
                    );

                    return ctx.reply(result);
                }

                if (msg[0] === "delproduct") {
                    const result = await productServices.deleteProduct(
                        msg[1].trim()
                    );

                    return ctx.reply(result);
                }

                if (msg[0] === "updateproduct") {
                }
            } catch (error) {
                console.error("❌ error in del()", error.message);
            }
        });

        bot.on(["text", "photo"], async (ctx) => {
            let fileName;
            try {
                await ctx.sendChatAction("typing");
                const message = ctx.message.caption || ctx.message.text;
                if (!message) return;

                const msg = message.split(":");

                if (msg[0].toLowerCase() === "add") {
                    fileName = await saveImage.save(ctx);
                    let caption = ctx.message.caption;

                    const lines = caption.split("\n").map((l) => l.trim());

                    const nomi = lines[1].split(":")[1].trim();
                    const narxi = lines[2].split(":")[1].trim();
                    const result = await productServices.create(
                        nomi,
                        narxi,
                        fileName
                    );
                    return ctx.reply(result);
                }
            } catch (error) {
                saveImage.delete(fileName);
                console.error("❌ error in addProduct", error);
                ctx.reply("❌ Xatolik: mahsulot qo'shib bo'lmadi.");
            }
        });
    }
}

export default new AdminController();
