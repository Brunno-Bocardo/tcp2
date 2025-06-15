import { User } from "./user";


export class Coordenador extends User {
    tipo: string = 'Coordenador';
    
    constructor(
        id?: number,
        nome?: string,
        email?: string,
        curso?: string,
        senha?: string,
    ) {
        super(id, nome, email, curso, senha)
    }
}