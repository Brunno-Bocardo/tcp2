import { ISala } from "../../model/interfaces/ISala";

export abstract class CriadorSala {
  public abstract criarSala(salaId: number, numeroSala: number, capacidadeMaxima: number): ISala; //factory method
}
