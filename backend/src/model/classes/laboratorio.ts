import { Sala } from "../interfaces/sala";

export class Laboratorio implements Sala {
    id:number;
    numero:number;
    capacidadeMaxima: number;

    constructor(id?:number, numeroSala?:number, capacidadeMaxima?:number){
        this.id = id || 0;
        this.numero = numeroSala || 0;
        this.capacidadeMaxima = capacidadeMaxima || 0;
    }
}