import { ISala } from "./ISala";
import { User } from "./IUser";

export interface ireserva {
  sala: ISala;
  usuario: User;
  dataSolicitacao: string;
  dia: string;
  horarioInicio: string;
  horarioFim: string;
}
