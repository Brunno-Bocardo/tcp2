import { SalaDeAula } from "../classes/SalaDeAula";
import { Sala } from "../interfaces/ISala";
import { CriadorSala } from "./CriadorSala";

export class CriadorSalaDeAula extends CriadorSala {
  public criarSala(numeroSala: number, capacidadeMaxima: number): Sala {
    return new SalaDeAula(undefined, numeroSala, capacidadeMaxima);
  }
}
