import { User } from "../../model/interfaces/IUser";
import { UserFactory } from "./IUserFactory";
import { Coordenador } from "../../model/classes/coordenador";

export class CoordenadorFactory implements UserFactory {
  criarUsuario(
    nome: string,
    email: string,
    curso: string,
    senha: string,
    id?: number,
  ): User {
    return new Coordenador(id, nome, email, curso, senha);
  }
}
