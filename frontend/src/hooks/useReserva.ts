import { useEffect, useState, useCallback } from "react";
import { Reserva } from "../types";
import { addReserva, getReservas } from "../service/api";

const mapApiDataToReserva = (apiData: any): Reserva => ({
    id: apiData.id,
    solicitanteId: apiData.solicitante_id,
    userId: apiData.user_id,
    salaId: apiData.sala_id,
    dataSolicitacao: apiData.data_da_solicitacao,
    dataReserva: apiData.data_da_reserva,
    horarioInicio: apiData.horario_de_inicio,
    horarioFim: apiData.horario_de_fim,
});
const mapReservaToApiData = (reserva: Omit<Reserva, 'id'>) => ({
    solicitante_id: reserva.solicitanteId,
    user_id: reserva.userId,
    sala_id: reserva.salaId,
    data_da_solicitacao: reserva.dataSolicitacao,
    data_da_reserva: reserva.dataReserva,
    horario_inicio: reserva.horarioInicio,
    horario_fim: reserva.horarioFim,
});

export function useReserva(salaId?: number | string, dataReserva?: string) {
    const [reservas, setReservas] = useState<Reserva[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchReservas = useCallback(async () => {
        if (!salaId || !dataReserva) {
            setReservas([]);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const data = await getReservas(salaId, dataReserva);
            const reservasConvertidas = Array.isArray(data) ? data.map(mapApiDataToReserva) : [];
            setReservas(reservasConvertidas);
        } catch (err: any) {
            setError(err.message || "Erro ao carregar reservas");
        } finally {
            setLoading(false);
        }
    }, [salaId, dataReserva]);

    useEffect(() => {
        fetchReservas();
    }, [fetchReservas]);

    const criarReserva = useCallback(async (reserva: Omit<Reserva, 'id'>) => {
        try {
            const dadosParaApi = mapReservaToApiData(reserva);
            const novaReservaApi = await addReserva(dadosParaApi);
            const novaReservaFormatada = novaReservaApi.reserva as Reserva;

            if (!novaReservaFormatada) {
                throw new Error("A resposta da API após a criação não continha o objeto da reserva.");
            }

            setReservas((prevReservas) => [...prevReservas, novaReservaFormatada]);
            return true;

        } catch (err: any) {
            setError(err.message || "Erro ao criar reserva");
            console.error("Erro ao criar reserva:", err);
            return false;
        }
    }, []);

    return { reservas, loading, error, criarReserva, refetchReservas: fetchReservas };
}