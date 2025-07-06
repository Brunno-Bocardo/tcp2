import { Laboratorio } from "../../model/classes/laboratorio";
import { ISala } from "../../model/interfaces/ISala";
import { CriadorSala } from "./CriadorSala";

export class CriadorLaboratorio extends CriadorSala {
  criarSala(salaId: number, numeroSala: number, capacidadeMaxima: number): ISala {
    return new Laboratorio(salaId, numeroSala, capacidadeMaxima);
  }
}
