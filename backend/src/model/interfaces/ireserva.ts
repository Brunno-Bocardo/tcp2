import { Sala } from "./ISala";
import { User } from "./IUser";

export interface IReserva {
  sala: Sala;
  usuario: User;
  dataSolicitacao: string;
  dia: string;
  horarioInicio: string;
  horarioFim: string;
}
