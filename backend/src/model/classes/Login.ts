import { ILogin } from "../interfaces/ILogin";
import { UserRepository } from "../../repository/userRepository";

export class Login implements ILogin {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = UserRepository.getInstance();
    }

    public async login(usuario: string, senha: string): Promise<boolean> {
        try {
            const user = await this.userRepository.buscarUsuarioPorEmailESenha(usuario, senha);
            if (user) {
                console.log(`Usuário ${usuario} autenticado com sucesso.`);
                return true;
            } else {
                console.log(`Falha na autenticação para o usuário ${usuario}.`);
                return false;
            }
        } catch (error) {
            console.error("Erro ao realizar login:", error);
            throw error;
        }
    }
}