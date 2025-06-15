import { Sala } from "../model/interfaces/sala";

export abstract class CriadorSala {
  public abstract criarSala(numeroSala:number, capacidadeMaxima:number): Sala; //factory method
}
