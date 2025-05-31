export class User {
    id: number;
    nome: string;
    email: string;
    curso: string;
    senha: string;
    tipo: string;

    constructor(id?:number, nome?:string, email?:string, curso?:string, senha?:string, tipo?:string) {
        this.id = id || 0;
        this.nome = nome || '';
        this.email = email || '';
        this.curso = curso || '';
        this.senha = senha || ''; 
        this.tipo = tipo || '';
    }
}