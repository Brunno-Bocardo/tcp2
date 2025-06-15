import { Sala } from "../interfaces/ISala";

export abstract class CriadorSala {
  public abstract criarSala(numeroSala: number, capacidadeMaxima: number): Sala; //factory method
}
