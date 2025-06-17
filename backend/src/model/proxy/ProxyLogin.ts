import { ILogin } from "../interfaces/ILogin";
import { Login } from "../classes/Login";

export class ProxyLogin implements ILogin {
    private loginClass: Login;

    constructor() {
        this.loginClass = new Login();
    }

    public async login(usuario: string, senha: string): Promise<boolean> {
        console.log(`Tentativa de login para o usuário: ${usuario}`);
        
        // Validação básica antes de delegar ao objeto real
        if (!usuario || !senha) {
            console.error("Usuário ou senha não podem estar vazios.");
            return false;
        }

        return await this.loginClass.login(usuario, senha);
    }
}