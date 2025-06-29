export class SalaRequestDto {
    numero:number;
    capacidadeMaxima:number;
    tipo: String;

    constructor(numero?: number, capacidadeMaxima?: number, tipo?: String) {
        this.numero = numero || 0;
        this.capacidadeMaxima = capacidadeMaxima || 0;
        this.tipo = tipo || "";
    }
}