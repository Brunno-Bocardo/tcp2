// src/components/TabelaLogs.tsx
import React, { useEffect, useState } from "react";
import { User } from "../types";

const TabelaLogs: React.FC<{ users?: User[] }> = ({ users = [] }) => {
    const [logs, setLogs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [eventoFiltro, setEventoFiltro] = useState<string>("");
    const [usuarioFiltro, setUsuarioFiltro] = useState<string>("");
    const [minimizado, setMinimizado] = useState(false);

    useEffect(() => {
        async function fetchLogs() {
            setLoading(true);
            try {
                const res = await fetch("http://localhost:5000/api/logs");
                const data = await res.json();
                setLogs(Array.isArray(data) ? data : data.logs || []);
            } catch {
                setLogs([]);
            } finally {
                setLoading(false);
            }
        }
        fetchLogs();
    }, []);

    const eventosUnicos = Array.from(new Set(logs.map(l => l.evento).filter(Boolean)));
    const usuariosUnicos = Array.from(new Set(logs.map(l => l.usuario_id).filter(Boolean)));

    const logsFiltrados = logs.filter(log => {
        const eventoOk = eventoFiltro ? log.evento === eventoFiltro : true;
        const usuarioOk = usuarioFiltro ? String(log.usuario_id) === usuarioFiltro : true;
        return eventoOk && usuarioOk;
    });

    const getNomeUsuario = (usuario_id: number | null) => {
        if (!usuario_id) return "-";
        const user = users.find(u => u.id === usuario_id);
        return user ? user.nome : usuario_id;
    };

    return (
        <section className="mt-10">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-[#80cbc4]">Logs de Auditoria</h3>
                <button
                    onClick={() => setMinimizado(m => !m)}
                    className="text-xs px-3 py-1 rounded bg-[#44475a] hover:bg-[#80cbc4] hover:text-[#23233a] transition"
                >
                    {minimizado ? "Maximizar" : "Minimizar"}
                </button>
            </div>

            {!minimizado && (
                <>
                    <div className="flex gap-4 mb-4 flex-wrap">
                        <div>
                            <label className="block text-sm mb-1">Filtrar por Evento</label>
                            <select
                                value={eventoFiltro}
                                onChange={e => setEventoFiltro(e.target.value)}
                                className="p-2 rounded bg-[#44475a] text-white"
                            >
                                <option value="">Todos</option>
                                {eventosUnicos.map(ev => (
                                    <option key={ev} value={ev}>{ev}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm mb-1">Filtrar por Usuário</label>
                            <select
                                value={usuarioFiltro}
                                onChange={e => setUsuarioFiltro(e.target.value)}
                                className="p-2 rounded bg-[#44475a] text-white"
                            >
                                <option value="">Todos</option>
                                {usuariosUnicos.map(uid => (
                                    <option key={uid} value={uid}>
                                        {getNomeUsuario(Number(uid))}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <p className="text-gray-400">Carregando logs...</p>
                    ) : logsFiltrados.length === 0 ? (
                        <p className="text-gray-400">Nenhum log encontrado.</p>
                    ) : (
                        <div className="overflow-x-auto rounded">
                            <table className="min-w-full bg-[#23233a] text-white border border-[#44475a]">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2 border-b border-[#44475a]">Data/Hora</th>
                                        <th className="px-4 py-2 border-b border-[#44475a]">Usuário</th>
                                        <th className="px-4 py-2 border-b border-[#44475a]">Ação</th>
                                        <th className="px-4 py-2 border-b border-[#44475a]">Detalhes</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logsFiltrados.map((log, idx) => (
                                        <tr key={idx} className="hover:bg-[#2a2a40]">
                                            <td className="px-4 py-2">{log.data_hora || "-"}</td>
                                            <td className="px-4 py-2">{getNomeUsuario(log.usuario_id)}</td>
                                            <td className="px-4 py-2">{log.evento || "-"}</td>
                                            <td className="px-4 py-2">{log.descricao || "-"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}
        </section>
    );
};

export default TabelaLogs;
