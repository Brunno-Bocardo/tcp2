export type Sala = {
    id: number;
    numero: number;
    capacidadeMaxima: number;
    tipo: "Auditorio" | "Laboratorio" | "Sala de Aula";
};

export type User = {
    id: number;
    nome: string;
    email: string;
    curso: string;
    tipo: string;
};

export type Reserva = {
    id?: number;
    solicitanteId: number;
    userId: number;
    salaId: number;
    dataSolicitacao: string;
    dataReserva: string;
    horarioInicio: string;
    horarioFim: string;
};

export type Resposta = {
    status: string;
    xml_enviado: string;
};

export interface ReservaBackend {
    usuario_id: number;
    sala_id: number;
    data: string;
    hora_inicio: string;
    hora_fim: string;
    descricao?: string;
}