import { Sala } from "./sala";
import { User } from "../classes/user";

export interface IReserva {
    sala: Sala;
    usuario: User;
    dia: string;
    horario: string;
    data_da_solicitacao: string;
}

