import "dotenv/config";
import "./src/database/index.js"
import express from "express";
import authRouter from "./src/routes/auth.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import linkRouter from "./src/routes/link.route.js"

const app = express();

const whiteList = [process.env.ORIGIN1]

app.use(cors({
    origin:function(origin, callback){
        if(whiteList.includes(origin)){
            return callback(null, origin)
        }
        return callback("Error de CORS origin: "+origin+" no autorizado.")
    }
}));

app.use(express.json());
app.use(cookieParser());


app.use('/api/v1/auth', authRouter);
app.use('/api/v1/links', linkRouter);


const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>{
    console.log(`Servidor escuchando en el puerto ${PORT}`)
});