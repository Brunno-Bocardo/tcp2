import { Sala } from "../interfaces/sala";

export abstract class Criador {
    public abstract factoryMethod():Sala;
}