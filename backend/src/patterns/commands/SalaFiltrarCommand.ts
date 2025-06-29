import { SalaDto } from "../../model/dto/SalaDto";
import { SalaService } from "../../service/salaService";
import { ICommand } from "./ICommand";

export class SalaFiltrarCommand implements ICommand {
    constructor(
        private salaService: SalaService,
        private dadoSala: any
    ){
    }

    async execute(): Promise<any> {
        return await this.salaService.filtrarSalaPorId(this.dadoSala)
    }
}