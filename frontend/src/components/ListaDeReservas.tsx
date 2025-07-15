import React, { useState, useEffect, useMemo } from 'react';
import { Reserva, User, Sala, Notification } from '../types';
import { parse, format, isValid, startOfToday } from 'date-fns';
import { cancelarReservaAPI, getAllReservasAPI } from '../service/api';

interface ListaDeReservasProps {
    usuarioLogado: User | null;
    salas: Sala[];
    refreshKey: number;
    users: User[];
}

const ListaDeReservas: React.FC<ListaDeReservasProps> = ({ usuarioLogado, salas, refreshKey, users }) => {
    const [minhasReservas, setMinhasReservas] = useState<Reserva[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reservaParaCancelar, setReservaParaCancelar] = useState<number | null>(null);
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
        if (usuarioLogado) {
            const fetchEFiltrarReservas = async () => {
                setIsLoading(true);
                setError(null);
                try {
                    const todasAsReservas = await getAllReservasAPI();

                    const reservasDoUsuario = todasAsReservas.filter(reserva =>
                        reserva.solicitanteId === usuarioLogado.id || reserva.userId === usuarioLogado.id
                    );

                    setMinhasReservas(reservasDoUsuario);

                } catch (err: any) {
                    setError(err.message);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchEFiltrarReservas();
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

    const getNomeUsuario = (userId: number): string => {
        const user = users.find(u => u.id === userId);
        return user ? user.nome : `Usuário ID ${userId}`;
    };


    const handleConfirmarCancelamento = async () => {
        if (!reservaParaCancelar) return;

        try {
            await cancelarReservaAPI(reservaParaCancelar);
            setNotification({ message: 'Reserva cancelada com sucesso!', type: 'success' });
            setMinhasReservas(prev => prev.filter(r => r.id !== reservaParaCancelar));
        } catch (err: any) {
            setNotification({ message: `Erro ao cancelar: ${err.message}`, type: 'error' });
        } finally {
            setReservaParaCancelar(null);
        }
    };

    // const handleEditarClick = (reserva: Reserva) => {
    //     alert(`Funcionalidade de editar a reserva ${reserva.id} ainda não implementada.`);
    // };

    const handleCancelarClick = (id: number) => setReservaParaCancelar(id);

    const handleVoltar = () => setReservaParaCancelar(null);
    if (isLoading) {
        return <p className="text-center text-gray-400 mt-10">Carregando suas reservas...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500 mt-10">Erro ao carregar reservas: {error}</p>;
    }

    return (
        <div className="space-y-10">
            {notification && (
                <div
                    className={`fixed top-5 right-5 p-4 rounded-lg shadow-lg text-white font-semibold z-50 ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
                >
                    {notification.message}
                </div>
            )}
            <section className="bg-[#2a2a40] rounded-xl p-8 shadow-lg max-w-4xl mx-auto">
                <h2 className="text-2xl font-semibold mb-6 border-b border-[#80cbc4] pb-2 text-white">Próximas Reservas</h2>
                {reservasFuturas.length > 0 ? (
                    <ul className="space-y-4">
                        {reservasFuturas.map((reserva) => {
                            const salaInfo = salas.find(s => s.id === reserva.salaId);
                            const dataFormatada = format(parse(reserva.dataReserva, 'yyyy-MM-dd', new Date()), 'dd/MM/yyyy');
                            const feitaParaOutro = usuarioLogado && reserva.userId !== usuarioLogado.id;
                            const isConfirmando = reservaParaCancelar === reserva.id;

                            return (
                                <li key={reserva.id} className="bg-[#44475a] p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div>
                                        <p className="font-bold text-white">
                                            Sala: {salaInfo ? `${salaInfo.numero} (${salaInfo.tipo})` : `ID ${reserva.salaId}`}
                                        </p>

                                        {feitaParaOutro && (
                                            <p className="text-sm font-semibold text-yellow-400 mt-1">
                                                Para: {getNomeUsuario(reserva.userId)}
                                            </p>
                                        )}

                                        <p className="text-sm text-gray-300 mt-1">
                                            Data: {dataFormatada} | Horário: {reserva.horarioInicio} - {reserva.horarioFim}
                                        </p>
                                        {isConfirmando && (
                                            <p className="text-red-700 font-bold mt-2 animate-pulse">Tem certeza?</p>
                                        )}
                                    </div>
                                    <div className="flex gap-2 self-end sm:self-center">
                                        {isConfirmando ? (
                                            <>
                                                <button onClick={handleConfirmarCancelamento} className="py-2 px-4 bg-red-700 text-white rounded hover:bg-red-500 transition-colors font-semibold">
                                                    Sim, cancelar
                                                </button>
                                                <button onClick={handleVoltar} className="py-2 px-4 bg-gray-500 text-white rounded hover:bg-gray-400 transition-colors">
                                                    Voltar
                                                </button>
                                            </>
                                        ) : (
                                            <button onClick={() => handleCancelarClick(reserva.id)} className="py-2 px-4 bg-red-700 text-white rounded hover:bg-red-500 transition-colors">
                                                Cancelar
                                            </button>
                                        )}
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