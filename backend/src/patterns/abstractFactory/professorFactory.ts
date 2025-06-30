import { User } from "../../model/interfaces/IUser";
import { UserFactory } from "./IUserFactory";
import { Professor } from "../../model/classes/Professor";

export class ProfessorFactory implements UserFactory {
  criarUsuario(
    nome: string,
    email: string,
    curso: string,
    senha: string,
    id?: number,
  ): User {
    return new Professor(id, nome, email, curso, senha);
  }
}
