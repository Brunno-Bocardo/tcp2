import { Auditorio } from "../classes/auditorio";
import { Sala } from "../interfaces/ISala";
import { CriadorSala } from "./criadorSala";

export class CriadorAuditorio extends CriadorSala {
  public criarSala(numeroSala: number, capacidadeMaxima: number): Sala {
    return new Auditorio(undefined, numeroSala, capacidadeMaxima);
  }
}
