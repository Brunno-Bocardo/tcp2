import { ILogin } from "../../model/interfaces/ILogin";
import { UserService } from "../../service/userService";

export class ProxyLogin implements ILogin {
    private userService = new UserService(); // Instancia o serviço diretamente

    public async login(email: string, senha: string): Promise<boolean> {
        console.log(`Tentativa de login para o usuário: ${email}`);
        
        
        
        // Validação básica antes de delegar ao objeto real
        if (!email || !senha) {
            console.error("Usuário ou senha não podem estar vazios.");
            return false;
        }

        try {
            // Delegando ao serviço diretamente
            const usuarioLogado = await this.userService.userLogin(email, senha);
            console.log("Login realizado com sucesso:", usuarioLogado);
            return true;
        } catch (error: any) {
            console.error("Erro ao realizar login:", error.message);
            return false;
        }
    }
}