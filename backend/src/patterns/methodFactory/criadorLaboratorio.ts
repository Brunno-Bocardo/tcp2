import { Laboratorio } from "../../model/classes/laboratorio";
import { Sala } from "../../model/interfaces/ISala";
import { CriadorSala } from "./CriadorSala";

export class CriadorLaboratorio extends CriadorSala {
  criarSala(salaId: number, numeroSala: number, capacidadeMaxima: number): Sala {
    return new Laboratorio(salaId, numeroSala, capacidadeMaxima);
  }
}
