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

    if(!nome || !email || !curso || !senha || !tipo){
      throw new Error("Dados do usuário incompletos");
    }

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

    console.log(`Usuario: ${usuario}`)

    return new Promise<User>((resolve) => {
      resolve(usuario);
    });
  }

  async filtrarUserById(id: number): Promise<User>{
    if(!id || typeof id != "number") {
      throw new Error(`O ID ${id} informado é inválido`);
    }
    
    const usuario = await this.usuarioRepository.filtraUsuarioById(id)

    if(!usuario){
      throw new Error("Usuário não localizado");
    }

    return new Promise<User>((resolve) => {
      resolve(usuario);
    })
  }

  async filtrarUserPorEmail(email: string): Promise<User>{
    if(!email || typeof email != "string") {
      throw new Error(`O email ${email} informado é inválido`);
    }
    
    const usuario = await this.usuarioRepository.filtraUsuarioByEmail(email)

    if(!usuario){
      throw new Error("Usuário não localizado");
    }
    
    return new Promise<User>((resolve) => {
      resolve(usuario);
    })
  }

  async filtrarUserPorNome(nome: string): Promise<User>{
    if(!nome || typeof nome != "string") {
      throw new Error(`O nome ${nome} informado é inválido`);
    }
    
    const usuario = await this.usuarioRepository.filtraUsuarioByName(nome)

    if(!usuario){
      throw new Error("Usuário não localizado");
    }
    
    return new Promise<User>((resolve) => {
      resolve(usuario);
    })
  }

  async atualizarUsuario(userData: any): Promise<User> {
    const {id, nome, email, curso, senha, tipo} = userData;

    if(!id || !nome || !email || !curso || !senha || !tipo){
      throw new Error("Dados incompletos do usuário");
    }

    const userExiste = await this.usuarioRepository.filtraUsuarioById(parseInt(id))
    if(!userExiste){
      throw new Error(`Usuário com ID ${id} não encontrado`);
    }

    const usuario =
      tipo == "Coordenador"
        ? this.coordenadorFabrica.criarUsuario(nome, email, curso, senha, id)
        : this.professorFabrica.criarUsuario(nome, email, curso, senha, id); 
    
    await this.usuarioRepository.atualizarUsuario(usuario);
    console.log("Usuário atualizado");
    return new Promise<User>((resolve) => {
      resolve(usuario);
    })
  }

  async deletarUsuario(userData: any): Promise<User> {
    const {id, nome, email, curso, senha, tipo} = userData;

    if(!id || !nome || !email || !curso || !senha || !tipo){
      throw new Error("Dados incompletos do usuário");
    }

    const userExiste = await this.usuarioRepository.filtraUsuarioById(parseInt(id))
    if(!userExiste){
      throw new Error(`Usuário com ID ${id} não encontrado`);
    }

    const usuario =
      tipo == "Coordenador"
        ? this.coordenadorFabrica.criarUsuario(nome, email, curso, senha, id)
        : this.professorFabrica.criarUsuario(nome, email, curso, senha, id); 
    
    await this.usuarioRepository.deletarUsuario(usuario);
    console.log("Usuário deletado");
    return new Promise<User>((resolve) => {
      resolve(usuario);
    })
  }

  async filtrarUsers(): Promise<User[]> {
    const users = await this.usuarioRepository.listarUsuarios();
    console.log("Usuários listados com sucesso");
    return new Promise<User[]>((resolve) => {
      resolve(users)
    })
  }
}
