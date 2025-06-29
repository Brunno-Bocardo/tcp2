import React, { useEffect, useRef, useState } from "react";

// INTERFACE DEFININDO AS PROPRIEDADES QUE O COMPONENTE VAI RECEBER
interface HorarioDropdownProps {
    horarios: string[];
    horarioSelecionado: string;
    setHorarioSelecionado: (h: string) => void; // FUNCAO PARA ATUALIZAR O HORARIO SELECIONADO
    horarioDisponivel: (h: string) => boolean; // FUNCAO PARA VERIFICAR SE UM HORARIO ESTA DISPONIVEL
    label: string; // TEXTO DO ROTULO QUE FICA EM CIMA DO DROPDOWN
    filtroMinimo?: string; // HORARIO MINIMO PARA FILTRAR A LISTA
    disabled?: boolean; // DESABILITA O DROPDOWN SE FOR TRUE
}

// COMPONENTE FUNCIONAL RECEBENDO AS PROPS DEFINIDAS ACIMA
const HorarioDropdown: React.FC<HorarioDropdownProps> = ({
    horarios,
    horarioSelecionado,
    setHorarioSelecionado,
    horarioDisponivel,
    label,
    filtroMinimo,
    disabled = false,
}) => {
    // ESTADO QUE DEFINE SE O DROPDOWN ESTA ABERTO OU FECHADO
    const [aberto, setAberto] = useState(false);

    // REFERENCIA PARA O DROPDOWN - USADO PARA SABER SE O CLIQUE FOI FORA DO COMPONENTE
    const dropdownRef = useRef<HTMLDivElement>(null);

    // EFEITO QUE FECHA O DROPDOWN SE O USUARIO CLICAR FORA DO COMPONENTE
    useEffect(() => {
        const handleClickFora = (event: MouseEvent) => {
            // SE O CLIQUE FOI FORA DO DROPDOWN, FECHA
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setAberto(false);
            }
        };
        document.addEventListener("mousedown", handleClickFora); // ADICIONA EVENTO DE CLIQUE
        return () => document.removeEventListener("mousedown", handleClickFora); // LIMPA EVENTO
    }, []);

    // SE O COMPONENTE FOR DESABILITADO, ELE SE FECHA AUTOMATICAMENTE
    useEffect(() => {
        if (disabled) setAberto(false);
    }, [disabled]);

    // FILTRA OS HORARIOS SE TIVER UM VALOR MINIMO DEFINIDO
    const horariosFiltrados = filtroMinimo
        ? horarios.filter((h) => h > filtroMinimo)
        : horarios;

    return (
        // CONTAINER PRINCIPAL DO DROPDOWN COM REFERENCIA
        <div className="relative w-[140px]" ref={dropdownRef}>
            {/* ROTULO DO DROPDOWN */}
            <label className={`block mb-2 text-sm font-semibold ${disabled ? "opacity-50" : ""}`}>
                {label}
            </label>

            {/* BOTAO QUE ABRE OU FECHA A LISTA DE HORARIOS */}
            <button
                type="button"
                onClick={() => !disabled && setAberto((a) => !a)} // ABRE/FECHA SE NAO ESTIVER DESABILITADO
                className={`w-[140px] text-left p-3 rounded-md border border-gray-600 transition-colors duration-200
          ${disabled ? "bg-gray-700 text-gray-500 cursor-not-allowed" : "bg-[#44475a] text-[#e0e0e0] hover:border-green-500"}`}
                disabled={disabled}
                aria-haspopup="listbox"
                aria-expanded={aberto}
            >
                {/* MOSTRA O HORARIO SELECIONADO OU UMA MENSAGEM PADRAO */}
                {horarioSelecionado || (disabled ? "SELECIONE SALA E DATA" : "SELECIONE UM HORARIO")}
            </button>

            {/* LISTA DE HORARIOS APARECE SOMENTE SE O DROPDOWN ESTIVER ABERTO */}
            {aberto && (
                <ul
                    role="listbox"
                    className="absolute z-20 mt-1 w-full max-h-48 overflow-auto rounded-md bg-[#2a2a40] shadow-lg ring-1 ring-black ring-opacity-5"
                >
                    {/* MAPEIA CADA HORARIO PARA UM ITEM DA LISTA */}
                    {horariosFiltrados.map((h) => {
                        const disponivel = horarioDisponivel(h); // VERIFICA SE O HORARIO ESTA DISPONIVEL
                        return (
                            <li
                                key={h}
                                role="option"
                                // SOMENTE PERMITE CLICAR SE O HORARIO ESTIVER DISPONIVEL
                                onClick={() => disponivel && (setHorarioSelecionado(h), setAberto(false))}
                                className={`cursor-pointer px-4 py-2 select-none ${disponivel
                                    ? "text-green-400 hover:bg-green-700"
                                    : "text-red-500 cursor-not-allowed opacity-60 bg-[#2a2a40]"
                                    }`}
                                aria-disabled={!disponivel}
                                style={{
                                    backgroundColor: !disponivel ? "#2a2a40" : undefined,
                                    color: !disponivel ? "#ff5555" : undefined,
                                }}
                            >
                                {h} {!disponivel && " (Indisponível)"}
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default HorarioDropdown;
