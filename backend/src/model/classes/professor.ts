import { User } from "./user";

export class Professor extends User {
    tipo: string = 'Professor';

    constructor(
        id?: number,
        nome?: string,
        email?: string,
        curso?: string,
        senha?: string
    ) {
        super(id, nome, email, curso, senha);
    }
}