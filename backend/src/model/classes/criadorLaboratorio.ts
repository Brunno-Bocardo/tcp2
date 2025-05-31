import { Sala } from "../interfaces/sala";
import { Criador } from "./criador";
import { Laboratorio } from "./laboratorio";

export class CriadorLaboratorio implements Criador {
    public factoryMethod(): Sala {
        return new Laboratorio();
    }
}