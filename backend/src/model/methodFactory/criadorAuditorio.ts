import { Auditorio } from "../classes/Auditorio";
import { Sala } from "../interfaces/ISala";
import { CriadorSala } from "./CriadorSala";

export class CriadorAuditorio extends CriadorSala {
  public criarSala(numeroSala: number, capacidadeMaxima: number): Sala {
    return new Auditorio(undefined, numeroSala, capacidadeMaxima);
  }
}
