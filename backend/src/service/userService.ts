import { CoordenadorFactory } from "../model/abstractFactory/CoordenadorFactory";
import { ProfessorFactory } from "../model/abstractFactory/ProfessorFactory";
import { Coordenador } from "../model/classes/Coordenador";
import { Professor } from "../model/classes/Professor";
import { User } from "../model/interfaces/IUser";
import { UserRepository } from "../repository/userRepository";

export class UserService {
  private UsuarioRepository = UserRepository.getInstance();
  private coordenadorFabrica = new CoordenadorFactory();
  private professorFabrica = new ProfessorFactory();

  async cadastrarUsuario(userData: any): Promise<User> {
    const { nome, email, curso, senha, tipo } = userData;

    // Aplicando abstract factory
    const usuario =
      tipo == "Coordenador"
        ? this.coordenadorFabrica.criarUsuario(nome, email, curso, senha)
        : this.professorFabrica.criarUsuario(nome, email, curso, senha);

    const novoUser = await this.UsuarioRepository.inserirUsuario(usuario);
    console.log("Cadastrado: ", novoUser);
    return new Promise<User>((resolve) => {
      resolve(novoUser);
    });
  }

  // async verificarUsuario(userData:any): Promise<User> {
  //   const {nome, senha} = userData;

  //   const bancoUser = await this.UsuarioRepository.filtraUsuarioByName(nome);
    
  //   if(bancoUser.senha == senha){

  //   }

  // }

}
