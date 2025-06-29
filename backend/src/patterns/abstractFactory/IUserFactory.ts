import { User } from "../../model/interfaces/IUser";

export interface UserFactory {
  criarUsuario(nome: string, email: string, curso: string, senha: string): User;
}
