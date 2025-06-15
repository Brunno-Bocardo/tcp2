import { User } from "../interfaces/IUser";

export class Coordenador implements User {
  id: number;
  nome: string;
  email: string;
  curso: string;
  senha: string;
  tipo: string = "Coordenador";

  constructor(
    id?: number,
    nome?: string,
    email?: string,
    curso?: string,
    senha?: string
  ) {
    this.id = id || 0;
    this.nome = nome || "";
    this.email = email || "";
    this.curso = curso || "";
    this.senha = senha || "";
  }
}
