import { useEffect, useState, useCallback } from "react";
import { Reserva } from "../types";
import { getReservas, addReserva } from "../service/api";

const mapApiDataToReserva = (apiData: any): Reserva => ({
    id: apiData.id,
    userId: apiData.user_id,
    salaId: apiData.sala_id,
    dataSolicitacao: apiData.data_da_solicitacao,
    dataReserva: apiData.data_da_reserva,
    horarioInicio: apiData.horario_inicio,
    horarioFim: apiData.horario_fim,
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
            if (data && Array.isArray(data)) {
                const reservasConvertidas = data.map(mapApiDataToReserva);
                setReservas(reservasConvertidas);
            } else {
                setReservas([]);
            }
        } catch (err: any) {
            setError(err.message || "Erro ao carregar reservas");
        } finally {
            setLoading(false);
        }
    }, [salaId, dataReserva])

    useEffect(() => {
        fetchReservas();
    }, [fetchReservas]);

    async function criarReserva(reserva: Omit<Reserva, 'id'>) {
        try {
            const novaReservaApi = await addReserva(reserva as Reserva);
            const novaReservaFormatada = mapApiDataToReserva(novaReservaApi);

            setReservas((prevReservas) => [...prevReservas, novaReservaFormatada]);

            return true;
        } catch (err: any) {
            setError(err.message || "Erro ao criar reserva");
            console.error("Erro ao criar reserva:", err);
            return false;
        }
    }

    return { reservas, loading, error, criarReserva, refetchReservas: fetchReservas };
}