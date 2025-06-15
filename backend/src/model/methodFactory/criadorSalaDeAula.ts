import { SalaDeAula } from "../classes/salaDeAula";
import { Sala } from "../interfaces/sala";
import { CriadorSala } from "./criadorSala";

export class CriadorSalaDeAula extends CriadorSala {
  public criarSala(numeroSala: number, capacidadeMaxima: number): Sala {
    return new SalaDeAula(undefined, numeroSala, capacidadeMaxima);
  }
}
