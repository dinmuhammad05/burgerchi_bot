import { config } from "dotenv";
config();

export default {
    bot: {
        TOKEN: process.env.TOKEN,
    },
    db: {
        host: String(process.env.PG_HOST),
        db: String(process.env.PG_DB),
        port: Number(process.env.PG_PORT),
        user: String(process.env.PG_USER),
        password: String(process.env.PG_PASS),
    },
    superAdmin:{
        id:String(process.env.SUPER_ADMIN_ID)
    }
};
