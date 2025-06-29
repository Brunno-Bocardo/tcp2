import { SalaDeAula } from "../../model/classes/SalaDeAula";
import { Sala } from "../../model/interfaces/ISala";
import { CriadorSala } from "./CriadorSala";

export class CriadorSalaDeAula extends CriadorSala {
  public criarSala(salaId: number, numeroSala: number, capacidadeMaxima: number): Sala {
    return new SalaDeAula(salaId, numeroSala, capacidadeMaxima);
  }
}
