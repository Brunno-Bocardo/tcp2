
import { Laboratorio } from "../model/classes/laboratorio";
import { Sala } from "../model/interfaces/sala";
import { CriadorSala } from "./criadorSala";

export class CriadorLaboratorio extends CriadorSala {
  criarSala(numeroSala:number, capacidadeMaxima:number): Sala {
    return new Laboratorio(undefined, numeroSala, capacidadeMaxima);
  }
}
