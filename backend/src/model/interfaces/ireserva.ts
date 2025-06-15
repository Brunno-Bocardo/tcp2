import { Sala } from "./ISala";
import { User } from "./IUser";

export interface IReserva {
  sala: Sala;
  usuario: User;
  dia: string;
  horario: string;
  data_da_solicitacao: string;
}
