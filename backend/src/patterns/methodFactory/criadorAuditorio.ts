
import { Auditorio } from "../../model/classes/auditorio";
import { Sala } from "../../model/interfaces/ISala";
import { CriadorSala } from "./CriadorSala";

export class CriadorAuditorio extends CriadorSala {
  public criarSala(salaId:number, numeroSala: number, capacidadeMaxima: number): Sala {
    return new Auditorio(salaId, numeroSala, capacidadeMaxima);
  }
}
