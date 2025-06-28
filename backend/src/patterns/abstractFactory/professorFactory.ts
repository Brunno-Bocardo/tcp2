import { Professor } from "../../model/classes/professor";
import { User } from "../../model/interfaces/IUser";
import { UserFactory } from "./IUserFactory";

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
