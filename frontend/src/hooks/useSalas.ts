import { useEffect, useState } from "react";
import { Sala } from "../types";
import { getSalas, addSala } from "../service/api";

// HOOK PERSONALIZADO PARA GERENCIAR AS SALAS DO SISTEMA
export function useSalas() {
    // ESTADO PRA GUARDAR A LISTA DE SALAS QUE VEM DA API
    const [salas, setSalas] = useState<Sala[]>([]);

    // INDICADOR PRA SABER SE ESTA CARREGANDO OS DADOS
    const [loading, setLoading] = useState<boolean>(true);

    // ESTADO PRA GUARDAR UMA MENSAGEM DE ERRO CASO ALGO DE ERRADO ACONTECA
    const [error, setError] = useState<string | null>(null);

    // ESSE USEEFFECT RODA UMA VEZ QUANDO O COMPONENTE MONTAR
    // ELE VAI BUSCAR AS SALAS NO BACKEND E SALVAR NO ESTADO
    useEffect(() => {
        async function fetchSalas() {
            setLoading(true); // FALA QUE TA CARREGANDO
            setError(null);   // LIMPA O ERRO ANTES DE TENTAR

            try {
                const data = await getSalas(); // PEGA A LISTA DE SALAS DA API
                setSalas(data.salas); // SALVA A LISTA NO ESTADO
            } catch (err) {
                setError("Erro ao carregar salas"); // MOSTRA ERRO SE DER RUIM
            } finally {
                setLoading(false); // TERMINA O CARREGAMENTO
            }
        }

        fetchSalas(); // CHAMA A FUNCAO ASSIM QUE O COMPONENTE CARREGAR
    }, []);

    // FUNCAO PRA ADICIONAR UMA NOVA SALA
    async function criarSala(sala: Omit<Sala, "id">) {
        try {
            await addSala(sala); // CHAMA A API PRA ADICIONAR A SALA

            // APOS ADICIONAR, BUSCA A LISTA ATUALIZADA DE NOVO
            const data = await getSalas();
            setSalas(data.salas); // ATUALIZA O ESTADO COM A NOVA LISTA
            return true; // RETORNA TRUE PRA DIZER QUE DEU CERTO
        } catch (err) {
            setError("Erro ao criar sala"); // MOSTRA ERRO SE DER RUIM
            return false; // RETORNA FALSE PRA AVISAR QUE FALHOU
        }
    }

    return { salas, loading, error, criarSala };
}