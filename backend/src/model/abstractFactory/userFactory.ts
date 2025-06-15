import { User } from "../interfaces/user";

export interface UserFactory {
  criarUsuario(nome: string, email: string, curso: string, senha: string): User;
}
