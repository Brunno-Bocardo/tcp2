import { UserService } from "../../service/userService";
import { ICommand } from "./ICommand";

export class UserFiltrarCommand implements ICommand {
    id: number;
    nome?: string;
    email?: string;
    private userService: UserService;

    constructor(userService: UserService, id?: string,  email?: string, nome?: string) {
        this.userService = userService;
        this.id = parseInt(id as string) || 0;
        this.nome = nome || undefined;
        this.email = email || undefined;
    }

    async execute(): Promise<any> {
        if(!this.id && !this.nome && !this.email){
            throw new Error("Para filtrar usuário informe o id, nome ou email");
        }

        if(this.id){
            return await this.userService.filtrarUserById(this.id)
        } else if(this.email){
            return await this.userService.filtrarUserPorEmail(this.email)
        } else if(this.nome){
            return await this.userService.filtrarUserPorNome(this.nome)
        }
    }
}