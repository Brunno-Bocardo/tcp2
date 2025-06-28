import { Laboratorio } from "../../model/classes/Laboratorio";
import { Sala } from "../../model/interfaces/ISala";
import { CriadorSala } from "./CriadorSala";

export class CriadorLaboratorio extends CriadorSala {
  criarSala(numeroSala: number, capacidadeMaxima: number): Sala {
    return new Laboratorio(undefined, numeroSala, capacidadeMaxima);
  }
}
