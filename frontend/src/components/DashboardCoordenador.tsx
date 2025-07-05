import React, { useState } from "react";
import { Sala, User, Reserva } from "../types";
import TabelaLogs from "./TabelaLogs";
interface Props {
    users: User[];
    salas: Sala[];
    reservas: Reserva[];
    onAddSala: (sala: Omit<Sala, "id">) => Promise<boolean>;
    onDeleteReserva: (id: number) => void;
    onEditReserva: (reserva: Reserva) => void;
    onFazerReservaPara: (reserva: Reserva) => void;
}

const DashboardCoordenador: React.FC<Props> = ({
    users,
    salas,
    onAddSala,
}) => {
    // ESTADO PARA ARMAZENAR OS DADOS DA NOVA SALA A SER ADICIONADA
    const [novaSala, setNovaSala] = useState<Omit<Sala, "id">>({
        numero: 0,
        capacidadeMaxima: 0,
        tipo: "Sala de Aula",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddSalaSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (novaSala.numero === 0 || novaSala.capacidadeMaxima === 0) {
            alert("O número e a capacidade da sala devem ser maiores que zero.");
            return;
        }

        setIsSubmitting(true);
        const sucesso = await onAddSala(novaSala);
        setIsSubmitting(false);

        if (sucesso) {
            alert("Sala adicionada com sucesso!");
            setNovaSala({ numero: 0, capacidadeMaxima: 0, tipo: "Sala de Aula" });
        } else {
            alert("Ocorreu um erro ao adicionar a sala. Verifique o console ou tente novamente.");
        }
    };

    return (
        <section className="bg-[#23233a] rounded-xl p-8 shadow-lg max-w-5xl mx-auto mt-8 text-white">
            <h2 className="text-2xl font-bold mb-6 text-[#80cbc4]">Dashboard do Coordenador</h2>

            <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2 text-white">Adicionar Sala</h3>

                <form
                    className="flex gap-4 flex-wrap items-end"
                    onSubmit={handleAddSalaSubmit}
                >
                    {/* INPUT DO NUMERO DA SALA */}
                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-medium text-gray-300" htmlFor="numeroSala">Número da Sala</label>
                        <input
                            id="numeroSala"
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            placeholder="Ex: 101"
                            value={novaSala.numero === 0 ? "" : novaSala.numero}
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, "");
                                setNovaSala({ ...novaSala, numero: val === "" ? 0 : Number(val) });
                            }}
                            className="p-2 rounded bg-[#44475a] text-white focus:outline-none focus:ring-2 focus:ring-[#80cbc4]"
                            required
                        />
                    </div>

                    {/* DIV DA CAPACIDADE MAXIMA */}
                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-medium text-gray-300" htmlFor="capacidadeMaxima">Capacidade Máxima</label>
                        <input
                            id="capacidadeMaxima"
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            placeholder="Ex: 40"
                            value={novaSala.capacidadeMaxima === 0 ? "" : novaSala.capacidadeMaxima}
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, "");
                                setNovaSala({ ...novaSala, capacidadeMaxima: val === "" ? 0 : Number(val) });
                            }}
                            className="p-2 rounded bg-[#44475a] text-white focus:outline-none focus:ring-2 focus:ring-[#80cbc4]"
                            required
                        />
                    </div>

                    {/* DIV DO TIPO DE SALA */}
                    <div className="flex flex-col">
                        <label className="mb-1 text-sm font-medium text-gray-300" htmlFor="tipoSala">Tipo de Sala</label>
                        <select
                            id="tipoSala"
                            value={novaSala.tipo}
                            onChange={(e) => setNovaSala({ ...novaSala, tipo: e.target.value as Sala["tipo"] })}
                            className="p-2 rounded bg-[#44475a] text-white focus:outline-none focus:ring-2 focus:ring-[#80cbc4]"
                        >
                            <option value="Sala de Aula">Sala de Aula</option>
                            <option value="Laboratorio">Laboratório</option>
                            <option value="Auditorio">Auditório</option>
                        </select>
                    </div>

                    {/* BOTAO PARA ADICIONAR A SALA */}
                    <button
                        type="submit"
                        disabled={isSubmitting || novaSala.numero === 0 || novaSala.capacidadeMaxima === 0}
                        className="bg-[#80cbc4] hover:bg-[#80cbd9] text-[#1e1e2f] font-bold py-2 px-6 rounded-lg shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "Adicionando..." : "Adicionar"}
                    </button>
                </form>
            </div>

            {/* AQUI DEVE SER ADICIONADA A SECAO DE EDITAR RESERVA, FAZER RESERVA E LISTAR RESERVAS */}
            <TabelaLogs users={users} />
        </section>
    );
};

export default DashboardCoordenador;