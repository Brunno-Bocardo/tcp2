import { Sala } from "../interfaces/sala";
import { Criador } from "./criador";
import { SalaDeAula } from "./salaDeAula";

export class CriadorSalaDeAula extends Criador {
    public factoryMethod(): Sala {
        return new SalaDeAula();
    }
}