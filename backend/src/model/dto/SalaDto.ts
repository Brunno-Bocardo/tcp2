export class SalaDto {
    salaId: number;
    numero:number;
    capacidadeMaxima:number;
    tipo: String;

    constructor(id?: number, numero?: number, capacidadeMaxima?: number, tipo?: String) {
        this.salaId = id || 0;
        this.numero = numero || 0;
        this.capacidadeMaxima = capacidadeMaxima || 0;
        this.tipo = tipo || "";
    }

}