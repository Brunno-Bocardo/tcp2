import { Sala } from "./sala";
import { User } from "../classes/user";

export interface IReserva {
    sala: Sala;
    horario: string;
    usuario: User;
}

