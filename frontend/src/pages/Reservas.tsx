'use client';
import React, { useState, useEffect, useMemo } from "react";
import { useUsers } from "../hooks/useUsers";
import { useSalas } from "../hooks/useSalas";
import { useReserva } from "../hooks/useReserva";
import { User, Sala, Reserva } from "../types";

import ReservaForm from "../components/ReservaForm";
import ListaDeReservas from "../components/ListaDeReservas";
import DashboardCoordenador from "../components/DashboardCoordenador";

const horariosDisponiveis = [
  "07:00", "07:50", "08:40", "09:30", "10:20", "11:10",
  "13:00", "13:50", "14:40", "15:30", "16:20", "17:10",
  "19:00", "19:50", "20:40", "21:30"
];

interface ReservasPageProps {
  nomeUsuario?: string;
}

const ReservasPage: React.FC<ReservasPageProps> = ({ nomeUsuario }) => {

  const { users, usuarioLogado, tipoUsuario } = useUsers(nomeUsuario);
  const { salas, loading: loadingSalas, error: errorSalas, criarSala } = useSalas();

  const [aba, setAba] = useState<'novaReserva' | 'minhasReservas' | 'dashboard'>('novaReserva');
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<number | null>(null);
  const [salaSelecionada, setSalaSelecionada] = useState<number | null>(null);
  const [dataReserva, setDataReserva] = useState("");
  const [horarioInicio, setHorarioInicio] = useState("");
  const [horarioFim, setHorarioFim] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const { reservas, criarReserva, error: errorReservas } = useReserva(salaSelecionada ?? undefined, dataReserva);

  useEffect(() => {
    if (tipoUsuario && tipoUsuario !== "Coordenador" && usuarioLogado) {
      setUsuarioSelecionado(usuarioLogado.id);
    }
  }, [tipoUsuario, usuarioLogado]);

  const horariosOcupados = useMemo(() => {
    return reservas.flatMap(r => {
      const inicio = horariosDisponiveis.indexOf(r.horarioInicio);
      const fim = horariosDisponiveis.indexOf(r.horarioFim);
      if (inicio === -1 || fim === -1) return [];
      return horariosDisponiveis.slice(inicio, fim);
    });
  }, [reservas]);

  const estaDisponivel = (h: string) => !horariosOcupados.includes(h);

  const handleAdicionarReserva = async () => {
    if (!usuarioLogado) {
      alert("Erro: Usuário não logado.");
      return;
    }
    if (!salaSelecionada || !usuarioSelecionado || !dataReserva || !horarioInicio || !horarioFim) {
      alert("Por favor, preencha todos os campos.");
      return;
    }
    if (horarioFim <= horarioInicio) {
      alert("O horário final deve ser posterior ao inicial.");
      return;
    }

    const novaReserva = {
      solicitanteId: usuarioLogado.id,
      userId: usuarioSelecionado,
      salaId: salaSelecionada,
      dataSolicitacao: new Date().toISOString().split("T")[0],
      dataReserva,
      horarioInicio,
      horarioFim,
    };
    const sucesso = await criarReserva(novaReserva as Omit<Reserva, 'id'>);

    if (sucesso) {
      alert("Reserva criada com sucesso!");
      setDataReserva("");
      setHorarioInicio("");
      setHorarioFim("");
      setRefreshKey(prevKey => prevKey + 1);
    } else {
      alert("Falha ao criar a reserva. Verifique os dados ou o erro no console.");
    }
  };

  const formError = errorSalas || errorReservas;

  return (
    <div className="min-h-screen bg-[#1e1e2f] text-[#e0e0e0] p-8 font-sans">
      <header className="text-center mb-10">
        <h1 className="text-5xl font-extrabold tracking-wide">SISTEMA DE RESERVAS</h1>
        {usuarioLogado ? (
          <p className="text-lg text-[#80cbc4] mt-4">
            Bem-vindo, <span className="font-semibold">{usuarioLogado.nome}</span>!
          </p>
        ) : (
          <p className="text-lg text-gray-400 mt-2">Carregando...</p>
        )}
      </header>

      <nav className="flex justify-center gap-4 mb-8">
        <button
          className={`px-5 py-2 rounded-lg font-semibold transition-colors ${aba === 'novaReserva' ? 'bg-[#80cbc4] text-[#1e1e2f]' : 'bg-[#2a2a40] text-white hover:bg-[#44475a]'}`}
          onClick={() => setAba('novaReserva')}
        >
          Nova Reserva
        </button>

        <button
          className={`px-5 py-2 rounded-lg font-semibold transition-colors ${aba === 'minhasReservas' ? 'bg-[#80cbc4] text-[#1e1e2f]' : 'bg-[#2a2a40] text-white hover:bg-[#44475a]'}`}
          onClick={() => setAba('minhasReservas')}
        >
          Minhas Reservas
        </button>

        {tipoUsuario === 'Coordenador' && (
          <button
            className={`px-5 py-2 rounded-lg font-semibold transition-colors ${aba === 'dashboard' ? 'bg-[#80cbc4] text-[#1e1e2f]' : 'bg-[#2a2a40] text-white hover:bg-[#44475a]'}`}
            onClick={() => setAba('dashboard')}
          >
            Dashboard
          </button>
        )}
      </nav>

      <main>
        {aba === 'novaReserva' && (
          <ReservaForm
            tipoUsuario={tipoUsuario!}
            users={users}
            usuarioSelecionado={usuarioSelecionado}
            setUsuarioSelecionado={setUsuarioSelecionado}
            usuarioLogado={usuarioLogado}
            salaSelecionada={salaSelecionada}
            setSalaSelecionada={setSalaSelecionada}
            salas={salas}
            dataDaReserva={dataReserva}
            setDataReserva={setDataReserva}
            horarioInicio={horarioInicio}
            setHorarioInicio={setHorarioInicio}
            horarioFim={horarioFim}
            setHorarioFim={setHorarioFim}
            horariosDisponiveis={horariosDisponiveis}
            estaDisponivel={estaDisponivel}
            adicionarReserva={handleAdicionarReserva}
          />
        )}

        {aba === 'minhasReservas' && (
          <ListaDeReservas
            usuarioLogado={usuarioLogado}
            salas={salas}
            refreshKey={refreshKey} />
        )}

        {aba === 'dashboard' && tipoUsuario === "Coordenador" && (
          <DashboardCoordenador
            users={users}
            salas={salas}
            reservas={[]}
            onAddSala={criarSala}
            onDeleteReserva={() => { }}
            onEditReserva={() => { }}
            onFazerReservaPara={() => { }}
          />
        )}
      </main>
    </div>
  );
};

export default ReservasPage;