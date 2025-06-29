'use client';
import React, { useState, useEffect, useRef } from "react";

interface ReservasProps {
  nomeUsuario?: string; //PRA PEGAR O NOME DO USUARIO E USAR
}
// INTERFACE SALA
type Sala = {
  id: number;
  numero: number;
  capacidadeMaxima: number; // No backend é capacidade_maxima
  tipo: string; // string genérico para aceitar qualquer valor do backend
};

type User = {
  id: number;
  nome: string;
  email: string;
  curso: string;
  senha: string;
  tipo: string;
};

// INTERFACE RESERVA - OBJETO TRANSACIONAL QUE ENVIA OS DADOS PARA O BACKEND
type Reserva = {
  userId: number;
  salaId: number;
  dataDaSolicitacao: string;
  dataDaReserva: string;
  horarioInicio: string;
  horarioFim: string;
};

// RESPOSTA DO BACKEND - RECEBE O STATUS E O XML QUE FOI ENVIADO
type Resposta = {
  status: string;
  xml_enviado: string;          // AQUI RECEBEMOS O XML GERADO PELO ADAPTER NO BACKEND
};

interface HorarioDropdownProps {
  horarios: string[];
  horarioSelecionado: string;
  setHorarioSelecionado: (h: string) => void;
  horarioDisponivel: (h: string) => boolean;
  label: string;
  filtroMinimo?: string;
  disabled?: boolean;
}
// COMPONENTE DROPDOWN DE HORARIOS - PODE SER REUSADO EM QUALQUER LUGAR!
const HorarioDropdown: React.FC<HorarioDropdownProps> = ({
  horarios,
  horarioSelecionado,
  setHorarioSelecionado,
  horarioDisponivel,
  label,
  filtroMinimo,
  disabled = false,
}) => {
  const [aberto, setAberto] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ESCUTA CLIQUE FORA DO DROPDOWN PRA FECHAR
  useEffect(() => {
    const handleClickFora = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setAberto(false);
      }
    };
    document.addEventListener("mousedown", handleClickFora);
    return () => document.removeEventListener("mousedown", handleClickFora);
  }, []);

  // SE DISABLED, FECHA O DROPDOWN AUTOMATICO
  useEffect(() => {
    if (disabled) setAberto(false);
  }, [disabled]);

  // FILTRA HORARIOS QUE SAO MAIORES QUE O MINIMO, SE TIVER
  const horariosFiltrados = filtroMinimo
    ? horarios.filter((h) => h > filtroMinimo)
    : horarios;

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <label className={`block mb-2 text-sm font-semibold ${disabled ? "opacity-50" : ""}`}>
        {label}
      </label>
      <button
        type="button"
        onClick={() => !disabled && setAberto((a) => !a)}
        className={`w-full text-left p-3 rounded-md border border-gray-600 transition-colors duration-200
          ${disabled ? "bg-gray-700 text-gray-500 cursor-not-allowed" : "bg-[#44475a] text-[#e0e0e0] hover:border-green-500"}`}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={aberto}
      >
        {horarioSelecionado || (disabled ? "SELECIONE SALA E DATA" : "SELECIONE UM HORARIO")}
      </button>

      {aberto && (
        <ul
          role="listbox"
          className="absolute z-20 mt-1 w-full max-h-48 overflow-auto rounded-md bg-[#2a2a40] shadow-lg ring-1 ring-black ring-opacity-5"
        >
          {horariosFiltrados.map((h) => {
            const disponivel = horarioDisponivel(h);
            return (
              <li
                key={h}
                role="option"
                onClick={() => disponivel && (setHorarioSelecionado(h), setAberto(false))}
                className={`cursor-pointer px-4 py-2 select-none ${disponivel
                  ? "text-green-400 hover:bg-green-700"
                  : "text-red-500 cursor-not-allowed opacity-60"
                  }`}
                aria-disabled={!disponivel}
              >
                {h}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

const Reservas: React.FC<ReservasProps> = ({ nomeUsuario }) => {
  // Substituir os arrays fixos por estados que serão carregados do backend
  const [salas, setSalas] = useState<Sala[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  
  // HORARIOS FIXOS DISPONIVEIS PARA RESERVA
  const horariosDisponiveis = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

  // ESTADOS PRA CONTROLAR O FORMULARIO E RESERVAS
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [respostas, setRespostas] = useState<Resposta[]>([]);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<number | null>(null);
  const [salaSelecionada, setSalaSelecionada] = useState<number | null>(null);
  const [dataDaReserva, setDataReserva] = useState("");
  const [horarioInicio, setHorarioInicio] = useState("");
  const [horarioFim, setHorarioFim] = useState("");
  const [loading, setLoading] = useState(false);
  const [carregandoDados, setCarregandoDados] = useState(true);
  const [reservasExistentes, setReservasExistentes] = useState<Reserva[]>([]);

  // Efeito para carregar os dados do backend quando o componente montar
  useEffect(() => {
    async function carregarDados() {
      setCarregandoDados(true);
      try {
        // Carregar salas do backend
        const resSalas = await fetch("http://localhost:5000/api/salas");
        if (resSalas.ok) {
          const dadosSalas = await resSalas.json();
          setSalas(dadosSalas);
        } else {
          console.error("Erro ao carregar salas");
        }
        
        // Carregar usuários do backend
        const resUsers = await fetch("http://localhost:5000/api/usuarios");
        if (resUsers.ok) {
          const dadosUsers = await resUsers.json();
          setUsers(dadosUsers);
        } else {
          console.error("Erro ao carregar usuários");
        }
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        setCarregandoDados(false);
      }
    }
    
    carregarDados();
  }, []);

  // Função para buscar reservas existentes
  const buscarReservasExistentes = async (salaId: number, data: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/reservas/${salaId}/${data}`);
      if (response.ok) {
        const reservas = await response.json();
        setReservasExistentes(reservas);
      }
    } catch (error) {
      console.error("Erro ao buscar reservas existentes:", error);
    }
  };

  // Efeito para buscar reservas quando a sala ou data mudar
  useEffect(() => {
    if (salaSelecionada && dataDaReserva) {
      buscarReservasExistentes(salaSelecionada, dataDaReserva);
    }
  }, [salaSelecionada, dataDaReserva]);

  // Função para verificar horários ocupados
  const horariosOcupadosParaSalaData = (): string[] => {
    if (!salaSelecionada || !dataDaReserva) return [];
    
    // Combinar reservas locais e existentes do banco
    const todasReservas = [
      ...reservas.filter(
        (r) => r.salaId === salaSelecionada && r.dataDaReserva === dataDaReserva
      ),
      ...reservasExistentes.filter(
        (r) => r.salaId === salaSelecionada && r.dataDaReserva === dataDaReserva
      )
    ];
    
    const ocupados: string[] = [];
    todasReservas.forEach((r) => {
      const inicioIndex = horariosDisponiveis.indexOf(r.horarioInicio);
      const fimIndex = horariosDisponiveis.indexOf(r.horarioFim);
      if (inicioIndex !== -1 && fimIndex !== -1) {
        // ADICIONA TODOS OS HORARIOS ENTRE INICIO E FIM COMO OCUPADOS
        for (let i = inicioIndex; i < fimIndex; i++) {
          ocupados.push(horariosDisponiveis[i]);
        }
      }
    });
    return ocupados;
  };

  const horariosOcupados = horariosOcupadosParaSalaData();
  const estaDisponivel = (h: string) => !horariosOcupados.includes(h);

  // SE TROCAR SALA OU DATA, LIMPA OS HORARIOS

  useEffect(() => {
    setHorarioInicio("");
    setHorarioFim("");
  }, [salaSelecionada, dataDaReserva]);

  const adicionarReserva = () => {
    if (!salaSelecionada || !usuarioSelecionado || !dataDaReserva || !horarioInicio || !horarioFim) {
      alert("PREENCHA TODOS OS CAMPOS");
      return;
    }
    if (horarioFim <= horarioInicio) {
      alert("HORARIO FINAL TEM QUE SER MAIOR QUE O INICIAL");
      return;
    }
    // CHECA SE TEM ALGUM HORARIO NO MEIO JA OCUPADO

    const inicioIndex = horariosDisponiveis.indexOf(horarioInicio);
    const fimIndex = horariosDisponiveis.indexOf(horarioFim);
    for (let i = inicioIndex; i < fimIndex; i++) {
      if (horariosOcupados.includes(horariosDisponiveis[i])) {
        alert(`HORARIO ${horariosDisponiveis[i]} JA ESTA OCUPADO`);
        return;
      }
    }

    // PEGA DATA DE HOJE PRA GUARDAR A DATA DE SOLICITACAO

    const hoje = new Date().toISOString().split("T")[0];
    setReservas((prev) => [
      ...prev,
      {
        userId: usuarioSelecionado,
        salaId: salaSelecionada,
        dataDaSolicitacao: hoje,
        dataDaReserva,
        horarioInicio,
        horarioFim,
      },
    ]);
    setSalaSelecionada(null);
    setUsuarioSelecionado(null);
    setDataReserva("");
    setHorarioInicio("");
    setHorarioFim("");
  };

  // Modificar a função enviarTodas para mostrar os resultados e limpar o estado após envio
  const enviarTodas = async () => {
    setLoading(true);
    setRespostas([]);

    const resultados: Resposta[] = [];

    for (const reserva of reservas) {
      try {
        const res = await fetch("http://localhost:5000/api/reserva", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reserva),
        });
        const data = await res.json();
        resultados.push(data);
      } catch (error) {
        console.error("ERRO AO ENVIAR:", error);
        resultados.push({
          status: "erro",
          xml_enviado: "<erro>Falha na comunicação com o servidor</erro>"
        });
      }
    }

    setRespostas(resultados);
    
    // Se todas as reservas forem bem-sucedidas, limpar o estado
    if (resultados.every(r => r.status === "sucesso")) {
      // Aguardar um pouco para o usuário ver a resposta
      setTimeout(() => {
        setReservas([]);
      }, 3000);
    }
    
    setLoading(false);
  };

  const buscarSala = (id: number) => salas.find((s) => s.id === id);
  const buscarUser = (id: number) => users.find((u) => u.id === id);

  // Mostrar um spinner ou mensagem enquanto os dados estão carregando
  if (carregandoDados) {
    return (
      <div className="min-h-screen bg-[#1e1e2f] text-[#e0e0e0] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#80cbc4] mx-auto mb-4"></div>
          <p className="text-xl">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#1e1e2f] text-[#e0e0e0] p-8 font-sans max-w-7xl mx-auto flex flex-col gap-8">
      <header className="flex flex-col items-center gap-2">
        <h1 className="text-5xl font-extrabold tracking-wide">SISTEMA DE RESERVAS</h1>
        {nomeUsuario && (
          <p className="text-lg text-[#80cbc4] tracking-wide select-none">
            Bem-vindo, <span className="font-semibold">{nomeUsuario}</span>!
          </p>
        )}
        {/* Coloquei o botão aqui apenas de modo provisório */}
        <a href="#" className="bg-[#80cbc4] hover:bg-[#80cbd9] text-[#1e1e2f] font-bold py-3 px-12 rounded-xl shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed">
          Logs
        </a>
      </header>

      {/* FORMULARIO DE RESERVAS */}
      <section className="bg-[#2a2a40] rounded-xl p-8 shadow-lg max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 border-b border-[#80cbc4] pb-2">Nova Reserva</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            adicionarReserva();
          }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
        >
          <div>
            <label className="block mb-2 text-sm font-semibold">Usuário</label>
            <select
              value={usuarioSelecionado || ""}
              onChange={(e) => setUsuarioSelecionado(Number(e.target.value))}
              className="w-full p-3 rounded-md bg-[#44475a] border border-gray-600 text-[#e0e0e0] focus:outline-none focus:border-[#80cbc4] transition"
              required
            >
              <option value="" disabled>
                Selecione um usuário
              </option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nome} ({u.tipo})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold">Sala</label>
            <select
              value={salaSelecionada || ""}
              onChange={(e) => setSalaSelecionada(Number(e.target.value))}
              className="w-full p-3 rounded-md bg-[#44475a] border border-gray-600 text-[#e0e0e0] focus:outline-none focus:border-[#80cbc4] transition"
              required
            >
              <option value="" disabled>
                Selecione uma sala
              </option>
              {salas.map((s) => (
                <option key={s.id} value={s.id}>
                  Sala {s.numero} ({s.tipo}, max {s.capacidadeMaxima})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-sm font-semibold">Data da Reserva</label>
            <input
              type="date"
              value={dataDaReserva}
              onChange={(e) => setDataReserva(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="w-full p-3 rounded-md bg-[#44475a] border border-gray-600 text-[#e0e0e0] focus:outline-none focus:border-[#80cbc4] transition"
              required
            />
          </div>

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

          <div className="sm:col-span-2 flex justify-center">
            <button
              type="submit"
              disabled={
                !salaSelecionada || !usuarioSelecionado || !dataDaReserva || !horarioInicio || !horarioFim
              }
              className="bg-[#80cbc4] hover:bg-[#80cbd9] text-[#1e1e2f] font-bold py-3 px-12 rounded-xl shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Adicionar Reserva
            </button>
          </div>
        </form>
      </section>

      {/* LISTA DE RESERVAS */}
      <section className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-semibold mb-4 border-b border-[#80cbc4] pb-2">Reservas Pendentes</h2>
        {reservas.length === 0 ? (
          <p className="text-center text-gray-400 italic">Nenhuma reserva feita ainda.</p>
        ) : (
          <ul className="space-y-4">
            {reservas.map((r, i) => {
              const sala = buscarSala(r.salaId);
              const user = buscarUser(r.userId);
              return (
                <li
                  key={i}
                  className="bg-[#2a2a40] p-4 rounded-lg shadow-md border border-gray-700 hover:border-blue-400 transition"
                >
                  <p>
                    <span className="font-semibold text-[#80cbc4]">Usuário:</span> {user?.nome || "Desconhecido"} ({user?.tipo})
                  </p>
                  <p>
                    <span className="font-semibold text-[#80cbc4]">Sala:</span> {sala?.numero} ({sala?.tipo})
                  </p>
                  <p>
                    <span className="font-semibold text-[#80cbc4]">Data:</span> {r.dataDaReserva}
                  </p>
                  <p>
                    <span className="font-semibold text-[#80cbc4]">Horário:</span> {r.horarioInicio} - {r.horarioFim}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* BOTAO PARA ENVIAR TODAS AS RESERVAS */}
      <section className="max-w-4xl mx-auto flex justify-center mt-8">
        <button
          onClick={enviarTodas}
          disabled={reservas.length === 0 || loading}
          className="bg-[#80cbc4] hover:bg-[#80cbd9] text-[#1e1e2f] font-bold py-3 px-12 rounded-xl shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Enviando..." : "Enviar Todas as Reservas"}
        </button>
      </section>

      {/* RESPOSTAS DO SERVIDOR */}
      {respostas.length > 0 && (
        <section className="max-w-4xl mx-auto mt-6 bg-[#222238] rounded-lg p-4 overflow-auto max-h-80">
          <h3 className="text-lg font-semibold mb-2">
            Resultado do processamento das reservas:
          </h3>
          <div className="space-y-4">
            {respostas.map((resp, i) => {
              const isSuccess = resp.status === "sucesso";
              return (
                <div 
                  key={i}
                  className={`p-4 rounded-lg border ${
                    isSuccess 
                      ? "bg-[#1e3b2f] border-green-500 text-green-200" 
                      : "bg-[#3b1e1e] border-red-500 text-red-200"
                  }`}
                >
                  <div className="flex items-center mb-2">
                    <div className={`w-4 h-4 rounded-full mr-2 ${isSuccess ? "bg-green-500" : "bg-red-500"}`}></div>
                    <span className="font-semibold">
                      {isSuccess ? "Reserva realizada com sucesso!" : "Falha ao processar reserva"}
                    </span>
                  </div>
                  <div className="mt-2">
                    <details className="cursor-pointer">
                      <summary className="text-sm font-medium">Ver detalhes do XML</summary>
                      <pre className="whitespace-pre-wrap bg-[#1b1b30] p-3 mt-2 rounded text-xs">
                        {resp.xml_enviado}
                      </pre>
                    </details>
                  </div>
                </div>
              );
            })}
          </div>
          {respostas.every(r => r.status === "sucesso") && (
            <div className="mt-4 p-3 bg-green-800 bg-opacity-20 border border-green-500 rounded-lg text-center">
              <p className="text-green-200">
                Todas as reservas foram processadas com sucesso!
              </p>
            </div>
          )}
        </section>
      )}
    </main>
  );
};

export default Reservas;
