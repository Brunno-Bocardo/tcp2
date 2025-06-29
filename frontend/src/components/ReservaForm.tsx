import React from "react";
import HorarioDropdown from "./HorarioDropdown";
import { User, Sala } from "../types";

// INTERFACE DEFININDO AS PROPRIEDADES QUE O FORMULRIO RECEBE
interface Props {
    tipoUsuario: string;
    users: User[];
    usuarioSelecionado: number | null;
    setUsuarioSelecionado: (id: number) => void;
    usuarioLogado: User | null;
    salaSelecionada: number | null;
    setSalaSelecionada: (id: number) => void;
    salas: Sala[];
    dataDaReserva: string;
    setDataReserva: (data: string) => void;
    horarioInicio: string;
    setHorarioInicio: (h: string) => void;
    horarioFim: string;
    setHorarioFim: (h: string) => void;
    horariosDisponiveis: string[];
    estaDisponivel: (h: string) => boolean;
    adicionarReserva: () => void;
}

// COMPONENTE PRINCIPAL DO FORMULAARIO DE RESERVA
const ReservaForm: React.FC<Props> = ({
    tipoUsuario,
    users,
    usuarioSelecionado,
    setUsuarioSelecionado,
    usuarioLogado,
    salaSelecionada,
    setSalaSelecionada,
    salas,
    dataDaReserva,
    setDataReserva,
    horarioInicio,
    setHorarioInicio,
    horarioFim,
    setHorarioFim,
    horariosDisponiveis,
    estaDisponivel,
    adicionarReserva,
}) => {
    return (
        <section className="bg-[#2a2a40] rounded-xl p-8 shadow-lg max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6 border-b border-[#80cbc4] pb-2">Nova Reserva</h2>

            {/* FORMULARIO PRINCIPAL */}
            <form
                onSubmit={(e) => {
                    e.preventDefault(); // PREVINE O RELOAD DA PAGINA
                    adicionarReserva(); // FUNCAO DE ENVIO
                }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
                {/* CAMPO DE USUARIO - SOMENTE COORDENADOR PODE ESCOLHER */}
                <div>
                    <label className="block mb-2 text-sm font-semibold">Usuário</label>
                    {tipoUsuario === "Coordenador" ? (
                        <select
                            value={usuarioSelecionado || ""}
                            onChange={(e) => setUsuarioSelecionado(Number(e.target.value))}
                            className="w-full p-3 rounded-md bg-[#44475a] border border-gray-600 text-[#e0e0e0] focus:outline-none focus:border-[#80cbc4] transition"
                            required
                        >
                            <option value="" disabled>
                                Selecione um usuário
                            </option>
                            {/* LISTA DE USUARIOS DISPONIVEIS */}
                            {users.map((u) => (
                                <option key={u.id} value={u.id}>
                                    {u.nome} ({u.tipo})
                                </option>
                            ))}
                        </select>
                    ) : (
                        // SE NAO FOR COORDENADOR,VAI EXIBER NOME DO USUARIO QUE TA LOGADO
                        <input
                            type="text"
                            value={usuarioLogado?.nome || ""}
                            disabled
                            className="bg-gray-700 text-gray-300"
                        />
                    )}
                </div>

                {/* SELECAO DE SALA */}
                <div>
                    <label className="block mb-2 text-sm font-semibold">Sala</label>
                    <select
                        value={salaSelecionada || ""}
                        onChange={(e) => setSalaSelecionada(Number(e.target.value))}
                        className="w-full p-3 rounded-md bg-[#44475a] border border-gray-600 text-[#e0e0e0] focus:outline-none focus:border-[#80cbc4] transition"
                        required
                        disabled={salas.length === 0} // DESABILITA SE NAO HOUVER SALAS
                    >
                        <option value="" disabled>
                            {salas.length === 0 ? "Nenhuma sala disponível" : "Selecione uma sala"}
                        </option>
                        {salas.map((s) => (
                            <option key={s.id} value={s.id}>
                                Sala {s.numero} ({s.tipo}, max {s.capacidadeMaxima})
                            </option>
                        ))}
                    </select>
                </div>

                {/* CAMPO DE DATA */}
                <div>
                    <label className="block mb-2 text-sm font-semibold">Data da Reserva</label>
                    <input
                        type="date"
                        value={dataDaReserva}
                        onChange={(e) => setDataReserva(e.target.value)}
                        min={new Date().toISOString().split("T")[0]} // NAO PERMITE DATAS PASSADAS
                        className="w-full p-3 rounded-md bg-[#44475a] border border-gray-600 text-[#e0e0e0] focus:outline-none focus:border-[#80cbc4] transition"
                        required
                    />
                </div>

                {/* DROPDOWNS DE HORARIO INICIO E FIM */}
                <div className="flex gap-4">
                    <HorarioDropdown
                        label="Horário Início"
                        horarios={horariosDisponiveis}
                        horarioSelecionado={horarioInicio}
                        setHorarioSelecionado={setHorarioInicio}
                        horarioDisponivel={estaDisponivel}
                        disabled={!salaSelecionada || !dataDaReserva}

                    />
                    <HorarioDropdown
                        label="Horário Fim"
                        horarios={horariosDisponiveis}
                        horarioSelecionado={horarioFim}
                        setHorarioSelecionado={setHorarioFim}
                        horarioDisponivel={estaDisponivel}
                        filtroMinimo={horarioInicio}
                        disabled={!horarioInicio}
                    />
                </div>

                {/* BOTAO DE SUBMIT */}
                <div className="sm:col-span-2 flex justify-center">
                    <button
                        type="submit"
                        disabled={
                            !salaSelecionada ||
                            !usuarioSelecionado ||
                            !dataDaReserva ||
                            !horarioInicio ||
                            !horarioFim
                        }
                        className="bg-[#80cbc4] hover:bg-[#80cbd9] text-[#1e1e2f] font-bold py-3 px-12 rounded-xl shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Adicionar Reserva
                    </button>
                </div>
            </form>
        </section>
    );
};

export default ReservaForm;
