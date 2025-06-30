import { LoginRequestDto } from "../../model/dto/LoginRequestDto";
import { ILogin } from "../../model/interfaces/ILogin";
import { User } from "../../model/interfaces/IUser";
import { UserService } from "../../service/userService";

export class ProxyLogin implements ILogin {
    private userService = new UserService(); // Instancia o serviço diretamente

    public async login(userData: LoginRequestDto): Promise<User> {
        const {email, senha} = userData;
        
        console.log(`Tentativa de login para o usuário: ${email}`);

        // Validação básica antes de delegar ao objeto real
        if (!email || !senha) {
            throw new Error("Email ou senha não podem estar vazios.")
        }

        try {
            // Delegando ao serviço diretamente
            const usuarioLogado = await this.userService.userLogin(email, senha);
            console.log("Login realizado com sucesso:", usuarioLogado);
            return new Promise<User>((resolve) => {
                resolve(usuarioLogado);
            });
        } catch (error: any) {
            console.error("Erro ao realizar login:", error.message);
            throw error;
        }
    }
}