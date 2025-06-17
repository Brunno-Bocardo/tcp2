import express, { Request, Response } from "express";
import cors from "cors";
import { jsonParaXmlAdapter } from "./service/adapter";
import { IReserva } from "./model/interfaces/IReserva";
import { ProxyLogin } from "./model/proxy/ProxyLogin";
import { cadastrarUsuario } from "./controller/userControl";

const app = express();
const PORT = process.env.PORT ?? 5000;

// CONFIGURA CORS PRA PERMITIR O FRONT
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],})
);

// HABILITA JSON NO BODY
app.use(express.json());

// SIMULA O BACKEND LEGADO QUE TRABALHA COM XML
function backendLegado(xml: string) {
  console.log("[BACKEND LEGADO RECEBENDO XML]:\n", xml);
}

// ENDPOINT DE RESERVA
app.post("/api/reserva", (req: Request, res: Response) => {
  const dados: IReserva = req.body; // <- OBJETO TRANSACIONAL EM JSON
  console.log("[JSON RECEBIDO]:", dados);

  const xml = jsonParaXmlAdapter(dados); // <- AQUI O ADAPTER AGE

  backendLegado(xml);

  res.json({
    status: "sucesso",
    xml_enviado: xml,
  });
});


// ENDPOINT DE LOGIN
app.post("/api/login", async (req: Request, res: Response) => {
  console.log("[LOGIN RECEBIDO]:", req.body);
  const { usuario, senha } = req.body;

  const proxyLogin = new ProxyLogin();
  const success = await proxyLogin.login(usuario, senha);

  console.log("[LOGIN RESULTADO]:", success);

  if (success) {
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

// SERVER AQ
app.listen(PORT, () => {
  console.log(`API EXECUTANDO NA URL: http://localhost:${PORT}`);
});
