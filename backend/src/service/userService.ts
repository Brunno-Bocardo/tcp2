import { User } from "../model/classes/user";
import { UserRepository } from "../repository/userRepository";

export class UserService {
    private UsuarioRepository = UserRepository.getInstance();

    async cadastrarUsuario(userData:any):Promise<User>{
        const {nome, email, curso, senha, tipo} = userData;

        const usuario = new User(undefined, nome, email, curso, senha);

        // Alguma regra de negocio

        const novoUser = await this.UsuarioRepository.inserirUsuario(usuario);
        console.log("Cadastrado: ", novoUser)
        return new Promise<User>((resolve) => {
            resolve(novoUser);
        })

    }
}