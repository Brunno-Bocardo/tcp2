import { Sala } from "../interfaces/sala";
import { Auditorio } from "./auditorio";
import { Criador } from "./criador";

export class CriadorAuditorio extends Criador {
    public factoryMethod(): Sala {
        return new Auditorio();
    }
}