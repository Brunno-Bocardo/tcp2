import { SalaDeAula } from "../../model/classes/salaDeAula";
import { Sala } from "../../model/interfaces/ISala";
import { CriadorSala } from "./CriadorSala";

export class CriadorSalaDeAula extends CriadorSala {
  public criarSala(numeroSala: number, capacidadeMaxima: number): Sala {
    return new SalaDeAula(undefined, numeroSala, capacidadeMaxima);
  }
}
