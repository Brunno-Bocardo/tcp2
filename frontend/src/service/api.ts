import { Sala, User, Reserva } from "../types";

const API = "http://localhost:5000/api";

interface SalasResponse {
    mensagem: string;
    salas: Sala[];
}

export async function addSala(sala: Omit<Sala, "id">): Promise<Sala> {
    const res = await fetch(`${API}/sala`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sala),
    });
    return res.json();
}

export async function getSalas(): Promise<SalasResponse> {
    const res = await fetch(`${API}/salas`);
    if (!res.ok) throw new Error("Erro ao buscar salas");
    return res.json();
}


export async function addUser(user: Omit<User, "id">): Promise<User> {
    const res = await fetch(`${API}/usuario`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
    });
    return res.json();
}

export async function getUsers(): Promise<User[]> {
    const res = await fetch(`${API}/usuarios`);
    return res.json();
}

export async function getReservas(salaId: number | string, dataReserva: string): Promise<Reserva[] | undefined> {
    const url = `${API}/reservas/${salaId}/${dataReserva}`;
    const res = await fetch(url);

    if (!res.ok) {
        throw new Error(`Erro ao buscar reservas: ${res.statusText}`);
    }

    return res.json();
}
export async function addReserva(reservaParaApi: any): Promise<any> {

    const res = await fetch(`${API}/reserva`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reservaParaApi),
    });

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({
            message: `A API retornou um erro ${res.status} sem uma mensagem JSON.`
        }));
        throw new Error(errorData.message || "Falha ao criar reserva na API");
    }

    return res.json();
}

export async function listarReservasDoUsuarioAPI(userId: number): Promise<Reserva[]> {
    const res = await fetch(`${API}/reservas?solicitanteId=${userId}`);

    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Erro ao buscar as reservas do usuário");
    }

    const dataFromApi = await res.json();
    const rawReservas = dataFromApi.reserva;
    if (!Array.isArray(rawReservas)) {
        console.error("A resposta ficou raw:", rawReservas);
        return [];
    }

    const reservasEmCamelCase: Reserva[] = rawReservas.map((reserva: any) => ({
        id: reserva.id,
        solicitanteId: reserva.solicitante_id,
        userId: reserva.user_id,
        salaId: reserva.sala_id,
        dataSolicitacao: reserva.data_da_solicitacao.split('T')[0],
        dataReserva: reserva.data_da_reserva.split('T')[0],
        horarioInicio: reserva.horario_de_inicio,
        horarioFim: reserva.horario_de_fim,
    }));

    return reservasEmCamelCase;
}

export async function cancelarReservaAPI(id: number): Promise<any> {
    const reservaParaEnviar = {
        id: id,
    };

    const res = await fetch(`${API}/reserva`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reservaParaEnviar),
    });

    return res.json();
}

export async function getAllReservasAPI(): Promise<Reserva[]> {
    const res = await fetch(`${API}/reservas/all`);

    if (!res.ok) {
        throw new Error("Erro ao buscar todas as reservas");
    }

    const dataFromApi = await res.json();

    if (!Array.isArray(dataFromApi)) {
        console.error("A API não retornou um array para 'todas as reservas':", dataFromApi);
        return [];
    }

    const reservasEmCamelCase: Reserva[] = dataFromApi.map((reserva: any) => ({
        id: reserva.id,
        solicitanteId: reserva.solicitante_id,
        userId: reserva.user_id,
        salaId: reserva.sala_id,
        dataSolicitacao: reserva.data_da_solicitacao.split('T')[0],
        dataReserva: reserva.data_da_reserva.split('T')[0],
        horarioInicio: reserva.horario_de_inicio,
        horarioFim: reserva.horario_de_fim,
    }));

    return reservasEmCamelCase;
}