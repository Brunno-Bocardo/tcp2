import { Sala } from "./ISala";
import { User } from "./IUser";

export interface ireserva {
  sala: Sala;
  usuario: User;
  dataSolicitacao: string;
  dia: string;
  horarioInicio: string;
  horarioFim: string;
}
