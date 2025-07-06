import { SalaDeAula } from "../../model/classes/salaDeAula";
import { ISala } from "../../model/interfaces/ISala";
import { CriadorSala } from "./CriadorSala";

export class CriadorSalaDeAula extends CriadorSala {
  public criarSala(salaId: number, numeroSala: number, capacidadeMaxima: number): ISala {
    return new SalaDeAula(salaId, numeroSala, capacidadeMaxima);
  }
}
