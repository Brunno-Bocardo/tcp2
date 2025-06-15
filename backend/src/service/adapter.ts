import { js2xml } from "xml-js";
import { IReserva } from "../model/interfaces/IReserva";

// ADAPTER QUE TRANSFORMA O JSON DA RESERVA EM XML PRO LEGADO
export function jsonParaXmlAdapter(json: IReserva): string {
  // TRANSFORMA O JSON EM XML, DENTRO DE UMA TAG <reserva>
  return js2xml({ reserva: json }, { compact: true, spaces: 4 });
}
