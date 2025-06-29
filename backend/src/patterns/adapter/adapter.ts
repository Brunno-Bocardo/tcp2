import { js2xml, xml2js } from "xml-js";
import { IReserva } from "../../model/interfaces/IReserva";
import { Sala } from "../../model/interfaces/ISala";

// ADAPTER QUE TRANSFORMA O JSON DA RESERVA EM XML PRO LEGADO
export function jsonParaXmlAdapter(json: IReserva): string {
  // TRANSFORMA O JSON EM XML, DENTRO DE UMA TAG <reserva>
  return js2xml({ reserva: json }, { compact: true, spaces: 4 });
}

