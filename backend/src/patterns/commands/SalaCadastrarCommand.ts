import { SalaRequestDto } from "../../model/dto/SalaRequestDto";
import { SalaService } from "../../service/salaService";
import { ICommand } from "./ICommand";

export class SalaCadastrarCommand implements ICommand{
    constructor(
        private salaService: SalaService,
        private dadosReserva: SalaRequestDto
    ){}

    async execute(): Promise<any> {
        return await this.salaService.cadastrarSala(this.dadosReserva)
    }
}