import React, { useState, useEffect, useMemo } from 'react';
import { Reserva, User, Sala } from '../types';
import { listarReservasDoUsuarioAPI, cancelarReservaAPI } from '../service/api';
import { parse, format, isValid, startOfToday } from 'date-fns';

interface ListaDeReservasProps {
    usuarioLogado: User | null;
    salas: Sala[];
    refreshKey: number;
}

const ListaDeReservas: React.FC<ListaDeReservasProps> = ({ usuarioLogado, salas, refreshKey }) => {
    const [minhasReservas, setMinhasReservas] = useState<Reserva[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (usuarioLogado) {
            const fetchReservas = async () => {
                setIsLoading(true);
                setError(null);
                try {
                    const data = await listarReservasDoUsuarioAPI(usuarioLogado.id);
                    setMinhasReservas(data);
                } catch (err: any) {
                    setError(err.message);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchReservas();
        } else {
            setIsLoading(false);
            setMinhasReservas([]);
        }
    }, [usuarioLogado, refreshKey]);

    const { reservasFuturas, reservasPassadas } = useMemo(() => {
        const hoje = startOfToday();
        const futuras: Reserva[] = [];
        const passadas: Reserva[] = [];

        const sortedReservas = [...minhasReservas].sort(
            (a, b) => new Date(a.dataReserva).getTime() - new Date(b.dataReserva).getTime()
        );

        sortedReservas.forEach(reserva => {
            const dataReservaObj = parse(reserva.dataReserva, 'yyyy-MM-dd', new Date());
            if (isValid(dataReservaObj) && dataReservaObj >= hoje) {
                futuras.push(reserva);
            } else {
                passadas.push(reserva);
            }
        });

        return { reservasFuturas: futuras, reservasPassadas: passadas.reverse() };
    }, [minhasReservas]);


    const handleCancelarClick = async (id: number) => {
        if (!usuarioLogado) {
            alert("Você precisa estar logado para cancelar uma reserva.");
            return;
        }
        console.log(`Tentando cancelar reserva com ID: ${id}`);
        if (window.confirm("Tem certeza que deseja cancelar esta reserva?")) {
            try {
                await cancelarReservaAPI(id);
                alert("Reserva cancelada com sucesso!");

                setMinhasReservas(prevReservas => prevReservas.filter(r => r.id !== id));
            } catch (err: any) {
                alert(`Erro ao cancelar a reserva: ${err.message}`);
            }
        }
    };

    const handleEditarClick = (reserva: Reserva) => {
        alert(`Funcionalidade de editar a reserva ${reserva.id} ainda não implementada.`);
    };

    if (isLoading) {
        return <p className="text-center text-gray-400 mt-10">Carregando suas reservas...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500 mt-10">Erro ao carregar reservas: {error}</p>;
    }

    return (
        <div className="space-y-10">
            <section className="bg-[#2a2a40] rounded-xl p-8 shadow-lg max-w-4xl mx-auto">
                <h2 className="text-2xl font-semibold mb-6 border-b border-[#80cbc4] pb-2 text-white">Próximas Reservas</h2>
                {reservasFuturas.length > 0 ? (
                    <ul className="space-y-4">
                        {reservasFuturas.map((reserva) => {
                            const salaInfo = salas.find(s => s.id === reserva.salaId);
                            const dataFormatada = format(parse(reserva.dataReserva, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy');
                            return (
                                <li key={reserva.id} className="bg-[#44475a] p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div>
                                        <p className="font-bold text-white">
                                            Sala: {salaInfo ? `${salaInfo.numero} (${salaInfo.tipo})` : `ID ${reserva.salaId}`}
                                        </p>
                                        <p className="text-sm text-gray-300">
                                            Data: {dataFormatada} | Horário: {reserva.horarioInicio} - {reserva.horarioFim}
                                        </p>
                                    </div>
                                    <div className="flex gap-2 self-end sm:self-center">
                                        <button onClick={() => handleEditarClick(reserva)} className="w-full py-3 bg-[#80cbc4] text-[#1e1e2f] rounded hover:bg-[#00acc1] transition-colors">
                                            Editar
                                        </button>
                                        <button onClick={() => handleCancelarClick(reserva.id)} className="w-full py-3 bg-red-700  text-[#1e1e2f] rounded hover:bg-red-500 transition-colors">
                                            Cancelar
                                        </button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <p className="text-center text-gray-400">Você não possui nenhuma reserva futura.</p>
                )}
            </section>

            <section className="bg-[#2a2a40] rounded-xl p-8 shadow-lg max-w-4xl mx-auto">
                <h2 className="text-2xl font-semibold mb-6 border-b border-gray-600 pb-2 text-white">Histórico de Reservas</h2>
                {reservasPassadas.length > 0 ? (
                    <ul className="space-y-4">
                        {reservasPassadas.map((reserva) => {
                            const salaInfo = salas.find(s => s.id === reserva.salaId);
                            const dataFormatada = format(parse(reserva.dataReserva, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy');
                            return (
                                <li key={reserva.id} className="bg-[#44475a] p-4 rounded-lg opacity-60">
                                    <div>
                                        <p className="font-bold text-white">
                                            Sala: {salaInfo ? `${salaInfo.numero} (${salaInfo.tipo})` : `ID ${reserva.salaId}`}
                                        </p>
                                        <p className="text-sm text-gray-300">
                                            Data: {dataFormatada} | Horário: {reserva.horarioInicio} - {reserva.horarioFim}
                                        </p>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <p className="text-center text-gray-400">Nenhum histórico de reservas encontrado.</p>
                )}
            </section>
        </div>
    );
};

export default ListaDeReservas;