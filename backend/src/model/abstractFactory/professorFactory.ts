import { Professor } from "../classes/professor";
import { User } from "../interfaces/IUser";
import { UserFactory } from "./iuserFactory";

export class ProfessorFactory implements UserFactory {
  criarUsuario(
    nome: string,
    email: string,
    curso: string,
    senha: string
  ): User {
    return new Professor(undefined, nome, email, curso, senha);
  }
}
