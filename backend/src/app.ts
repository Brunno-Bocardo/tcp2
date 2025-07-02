import express, { Request, Response } from "express";
import cors from "cors";
import { IReserva } from "./model/interfaces/IReserva";
import { ReservaRepository } from "./repository/reservaRepository";
import { SalaRepository } from "./repository/salaRepository";
import { UserRepository } from "./repository/userRepository";
import { inicializarSistema } from "./database/inicializarDados";
import { reservarSala, verificarReservas } from "./controller/reservaControl";
import { atualizarUsuario, cadastrarUsuario, deletarUsuario, filtrarUsuario, filtrarUsuarios, verificarUsuario } from "./controller/userControl";
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

// ========================= CONFIG =========================

// CONFIGURA CORS PRA PERMITIR O FRONT
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ========================= ROTAS =========================

// Alguns endpoins estão retornando objetos vazios (não existem no banco), o próximo passo seria validar o retorno do banco, tirando isso está funcionando. Os endpoints com ok foram testados.

// ENDPOINTS RESERVA
app.post("/api/reserva", reservarSala) //ok
app.get("/api/reservas/:salaId/:data", verificarReservas) //ok

// ENDPOINTS USUÁRIO - CRUD COMPLETO
app.post("/api/user", cadastrarUsuario) //ok
app.get("/api/user", filtrarUsuario) //ok
app.put("/api/user", atualizarUsuario) //ok
app.delete("/api/user", deletarUsuario) //ok
app.post("/api/login", verificarUsuario) //ok
app.get("/api/usuarios", filtrarUsuarios) //ok

// ENDPOINTS SALA - CRUD COMPLETO
app.post("/api/sala", cadastrarSala) //ok
app.get("/api/sala", filtrarSala) //ok
app.put("/api/sala", atualizarSala) //ok
app.delete("/api/sala", excluirSala) //ok
app.get("/api/salas", filtrarSalas) //ok

// ENDPOINT LOGS
app.get("/api/logs", filtrarLogs) //ok