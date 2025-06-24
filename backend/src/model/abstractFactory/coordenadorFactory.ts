import { User } from "../interfaces/IUser";
import { UserFactory } from "./iuserFactory";
import { Coordenador } from "../classes/coordenador";

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
