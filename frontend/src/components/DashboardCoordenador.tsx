import React, { useState } from "react";
import { Sala, User, Reserva } from "../types";

// DEFINE A INTERFACE DE PROPRIEDADES QUE O COMPONENTE RECEBE
interface Props {
    users: User[];
    salas: Sala[];
    reservas: Reserva[]; // LISTA DE RESERVAS (NAO USADA ATUALMENTE)
    onAddSala: (sala: Omit<Sala, "id">) => void;
    onDeleteReserva: (id: number) => void; // FUNCAO PARA DELETAR UMA RESERVA (NAO USADA AQUI AINDA)
    onEditReserva: (reserva: Reserva) => void; // FUNCAO PARA EDITAR UMA RESERVA (NAO USADA AQUI AINDA)
    onFazerReservaPara: (reserva: Reserva) => void; // FUNCAO PARA FAZER UMA RESERVA PARA UM USUARIO 
}

// DEFINE O COMPONENTE DashboardCoordenador COM SUAS PROPRIEDADES
const DashboardCoordenador: React.FC<Props> = ({
    users,
    salas,
    // reservas,
    onAddSala,
    // onDeleteReserva,
    // onEditReserva,
    // onFazerReservaPara,
}) => {
    // ESTADO PARA ARMAZENAR OS DADOS DA NOVA SALA A SER ADICIONADA
    const [novaSala, setNovaSala] = useState<Omit<Sala, "id">>({
        numero: 0,
        capacidadeMaxima: 0,
        tipo: "Sala de Aula",
    });

    // OS ESTADOS ABAIXO ESTAO COMENTADOS MAS SERVIRIAM PARA EDITAR E CRIAR RESERVAS
    // const [reservaEditando, setReservaEditando] = useState<Reserva | null>(null);
    // const [reservaPara, setReservaPara] = useState<Omit<Reserva, "userId"> & { userId: number }>({...});

    return (
        // DIV PRINCIPAL COM ESTILOS DE FUNDO, BORDA ARREDONDADA, SOMBRA E CENTRALIZADO
        <section className="bg-[#23233a] rounded-xl p-8 shadow-lg max-w-5xl mx-auto mt-8 text-white">
            {/* TITULO PRINCIPAL DO DASHBOARD */}
            <h2 className="text-2xl font-bold mb-6 text-[#80cbc4]">Dashboard do Coordenador</h2>

            {/* SECAO PARA ADICIONAR UMA NOVA SALA */}
            <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2 text-white">Adicionar Sala</h3>

                {/* FORMULARIO DE ADICAO DE SALA */}
                <form
                    className="flex gap-4 flex-wrap items-end"
                    onSubmit={(e) => {
                        e.preventDefault(); // PREVINE O RECARREGAMENTO DA PAGINA
                        onAddSala(novaSala); // CHAMA A FUNCAO onAddSala COM OS DADOS DA NOVA SALA
                        // RESETA O FORMULARIO PARA OS VALORES INICIAIS
                        setNovaSala({ numero: 0, capacidadeMaxima: 0, tipo: "Sala de Aula" });
                    }}
                >
                    {/* INPUT DO NUMERO DA SALA */}
                    <div className="flex flex-col">
                        <label className="mb-1 text-white" htmlFor="numeroSala">Número</label>
                        <input
                            id="numeroSala"
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            placeholder="Digite o número"
                            value={novaSala.numero === 0 ? "" : novaSala.numero}
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, ""); // REMOVE QUALQUER CARACTERE QUE NAO SEJA NUMERO
                                setNovaSala({ ...novaSala, numero: val === "" ? 0 : Number(val) });
                            }}
                            className="p-2 rounded bg-[#44475a] text-white"
                            required
                        />
                    </div>

                    {/* DIV DA CAPACIDADE MAXIMA */}
                    <div className="flex flex-col">
                        <label className="mb-1 text-white" htmlFor="capacidadeMaxima">Capacidade máxima</label>
                        <input
                            id="capacidadeMaxima"
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            placeholder="Digite a capacidade"
                            value={novaSala.capacidadeMaxima === 0 ? "" : novaSala.capacidadeMaxima}
                            onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, ""); // SOMENTE NUMEROS
                                setNovaSala({ ...novaSala, capacidadeMaxima: val === "" ? 0 : Number(val) });
                            }}
                            className="p-2 rounded bg-[#44475a] text-white"
                            required
                        />
                    </div>

                    {/* DIV DO TIPO DE SALA */}
                    <div className="flex flex-col">
                        <label className="mb-1 text-white" htmlFor="tipoSala">Tipo</label>
                        <select
                            id="tipoSala"
                            value={novaSala.tipo}
                            onChange={(e) => setNovaSala({ ...novaSala, tipo: e.target.value as Sala["tipo"] })}
                            className="p-2 rounded bg-[#44475a] text-white"
                        >
                            <option value="Sala de Aula">Sala de Aula</option>
                            <option value="Laboratorio">Laboratorio</option>
                            <option value="Auditorio">Auditorio</option>
                        </select>
                    </div>

                    {/* BOTAO PARA ADICIONAR A SALA */}
                    <button
                        type="submit"
                        className="bg-[#80cbc4] hover:bg-[#80cbd9] text-[#1e1e2f] font-bold py-3 px-12 rounded-xl shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Adicionar
                    </button>
                </form>
            </div>

            {/* AQUI DEVE SER ADICIONADA A SECAO DE EDITAR RESERVA, FAZER RESERVA E LISTAR RESERVAS */}
            {/* POR ENQUANTO SOMENT A ADCAO DE SALAS */}

        </section>
    );
};

export default DashboardCoordenador;
