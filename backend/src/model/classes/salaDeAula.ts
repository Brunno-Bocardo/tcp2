import { Sala } from "../interfaces/ISala";

export class SalaDeAula implements Sala {
  id: number;
  numero: number;
  capacidadeMaxima: number;
  tipo: string = "Sala de Aula";

  constructor(id: number, numeroSala: number, capacidadeMaxima: number) {
    this.id = id || 0;
    this.numero = numeroSala || 0;
    this.capacidadeMaxima = capacidadeMaxima || 0;
  }
}
