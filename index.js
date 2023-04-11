import "dotenv/config";
import "./src/database/index.js"
import express from "express";
import authRouter from "./src/routes/auth.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());
app.use('/api/v1', authRouter);


const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`Servidor escuchando en el puerto ${PORT}`)
});