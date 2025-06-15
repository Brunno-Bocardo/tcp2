import { Laboratorio } from "../classes/Laboratorio";
import { Sala } from "../interfaces/ISala";
import { CriadorSala } from "./CriadorSala";

export class CriadorLaboratorio extends CriadorSala {
  criarSala(numeroSala: number, capacidadeMaxima: number): Sala {
    return new Laboratorio(undefined, numeroSala, capacidadeMaxima);
  }
}
