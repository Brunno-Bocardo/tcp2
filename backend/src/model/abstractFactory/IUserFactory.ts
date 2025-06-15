import { User } from "../interfaces/IUser";

export interface UserFactory {
  criarUsuario(nome: string, email: string, curso: string, senha: string): User;
}
