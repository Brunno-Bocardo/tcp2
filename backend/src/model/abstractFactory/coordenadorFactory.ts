import { User } from "../interfaces/IUser";
import { UserFactory } from "./IUserFactory";
import { Coordenador } from "../classes/Coordenador";

export class CoordenadorFactory implements UserFactory {
  criarUsuario(
    nome: string,
    email: string,
    curso: string,
    senha: string
  ): User {
    return new Coordenador();
  }
}
