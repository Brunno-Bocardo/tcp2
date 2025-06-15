export interface Sala {
    id:number;
    numero:number;
    capacidadeMaxima:number;
    tipo: String;
    reservar():void;
}