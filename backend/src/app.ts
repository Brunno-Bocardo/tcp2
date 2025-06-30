import express, { Request, Response } from "express";
import cors from "cors";
import { IReserva } from "./model/interfaces/IReserva";
import { ReservaRepository } from "./repository/reservaRepository";
import { SalaRepository } from "./repository/salaRepository";
import { UserRepository } from "./repository/userRepository";
import { inicializarSistema } from "./database/inicializarDados";
import { reservarSala, verificarReservas } from "./controller/reservaControl";
import { cadastrarUsuario, filtrarUsuarios, verificarUsuario } from "./controller/userControl";
import { atualizarSala, cadastrarSala, excluirSala, filtrarSala, filtrarSalas } from "./controller/salaControl";
import { filtrarLogs } from "./controller/logControl";

const app = express();
const PORT = process.env.PORT ?? 5000;
// HABILITA JSON NO BODY
app.use(express.json());

app.listen(PORT, () => {
  console.log(`API EXECUTANDO NA URL: http://localhost:${PORT}`);
});

// ========================== INICIALIZAÇÃO =========================

inicializarTabelas();
async function inicializarTabelas() {
  try {
    await UserRepository.getInstance();
    await SalaRepository.getInstance();
    await ReservaRepository.getInstance();
    console.log("Tabelas inicializadas com sucesso!");
  } catch (error) {
    console.error("Erro ao inicializar tabelas:", error);
  }
}

// Inicializa o sistema de forma sequencial
inicializarSistema();


// ========================= ROTAS =========================

// ENDPOINTS RESERVA
app.post("/api/reserva", reservarSala) //ok
app.get("/api/reservas/:salaId/:data", verificarReservas) //ok

// ENDPOINTS USUÁRIO
app.post("/api/user", cadastrarUsuario) //ok
app.post("/api/login", verificarUsuario) //ok
app.get("/api/usuarios", filtrarUsuarios) //ok

// ENDPOINTS SALA
app.post("/api/sala", cadastrarSala) //ok
app.get("/api/sala", filtrarSala) // filtrar sala by id funciona, no entanto, se a sala não existe ele retorna um objeto vazio 
app.put("/api/sala", atualizarSala) //ok
app.delete("/api/sala", excluirSala) //ok
app.get("/api/salas", filtrarSalas) //ok

// ENDPOINT LOGS
app.get("/api/logs", filtrarLogs) //ok

// ========================= CONFIG =========================

// CONFIGURA CORS PRA PERMITIR O FRONT
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);