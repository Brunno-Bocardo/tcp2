import { User } from "../../model/interfaces/IUser";
import { UserFactory } from "./IUserFactory";
import { Coordenador } from "../../model/classes/Coordenador";

export class CoordenadorFactory implements UserFactory {
  criarUsuario(
    nome: string,
    email: string,
    curso: string,
    senha: string
  ): User {
    return new Coordenador(undefined, nome, email, curso, senha);
  }
}
