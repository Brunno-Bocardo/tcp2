import { Sala } from "../interfaces/ISala";

export class Auditorio implements Sala {
  id: number;
  numero: number;
  capacidadeMaxima: number;
  tipo: string = "Auditório";

  constructor(id: number, numeroSala: number, capacidadeMaxima: number) {
    this.id = id || 0;
    this.numero = numeroSala || 0;
    this.capacidadeMaxima = capacidadeMaxima || 0;
  }
}
