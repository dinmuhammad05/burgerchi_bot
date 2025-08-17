import sequelize from "./db/index.js";

// controllers import
import startController from "./controllers/start.controller.js";
import contactController from "./controllers/contanct.controller.js";
import burgerController from "./controllers/burger.controller.js";
import cartController from "./controllers/cart.controller.js";
import adminController from "./controllers/admin.controller.js";

class Start {
    async startDb() {
        try {
            // Database connection
            await sequelize.authenticate();
            await sequelize.sync({ alter: true });
        } catch (error) {
            console.error(
                "error in function startDb() - bot.js",
                error.message
            );
        }
    }

    async start(bot) {
        try {
            // startDb()
            await this.startDb();

            // Register controllers
            startController(bot);
            contactController(bot);
            burgerController(bot);
            cartController(bot);
            adminController.db(bot);
            adminController.admin_commands(bot)
        } catch (error) {
            console.error("error in function start() - bot.js", error.message);
        }
    }
}

export default new Start();
