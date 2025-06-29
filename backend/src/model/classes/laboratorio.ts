import { Sala } from "../interfaces/ISala";

export class Laboratorio implements Sala {
  id: number;
  numero: number;
  capacidadeMaxima: number;
  tipo: string = "Laboratorio";

  constructor(id: number, numeroSala: number, capacidadeMaxima: number) {
    this.id = id || 0;
    this.numero = numeroSala || 0;
    this.capacidadeMaxima = capacidadeMaxima || 0;
  }
}
