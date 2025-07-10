'use client';
import React, { useState, useEffect, useMemo } from "react";
import { useUsers } from "../hooks/useUsers";
import { useSalas } from "../hooks/useSalas";
import { useReserva } from "../hooks/useReserva";
import { User, Sala, Reserva, Notification } from "../types";

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
  const [notification, setNotification] = useState<Notification>(null);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    if (tipoUsuario && tipoUsuario !== "Coordenador" && usuarioLogado) {
      setUsuarioSelecionado(usuarioLogado.id);
    }
  }, [tipoUsuario, usuarioLogado]);

  const horariosOcupados = useMemo(() => {
    console.log("Processando estas reservas:", reservas);
    return reservas.flatMap(r => {
      const inicioStr = r.horarioInicio.slice(0, 5);
      const fimStr = r.horarioFim.slice(0, 5);
      const inicio = horariosDisponiveis.indexOf(inicioStr);
      const fim = horariosDisponiveis.indexOf(fimStr);
      if (inicio === -1 || fim === -1) return [];
      return horariosDisponiveis.slice(inicio, fim);
    });
  }, [reservas]);

  const reservationStartTimes = useMemo(() =>
    new Set(reservas.map(r => r.horarioInicio)),
    [reservas]
  );
  const isStartTimeAvailable = (h: string) => !horariosOcupados.includes(h);

  const isEndTimeAvailable = (h: string) => {
    return !horariosOcupados.includes(h) || reservationStartTimes.has(h);
  };
  const handleAdicionarReserva = async () => {
    if (!usuarioLogado) {
      setNotification({ message: "Erro: Usuário não logado.", type: 'error' });
      return;
    }
    if (!salaSelecionada || !usuarioSelecionado || !dataReserva || !horarioInicio || !horarioFim) {
      setNotification({ message: "Por favor, preencha todos os campos.", type: 'error' });
      return;
    }
    if (horarioFim <= horarioInicio) {
      setNotification({ message: "O horário final deve ser posterior ao inicial.", type: 'error' });
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
      setNotification({ message: "Reserva criada com sucesso!", type: 'success' });
      setDataReserva("");
      setHorarioInicio("");
      setHorarioFim("");
      setRefreshKey(prevKey => prevKey + 1);
    } else {
      setNotification({ message: errorReservas || "Falha ao criar a reserva.", type: 'error' });
    }
  };

  const formError = errorSalas || errorReservas;

  return (
    <div className="min-h-screen bg-[#1e1e2f] text-[#e0e0e0] p-8 font-sans">
      {notification && (
        <div
          className={`fixed top-5 right-5 p-4 rounded-lg shadow-lg text-white font-semibold z-50 ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
        >
          {notification.message}
        </div>
      )}
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
            adicionarReserva={handleAdicionarReserva}
            isStartTimeAvailable={isStartTimeAvailable}
            isEndTimeAvailable={isEndTimeAvailable}
          />
        )}

        {aba === 'minhasReservas' && (
          <ListaDeReservas
            usuarioLogado={usuarioLogado}
            salas={salas}
            refreshKey={refreshKey}
            users={users}
          />
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