
import { Auditorio } from "../../model/classes/auditorio";
import { ISala } from "../../model/interfaces/ISala";
import { CriadorSala } from "./CriadorSala";

export class CriadorAuditorio extends CriadorSala {
  public criarSala(salaId:number, numeroSala: number, capacidadeMaxima: number): ISala {
    return new Auditorio(salaId, numeroSala, capacidadeMaxima);
  }
}
