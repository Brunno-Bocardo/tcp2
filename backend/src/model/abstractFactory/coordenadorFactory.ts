import { Coordenador } from "../classes/coordenador";
import { User } from "../interfaces/user";
import { UserFactory } from "../abstractFactory/userFactory";

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
