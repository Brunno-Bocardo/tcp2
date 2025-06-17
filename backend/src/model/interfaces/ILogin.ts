export interface ILogin {
    login(usuario: string, senha: string): Promise<boolean>;
}
