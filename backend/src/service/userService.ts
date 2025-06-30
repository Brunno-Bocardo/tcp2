import { CoordenadorFactory } from "../patterns/abstractFactory/coordenadorFactory";
import { ProfessorFactory } from "../patterns/abstractFactory/professorFactory";
import { User } from "../model/interfaces/IUser";
import { UserRepository } from "../repository/userRepository";

export class UserService {
  private usuarioRepository = UserRepository.getInstance();
  private coordenadorFabrica = new CoordenadorFactory();
  private professorFabrica = new ProfessorFactory();

  async cadastrarUsuario(userData: any): Promise<User> {
    const { nome, email, curso, senha, tipo } = userData;

    // Aplicando abstract factory
    const usuario =
      tipo == "Coordenador"
        ? this.coordenadorFabrica.criarUsuario(nome, email, curso, senha)
        : this.professorFabrica.criarUsuario(nome, email, curso, senha);

    const novoUser = await this.usuarioRepository.inserirUsuario(usuario);
    console.log("Cadastrado: ", novoUser);
    return new Promise<User>((resolve) => {
      resolve(novoUser);
    });
  }

  async userLogin(email: string, senha: string): Promise<User> {

    console.log(email);
    
    const usuario = await this.usuarioRepository.filtraUsuarioByEmail(email);

    if (!usuario) {
      throw new Error("Usuário não encontrado");
    }
    if (usuario.senha !== senha) {
      throw new Error("Senha incorreta");
    }

    return new Promise<User>((resolve) => {
      resolve(usuario);
    });
  }

  async filtrarUsers(): Promise<User[]> {
    const users = await this.usuarioRepository.listarUsuarios();
    console.log("Usuários listados com sucesso");
    return new Promise<User[]>((resolve) => {
      resolve(users)
    })
  }
}
