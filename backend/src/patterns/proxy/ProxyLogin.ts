import { LoginRequestDto } from "../../model/dto/LoginRequestDto";
import { ILogin } from "../../model/interfaces/ILogin";
import { User } from "../../model/interfaces/IUser";
import { UserService } from "../../service/userService";
import { EmailValidator } from "../chainOfResponsibility/EmailValidator";
import { SenhaValidator } from "../chainOfResponsibility/SenhaValidator";

export class ProxyLogin implements ILogin {
    private userService = new UserService(); // Instancia o serviço diretamente

    public async login(userData: LoginRequestDto): Promise<User> {

        const emailValidator = new EmailValidator();
        const senhaValidator = new SenhaValidator();

        // Validação básica com CoR antes de delegar ao objeto real
        emailValidator.setNext(senhaValidator);
        emailValidator.validate(userData);
        
        console.log(`Tentativa de login para o usuário: ${userData.email}`);

        try {
            // Delegando ao serviço diretamente
            const usuarioLogado = await this.userService.userLogin(userData.email, userData.senha);
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