import { Auditorio } from "../../model/classes/auditorio";
import { Sala } from "../../model/interfaces/ISala";
import { CriadorSala } from "./CriadorSala";

export class CriadorAuditorio extends CriadorSala {
  public criarSala(numeroSala: number, capacidadeMaxima: number): Sala {
    return new Auditorio(undefined, numeroSala, capacidadeMaxima);
  }
}
