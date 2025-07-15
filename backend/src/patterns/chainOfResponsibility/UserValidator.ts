import { UserRepository } from "../../repository/userRepository";
import { AbstractValidatorAsync } from "./AbstractValidatorAsync";

export class UserValidator extends AbstractValidatorAsync{
    private userRespository = UserRepository.getInstance();

    public async validate(request: any): Promise<void> {
        const { user_id: userId } = request;

        console.log("Verificando usuário");

        if (!userId || isNaN(parseInt(userId))) {
            throw new Error(`O ID informado não é válido`);
        }

        const user = await this.userRespository.filtraUsuarioById(parseInt(userId));

        if (!user) {
            throw new Error(`Usuário com ID ${userId} não encontrado`);
        }

        await super.validate(request);
    }
}