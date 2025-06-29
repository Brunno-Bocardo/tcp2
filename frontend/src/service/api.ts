import { Sala, User, Reserva } from "../types";

const API = "http://localhost:5000/api";

export async function getSalas(): Promise<Sala[]> {
    const res = await fetch(`${API}/salas`);
    return res.json();
}

export async function addSala(sala: Omit<Sala, "id">): Promise<Sala> {
    const res = await fetch(`${API}/salas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sala),
    });
    return res.json();
}
export async function addUser(user: Omit<User, "id">): Promise<User> {
    const res = await fetch(`${API}/usuarios`, {
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

export async function getReservas(): Promise<Reserva[]> {
    const res = await fetch(`${API}/reservas`);
    return res.json();
}

export async function addReserva(reserva: Reserva): Promise<any> {
    const res = await fetch(`${API}/reserva`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reserva),
    });
    return res.json();
}

