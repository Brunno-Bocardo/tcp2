import express, { Request, Response } from "express";
import cors from "cors";
import { jsonParaXmlAdapter } from "./patterns/adapter/adapter";
import { IReserva } from "./model/interfaces/ireserva";
import { ProxyLogin } from "./patterns/proxy/ProxyLogin";
import { ReservaRepository } from "./repository/reservaRepository";
import { SalaRepository } from "./repository/salaRepository";
import { UserRepository } from "./repository/userRepository";
import { LogRepository } from "./repository/logRepository";
import { inicializarSistema } from "./database/inicializarDados";


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

// ========================== INICIALIZAÇÃO =========================

const app = express();
const PORT = process.env.PORT ?? 5000;


// CONFIGURA CORS PRA PERMITIR O FRONT
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
})
);

// HABILITA JSON NO BODY
app.use(express.json());

// Inicializa o sistema de forma sequencial
inicializarSistema();

app.listen(PORT, () => {
  console.log(`API EXECUTANDO NA URL: http://localhost:${PORT}`);
});

// ========================= BACKEND LEGADO =========================

// SIMULA O BACKEND LEGADO QUE TRABALHA COM XML
function backendLegado(xml: string) {
  console.log("[BACKEND LEGADO RECEBENDO XML]:\n", xml);
}

// ENDPOINTS RESERVA
// app.post("/api/reservaSala", reservarSala)

// ENDPOINTS RESERVA
// app.post("/api/user", cadastrarUsuario)

// ENDPOINTS SALA
// app.post("/api/sala", cadastrarSala)
// app.get("/api/sala", filtrarSala)
// app.put("/api/sala", atualizarSala)
// app.delete("/api/sala", excluirSala)
// app.get("/api/salas", filtrarSalas)

// ENDPOINT DE RESERVA
app.post("/api/reserva", (req: Request, res: Response) => {
  const dados: IReserva = req.body; // <- OBJETO TRANSACIONAL EM JSON
  console.log("[JSON RECEBIDO]:", dados);

  const xml = jsonParaXmlAdapter(dados); // <- AQUI O ADAPTER AGE

  backendLegado(xml);
});

// ========================= ROTAS =========================


// ENDPOINT DE LOGIN
app.post("/api/login", async (req: Request, res: Response) => {
  console.log("[LOGIN RECEBIDO]:", req.body);
  const { email, senha } = req.body;

  const proxyLogin = new ProxyLogin();

  const success = await proxyLogin.login(email, senha);

  console.log("[LOGIN RESULTADO]:", success);

  if (success) {
    const userRepository = UserRepository.getInstance();
    const usuario = await userRepository.filtraUsuarioByEmail(email);
    res.json({ success: true, user: usuario });
  } else {
    res.json({ success: false });
  }
});

// ENDPOINT PARA LISTAR TODAS AS SALAS
app.get("/api/salas", async (req: Request, res: Response) => {
  try {
    const salaRepository = SalaRepository.getInstance();
    const salas = await salaRepository.filtrarSalas();
    res.json(salas);
  } catch (error) {
    console.error("Erro ao buscar salas:", error);
    res.status(500).json({ error: "Erro ao buscar salas" });
  }
});

// ENDPOINT PARA LISTAR TODOS OS USUÁRIOS
app.get("/api/usuarios", async (req: Request, res: Response) => {
  try {
    const userRepository = UserRepository.getInstance();
    const usuarios = await userRepository.listarUsuarios();
    res.json(usuarios);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    res.status(500).json({ error: "Erro ao buscar usuários" });
  }
});

// ENDPOINT PARA VERIFICAR RESERVAS EXISTENTES
app.get("/api/reservas/:salaId/:data", async (req: Request, res: Response) => {
  try {
    const { salaId, data } = req.params;

    const reservaRepository = ReservaRepository.getInstance();
    const reservas = await reservaRepository.listarReservasPorSalaEData(
      parseInt(salaId),
      data
    );

    res.json(reservas);
  } catch (error) {
    console.error("Erro ao buscar reservas:", error);
    res.status(500).json({ error: "Erro ao buscar reservas" });
  }
});

// ENDPOINT PARA OBTER LOGS
app.get("/api/logs", async (req: Request, res: Response) => {
  try {
    const limite = req.query.limite ? parseInt(req.query.limite as string) : 100;
    const pagina = req.query.pagina ? parseInt(req.query.pagina as string) : 1;
    const offset = (pagina - 1) * limite;
    const evento = req.query.evento as string;
    const usuarioId = req.query.usuario ? parseInt(req.query.usuario as string) : undefined;

    const logRepository = LogRepository.getInstance();
    let logs;

    // Aplicar filtros conforme parâmetros
    if (evento) {
      logs = await logRepository.buscarLogsPorEvento(evento);
    } else if (usuarioId) {
      logs = await logRepository.buscarLogsPorUsuario(usuarioId);
    } else {
      logs = await logRepository.listarLogs(limite, offset);
    }

    // Formatar a resposta
    res.json({
      total: logs.length,
      pagina,
      logs
    });
  } catch (error) {
    console.error("Erro ao buscar logs:", error);
    res.status(500).json({ error: "Erro ao buscar logs" });
  }
});


// ENDPOINT DE RESERVA
app.post("/api/reserva", async (req: Request, res: Response): Promise<void> => {
  try {
    const reservaData = req.body;

    // Validar dados recebidos
    if (!reservaData.userId || !reservaData.salaId || !reservaData.dataDaReserva || !reservaData.horarioInicio || !reservaData.horarioFim) {
      res.status(400).json({
        status: "erro",
        message: "Dados da reserva incompletos"
      });
      return;
    }

    // Converter para objeto Reserva do sistema
    const reserva = {
      userId: reservaData.userId,
      salaId: reservaData.salaId,
      dataDaSolicitacao: reservaData.dataDaSolicitacao,
      dataDaReserva: reservaData.dataDaReserva,
      horarioInicio: reservaData.horarioInicio,
      horarioFim: reservaData.horarioFim
    };

    // Salvar no banco de dados
    const reservaRepository = ReservaRepository.getInstance();
    const reservaSalva = await reservaRepository.inserirReserva(reserva);

    // Gerar XML como exemplo (você pode usar um adapter ou uma biblioteca XML)
    const xmlGerado = `
<reserva>
  <userId>${reserva.userId}</userId>
  <salaId>${reserva.salaId}</salaId>
  <dataDaSolicitacao>${reserva.dataDaSolicitacao}</dataDaSolicitacao>
  <dataDaReserva>${reserva.dataDaReserva}</dataDaReserva>
  <horarioInicio>${reserva.horarioInicio}</horarioInicio>
  <horarioFim>${reserva.horarioFim}</horarioFim>
</reserva>`;

    // Enviar resposta de sucesso
    res.status(201).json({
      status: "sucesso",
      xml_enviado: xmlGerado,
      reservaId: reservaSalva.id
    });
  } catch (error) {
    console.error("Erro ao processar reserva:", error);
    res.status(500).json({
      status: "erro",
      message: "Erro ao processar reserva",
      xml_enviado: "<erro>Falha ao processar reserva</erro>"
    });
  }
});


