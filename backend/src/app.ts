import express from "express";
import {cadastrarUsuario} from "./controller/userControl"

const app = express();
const PORT = process.env.PORT ?? 5000;
app.use(express.json());

function Inform(){
    console.log(`API executando na URL: http:localhost:${PORT}`);
}

app.post("/api/user", cadastrarUsuario);

app.listen(PORT, Inform);