import React, { useState } from "react";
import './Reservas.css';

// INTERFACE SALA
type Sala = {
  id: number;
  numero: number;
  capacidadeMaxima: number;
  tipo: "Auditorio" | "Laboratorio" | "Sala de Aula";
};

type User = {
  id: number;
  nome: string;
  email: string;
  curso: string;
  senha: string;
  tipo: string;
}

// INTERFACE RESERVA - OBJETO TRANSACIONAL QUE ENVIA OS DADOS PARA O BACKEND
type Reserva = {
  userId: number;
  salaId: number;
  dataDaSolicitacao: string;
  dataDaReserva: string;
  horarioInicio: string;
  horarioFim: string;
};

// RESPOSTA DO BACKEND - RECEBE O STATUS E O XML QUE FOI ENVIADO
type Resposta = {
  status: string;
  xml_enviado: string;          // AQUI RECEBEMOS O XML GERADO PELO ADAPTER NO BACKEND
};

const Reservas: React.FC = () => {
  // LISTA DE SALAS (EXEMPLO FICTICIO) - ESTAO PREDEFINIDAS NO FRONTEND
  const salas: Sala[] = [
    { id: 1, numero: 101, capacidadeMaxima: 100, tipo: "Auditorio" },
    { id: 2, numero: 202, capacidadeMaxima: 25, tipo: "Laboratorio" },
    { id: 3, numero: 303, capacidadeMaxima: 35, tipo: "Sala de Aula" },
    { id: 4, numero: 404, capacidadeMaxima: 20, tipo: "Laboratorio" },
  ];

  // LISTA DE USUARIOS (EXEMPLO FICTICIO) - ESTAO PREDEFINIDAS NO FRONTEND
  const users: User[] = [
    {id: 1, nome: 'Golden', email: 'golden@gmail.com', curso: "ADS", senha: "1234@sdf", tipo: "Professor"},
    {id: 2, nome: 'Anisio', email: 'anisio@gmail.com', curso: "ADS", senha: "1234@sdf2", tipo: "Professor"},
    {id: 3, nome: 'Marcelo Polido', email: 'marcelo@gmail.com', curso: "ADS", senha: "1234@sdf22", tipo: "Coordenador"}
  ];

  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [respostas, setRespostas] = useState<Resposta[]>([]);

  const [usuarioSelecionado, setUsuarioSelecionado] = useState<number | null>(null);
  const [salaSelecionada, setSalaSelecionada] = useState<number | null>(null);
  const [dataDaSolicitacao, setDataSolicitada] = useState("");
  const [dataDaReserva, setDataReserva] = useState("");
  const [horarioInicio, setHorarioInicio] = useState("");
  const [horarioFim, setHorarioFim] = useState("");
  

  const [loading, setLoading] = useState(false);

  
  function adicionarReserva() {
    if (!salaSelecionada || !horarioInicio || !usuarioSelecionado || !horarioFim) {
      alert("PREENCHA TODOS OS CAMPOS");
      return;
    }

    setReservas([
      ...reservas,
      {
        userId: usuarioSelecionado,
        salaId: salaSelecionada,
        dataDaSolicitacao: dataDaSolicitacao,
        dataDaReserva: dataDaReserva,
        horarioInicio: horarioInicio,
        horarioFim: horarioFim  
      },
    ]);

    setSalaSelecionada(null);
    setUsuarioSelecionado(null);
    setDataSolicitada("");
    setDataReserva("");
    setHorarioInicio("");
    setHorarioFim("");
  }

  function alterarHorario(index: number, novoHorario: string) {
    const novas = reservas.map((r, i) =>
      i === index ? { ...r, horario: novoHorario } : r
    );
    setReservas(novas);
  }

  async function enviarTodas() {
    setLoading(true);
    setRespostas([]);

    const resultados: Resposta[] = [];

    for (const reserva of reservas) {
      try {
        const res = await fetch("http://localhost:5000/api/reserva", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reserva),
        });

        const data: Resposta = await res.json();
        resultados.push(data);
      } catch (error) {
        console.error("ERRO AO ENVIAR", error);
      }
    }

    setRespostas(resultados);
    setLoading(false);
  }

  function buscarSala(id: number) {
    return salas.find((s) => s.id === id);
  }

  function buscarUser(id: number) {
    return users.find((u) => u.id === id);
  }

  return (
    <div
      style={{
        padding: 20,
        fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: "#1e1e2f",
        color: "#e0e0e0",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ color: "#80cbc4" }}>RESERVAS DE SALAS</h1>

      {/* FORMULARIO */}
      <h2>ADICIONAR NOVA RESERVA</h2>
      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        <select
          value={salaSelecionada ?? ""}
          onChange={(e) => setSalaSelecionada(Number(e.target.value))}
          style={{
            flex: 1,
            padding: "8px",
            borderRadius: 4,
            border: "none",
            backgroundColor: "#44475a",
            color: "#e0e0e0",
          }}
        >
          <option value="">SELECIONE UMA SALA</option>
          {salas.map((sala) => (
            <option key={sala.id} value={sala.id}>
              {sala.tipo} {sala.numero} (Capacidade: {sala.capacidadeMaxima})
            </option>
          ))}
        </select>

        <select
          value={usuarioSelecionado ?? ""}
          onChange={(e) => setUsuarioSelecionado(Number(e.target.value))}
          style={{
            flex: 1,
            padding: "8px",
            borderRadius: 4,
            border: "none",
            backgroundColor: "#44475a",
            color: "#e0e0e0",
          }}
        >
          <option value="">SELECIONE O USUARIO</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.nome} (Tipo: {user.tipo})
            </option>
          ))}
        </select>

        <input
          type="date"
          placeholder="DATA"
          value={dataDaReserva}
          onChange={(e) => setDataReserva(e.target.value)}
          style={{
            flex: 1,
            padding: "8px",
            borderRadius: 4,
            border: "none",
            backgroundColor: "#44475a",
            color: "#e0e0e0",
          }}
        />

        <input
          type="text"
          placeholder="HORARIO INICIO"
          value={horarioInicio}
          onChange={(e) => setHorarioInicio(e.target.value)}
          style={{
            flex: 1,
            padding: "8px",
            borderRadius: 4,
            border: "none",
            backgroundColor: "#44475a",
            color: "#e0e0e0",
          }}
        />

        <input
          type="text"
          placeholder="HORARIO FIM"
          value={horarioFim}
          onChange={(e) => setHorarioFim(e.target.value)}
          style={{
            flex: 1,
            padding: "8px",
            borderRadius: 4,
            border: "none",
            backgroundColor: "#44475a",
            color: "#e0e0e0",
          }}
        />

        <button
          onClick={adicionarReserva}
          style={{
            backgroundColor: "#80cbc4",
            border: "none",
            borderRadius: 4,
            padding: "8px 16px",
            fontWeight: "bold",
            cursor: "pointer",
            color: "#1e1e2f",
          }}
        >
          ADICIONAR
        </button>
      </div>

      {/* TABELA */}
      <h2>RESERVAS A ENVIAR</h2>
      {reservas.length === 0 && <p>NENHUMA RESERVA ADICIONADA</p>}

      {reservas.length > 0 && (
        <table
          style={{
            borderCollapse: "collapse",
            width: "100%",
            marginBottom: 20,
            color: "#e0e0e0",
          }}
        >
          <thead>
            <tr style={{ borderBottom: "2px solid #80cbc4" }}>
              <th style={{ padding: "8px 12px" }}>RESERVADO PARA:</th>
              <th style={{ padding: "8px 12px" }}>SALA</th>
              <th style={{ padding: "8px 12px" }}>NUMERO</th>
              <th style={{ padding: "8px 12px" }}>DATA</th>
              <th style={{ padding: "8px 12px" }}>HORARIO INICIO</th>
              <th style={{ padding: "8px 12px" }}>HORARIO FINAL</th>
            </tr>
          </thead>
          <tbody>
            {reservas.map(({ userId, salaId, dataDaReserva, horarioInicio, horarioFim }, i) => {
              const sala = buscarSala(salaId);
              const user = buscarUser(userId)
              return (
                <tr
                  key={i}
                  style={{
                    borderBottom: "1px solid #444",
                    backgroundColor: i % 2 === 0 ? "#2a2a40" : "#232337",
                  }}
                >
                  <td style={{ padding: "8px 12px"}}>
                    {user ? user.nome : "Desconhecido"}
                  </td>
                  <td style={{ padding: "8px 12px" }}>
                    {sala ? sala.tipo : "Desconhecida"}
                  </td>
                  <td style={{ padding: "8px 12px" }}>
                    {sala ? sala.numero : "?"}
                  </td>
                  <td style={{ padding: "8px 12px" }}>{dataDaReserva}</td>
                  <td style={{ padding: "8px 12px" }}>
                    <input
                      type="text"
                      value={horarioInicio}
                      onChange={(e) => alterarHorario(i, e.target.value)}
                      style={{
                        width: "100%",
                        backgroundColor: "#44475a",
                        border: "none",
                        color: "#e0e0e0",
                        padding: "6px",
                        borderRadius: 4,
                        fontSize: "1rem",
                      }}
                    />
                  </td>
                  <td style={{ padding: "8px 12px" }}>
                    <input
                      type="text"
                      value={horarioFim}
                      onChange={(e) => alterarHorario(i, e.target.value)}
                      style={{
                        width: "100%",
                        backgroundColor: "#44475a",
                        border: "none",
                        color: "#e0e0e0",
                        padding: "6px",
                        borderRadius: 4,
                        fontSize: "1rem",
                      }}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {/* BOTAO */}
      <button
        onClick={enviarTodas}
        disabled={loading || reservas.length === 0}
        style={{
          padding: "10px 20px",
          backgroundColor: reservas.length === 0 ? "#555" : "#80cbc4",
          border: "none",
          borderRadius: 4,
          cursor: loading || reservas.length === 0 ? "not-allowed" : "pointer",
          fontWeight: "bold",
          color: "#1e1e2f",
        }}
      >
        {loading ? "ENVIANDO..." : "ENVIAR TODAS AS RESERVAS"}
      </button>

      {/* RESPOSTAS */}
      <h2 style={{ marginTop: 40 }}>RESPOSTAS DO BACKEND</h2>
      {respostas.length === 0 && <p>NENHUMA RESPOSTA AINDA</p>}
      {respostas.map(({ status, xml_enviado }, i) => (
        <div
          key={i}
          style={{
            marginTop: 20,
            padding: 10,
            backgroundColor: "#282c34",
            borderRadius: 6,
            boxShadow: "0 0 10px #80cbc4",
          }}
        >
          <p>
            <b>STATUS:</b> {status}
          </p>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              color: "#a3be8c",
              fontFamily: "Courier New, monospace",
              fontSize: 14,
              backgroundColor: "#21252b",
              padding: 10,
              borderRadius: 4,
              overflowX: "auto",
            }}
          >
            {xml_enviado}
          </pre>
        </div>
      ))}
    </div>
  );
};

export default Reservas;
