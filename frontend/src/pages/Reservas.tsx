// Reservas.tsx

'use client';
import React, { useState } from "react";
import { useUsers } from "../hooks/useUsers";
import { useSalas } from "../hooks/useSalas";
import { useReserva } from "../hooks/useReserva";
import DashboardCoordenador from "../components/DashboardCoordenador";
import HorarioDropdown from "../components/HorarioDropdown";

interface ReservasProps {
  nomeUsuario?: string; // RECEBE O NOME OU EMAIL DO USUARIO LOGADO
}

// LISTA DE HORARIOS DISPONIVEIS PRA RESERVA
const horariosDisponiveis = [
  "07:00", "07:50", "08:40", "09:30", "10:20", "11:10",
  "13:00", "13:50", "14:40", "15:30", "16:20", "17:10",
  "19:00", "19:50", "20:40", "21:30"
];

const Reservas: React.FC<ReservasProps> = ({ nomeUsuario }) => {
  // USAMOS OS HOOKS PRA PEGAR OS DADOS DE USERS, SALAS E RESERVAS
  const { users, usuarioLogado, tipoUsuario } = useUsers(nomeUsuario);
  const { salas, loading: loadingSalas, error: errorSalas, criarSala } = useSalas();

  // ESTADOS LOCAIS PRA CONTROLAR QUAL ABA TA ATIVA E DADOS DO FORMULARIO
  const [aba, setAba] = useState<"reservas" | "dashboard">("reservas");
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<number | null>(null);
  const [salaSelecionada, setSalaSelecionada] = useState<number | null>(null);
  const [dataReserva, setDataReserva] = useState("");
  const [horarioInicio, setHorarioInicio] = useState("");
  const [horarioFim, setHorarioFim] = useState("");

  const { reservas, criarReserva, error: errorReservas } = useReserva(salaSelecionada ?? undefined, dataReserva);

  React.useEffect(() => {
    if (tipoUsuario !== "Coordenador" && usuarioLogado) {
      setUsuarioSelecionado(usuarioLogado.id);
    }
  }, [tipoUsuario, usuarioLogado]);

  // CALCULA QUAIS HORARIOS JA ESTAO OCUPADOS NA SALA E DATA SELECIONADAS
  const horariosOcupados = React.useMemo(() => {
    return reservas.flatMap(r => {
      const inicio = horariosDisponiveis.indexOf(r.horarioInicio);
      const fim = horariosDisponiveis.indexOf(r.horarioFim);
      if (inicio === -1 || fim === -1) return []; // Ignora se o horário não for encontrado
      return horariosDisponiveis.slice(inicio, fim);
    });
  }, [reservas]);

  // CHECA SE UM HORARIO ESTA DISPONIVEL (NAO ESTA NA LISTA DE OCUPADOS) 
  const estaDisponivel = (h: string) => !horariosOcupados.includes(h);

  async function handleAdicionarReserva() {
    if (!salaSelecionada || !usuarioSelecionado || !dataReserva || !horarioInicio || !horarioFim) {
      alert("Por favor, preencha todos os campos para a reserva.");
      return;
    }

    if (horarioFim <= horarioInicio) {
      alert("O horário final da reserva deve ser posterior ao horário inicial.");
      return;
    }

    const novaReserva = {
      userId: usuarioSelecionado,
      salaId: salaSelecionada,
      dataSolicitacao: new Date().toISOString().split("T")[0],
      dataReserva,
      horarioInicio,
      horarioFim,
    };

    const sucesso = await criarReserva(novaReserva as any);

    if (sucesso) {
      alert("Reserva criada com sucesso!");
      setSalaSelecionada(null);
      setDataReserva("");
      setHorarioInicio("");
      setHorarioFim("");
      if (tipoUsuario === "Coordenador") {
        setUsuarioSelecionado(null);
      }
    } else {
      alert("Não foi possível criar a reserva. Verifique a mensagem de erro ou tente novamente.");
    }
  }

  const formError = errorSalas || errorReservas;

  return (
    <div>
      {/* NAV DE ABAS PRA ESCOLHER ENTRE RESERVAS E DASHBOARD */}
      <nav className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${aba === "reservas" ? "bg-[#80cbc4] text-[#1e1e2f]" : "bg-[#2a2a40] text-[#e0e0e0]"}`}
          onClick={() => setAba("reservas")}
        >
          Reservas
        </button>
        {tipoUsuario === "Coordenador" && (
          <button
            className={`px-4 py-2 rounded ${aba === "dashboard" ? "bg-[#80cbc4] text-[#1e1e2f]" : "bg-[#2a2a40] text-[#e0e0e0]"}`}
            onClick={() => setAba("dashboard")}
          >
            Dashboard
          </button>
        )}
      </nav>

      {/* MOSTRA O DASHBOARD OU O FORMULARIO DE RESERVAS CONFORME A ABA E TIPO DO USUARIO */}
      {aba === "dashboard" && tipoUsuario === "Coordenador" ? (
        <DashboardCoordenador
          users={users}
          salas={salas}
          reservas={reservas}
          onAddSala={criarSala}
          onDeleteReserva={() => { }}
          onEditReserva={() => { }}
          onFazerReservaPara={criarReserva}
        />
      ) : (
        <main className="min-h-screen bg-[#1e1e2f] text-[#e0e0e0] p-8 font-sans max-w-7xl mx-auto flex flex-col gap-8">
          <header className="flex flex-col items-center gap-2">
            <h1 className="text-5xl font-extrabold tracking-wide">SISTEMA DE RESERVAS</h1>
            {usuarioLogado ? (
              <p className="text-lg text-[#80cbc4] tracking-wide select-none">
                Bem-vindo, <span className="font-semibold">{usuarioLogado.nome}</span>!
              </p>
            ) : (
              <p className="text-lg text-[#80cbc4] tracking-wide select-none">
                Carregando usuário...
              </p>
            )}
          </header>

          {/* FORMULARIO DE NOVA RESERVA */}
          <section className="bg-[#2a2a40] rounded-xl p-8 shadow-lg max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6 border-b border-[#80cbc4] pb-2">Nova Reserva</h2>

            {formError && (
              <div className="bg-red-900 border border-red-700 text-white px-4 py-3 rounded-md relative mb-6" role="alert">
                <strong className="font-bold">Ocorreu um erro: </strong>
                <span className="block sm:inline">{formError}</span>
              </div>
            )}

            <form
              onSubmit={e => {
                e.preventDefault();
                handleAdicionarReserva();
              }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              {/* SELECAO DE USUARIO */}
              <div>
                <label className="block mb-2 text-sm font-semibold">Usuário</label>
                {tipoUsuario === "Coordenador" ? (
                  <select
                    value={usuarioSelecionado || ""}
                    onChange={e => setUsuarioSelecionado(Number(e.target.value))}
                    className="w-full p-3 rounded-md bg-[#44475a] border border-gray-600 text-[#e0e0e0] focus:outline-none focus:border-[#80cbc4] transition"
                    required
                  >
                    <option value="" disabled>Selecione um usuário</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>{u.nome} ({u.tipo})</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={usuarioLogado?.nome || ""}
                    disabled
                    className="w-full p-3 rounded-md bg-gray-700 border border-gray-600 cursor-not-allowed"
                  />
                )}
              </div>

              {/* SELECAO DE SALA */}
              <div>
                <label className="block mb-2 text-sm font-semibold">Sala</label>
                <select
                  value={salaSelecionada || ""}
                  onChange={e => setSalaSelecionada(Number(e.target.value))}
                  className="w-full p-3 rounded-md bg-[#44475a] border border-gray-600 text-[#e0e0e0] focus:outline-none focus:border-[#80cbc4] transition"
                  required
                  disabled={loadingSalas || salas.length === 0}
                >
                  <option value="" disabled>
                    {loadingSalas ? "Carregando salas..." : salas.length === 0 ? "Nenhuma sala disponível" : "Selecione uma sala"}
                  </option>
                  {salas.map(s => (
                    <option key={s.id} value={s.id}>
                      Sala {s.numero} ({s.tipo}, max {s.capacidadeMaxima})
                    </option>
                  ))}
                </select>
              </div>

              {/* SELECAO DE DATA */}
              <div>
                <label className="block mb-2 text-sm font-semibold">Data da Reserva</label>
                <input
                  type="date"
                  value={dataReserva}
                  onChange={e => setDataReserva(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full p-3 rounded-md bg-[#44475a] border border-gray-600 text-[#e0e0e0] focus:outline-none focus:border-[#80cbc4] transition"
                  required
                />
              </div>

              {/* SELECAO DE HORARIO INICIO E FIM */}
              <div className="flex gap-4">
                <HorarioDropdown
                  label="Horário Início"
                  horarios={horariosDisponiveis}
                  horarioSelecionado={horarioInicio}
                  setHorarioSelecionado={setHorarioInicio}
                  horarioDisponivel={estaDisponivel}
                  disabled={!salaSelecionada || !dataReserva}
                />
                <HorarioDropdown
                  label="Horário Fim"
                  horarios={horariosDisponiveis}
                  horarioSelecionado={horarioFim}
                  setHorarioSelecionado={setHorarioFim}
                  horarioDisponivel={estaDisponivel}
                  filtroMinimo={horarioInicio}
                  disabled={!horarioInicio}
                />
              </div>

              {/* BOTAO PRA ADICIONAR RESERVA */}
              <div className="sm:col-span-2 flex justify-center">
                <button
                  type="submit"
                  disabled={!salaSelecionada || !usuarioSelecionado || !dataReserva || !horarioInicio || !horarioFim}
                  className="bg-[#80cbc4] hover:bg-[#80cbd9] text-[#1e1e2f] font-bold py-3 px-12 rounded-xl shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Adicionar Reserva
                </button>
              </div>
            </form>
          </section>
        </main>
      )}
    </div>
  );
}

export default Reservas;