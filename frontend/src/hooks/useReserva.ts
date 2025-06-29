import { useEffect, useState } from "react";
import { Reserva } from "../types";
import { getReservas, addReserva } from "../service/api";

// HOOK PERSONALIZADO PARA GERENCIAR RESERVAS
export function useReserva() {
    // LISTA DE RESERVAS QUE VAI SER EXIBIDA
    const [reservas, setReservas] = useState<Reserva[]>([]);

    // INDICADOR DE CARREGAMENTO (TRUE QUANDO TIVER BUSCANDO DADOS)
    const [loading, setLoading] = useState<boolean>(true);

    // ERRO CASO ACONTECA ALGUMA FALHA NA REQUISICAO
    const [error, setError] = useState<string | null>(null);

    // USA O USEEFFECT PRA CARREGAR AS RESERVAS QUANDO O COMPONENTE MONTAR
    useEffect(() => {
        async function fetchReservas() {
            setLoading(true); // COMECA A MOSTRAR QUE TA CARREGANDO
            setError(null); // LIMPA ERRO ANTES DE TENTAR NOVAMENTE

            try {
                const data = await getReservas(); // CHAMA A API PRA PEGAR RESERVAS
                // Converte os campos snake_case para camelCase
                const reservasConvertidas = data.map((r: any) => ({
                    ...r,
                    userId: r.user_id,
                    salaId: r.sala_id,
                    dataDaReserva: r.data_da_reserva,
                    horarioInicio: r.r.horario_inicio,
                    horarioFim: r.horario_fim,
                }));
                setReservas(reservasConvertidas); // SALVA OS DADOS NO ESTADO
            } catch (err) {
                setError("Erro ao carregar reservas"); // SE DER ERRO MOSTRA A MENSAGEM
            } finally {
                setLoading(false); // PARA DE MOSTRAR O CARREGANDO
            }
        }

        fetchReservas(); // CHAMA A FUNCAO ASSIM QUE O COMPONENTE MONTAR
    }, []);

    // FUNCAO PARA CRIAR UMA NOVA RESERVA
    async function criarReserva(reserva: Reserva) {
        try {
            const resposta = await addReserva(reserva); // CHAMA A API PRA ADICIONAR A RESERVA

            // SE DER ALGUM ERRO NO BACKEND
            if (resposta?.error || resposta?.status === "erro") {
                setError(resposta?.message || "Erro ao criar reserva");
                console.error("Erro do backend ao criar reserva:", resposta);
                return false; // RETORNA FALSE PRA INDICAR QUE NAO DEU CERTO
            }

            // Atualiza as reservas convertendo os campos
            const data = await getReservas();
            const reservasConvertidas = data.map((r: any) => ({
                ...r,
                userId: r.user_id,
                salaId: r.sala_id,
                dataDaReserva: r.data_da_reserva,
                horarioInicio: r.horario_inicio,
                horarioFim: r.horario_fim,
            }));
            setReservas(reservasConvertidas); // ATUALIZA A LISTA COM A NOVA RESERVA
            return true; // TRUE SIGNIFICANDO QUE FUNCIONOU
        } catch (err: any) {
            setError("Erro ao criar reserva"); // MSG DE ERRO
            console.error("Erro ao criar reserva:", err);
            return false; // TAMBEM RETORNA FALSE
        }
    }

    return { reservas, loading, error, criarReserva };
}
