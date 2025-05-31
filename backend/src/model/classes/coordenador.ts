import { User } from "./user";


export class Coordenador extends User {
    
    constructor(
        id?: number,
        nome?: string,
        email?: string,
        curso?: string,
        senha?: string,
        tipo?: string
    ) {
        super(id, nome, email, curso, senha, tipo)
    }
}