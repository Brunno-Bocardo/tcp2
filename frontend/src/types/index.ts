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
    userId: number;
    salaId: number;
    dataDaSolicitacao: string;
    dataDaReserva: string;
    horarioInicio: string;
    horarioFim: string;
};

export type Resposta = {
    status: string;
    xml_enviado: string;
};