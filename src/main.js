import { Telegraf } from "telegraf";

import config from "./config/index.js";
import start from "./bot.js";

const bot = new Telegraf(config.bot.TOKEN);

await start.start(bot);

bot.launch();
console.log("Bot ishga tushdi 🚀");
