import { SalaDto } from "../../model/dto/SalaDto";
import { SalaService } from "../../service/salaService";
import { ICommand } from "./ICommand";

export class SalaExcluirCommand implements ICommand {
    constructor(
        private salaService: SalaService,
        private dadoSala: SalaDto
    ){}

    async execute(): Promise<any> {
        return await this.salaService.deletarSala(this.dadoSala)      
    }
}