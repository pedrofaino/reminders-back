import "dotenv/config";
import "./src/database/index.js"
import express from "express";
import authRouter from "./src/routes/auth.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import linkRouter from "./src/routes/link.route.js"
import reminderRouter from "./src/routes/reminder.route.js"
import userRouter from "./src/routes/user.route.js"
import { Reminder } from "./src/models/Reminder.js";

const app = express();

const whiteList = [process.env.ORIGIN1,process.env.ORIGIN2]

app.use(cors({
    origin:function(origin, callback){
        if(!origin||whiteList.includes(origin)){
            return callback(null, origin)
        }
        return callback("Error de CORS origin: "+origin+" no autorizado.")
    },
    credentials:true,
    })
);

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/links', linkRouter);
app.use('/api/v1/reminders', reminderRouter);
app.use('/api/v1/user', userRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`Servidor escuchando en el puerto ${PORT}`)
});
