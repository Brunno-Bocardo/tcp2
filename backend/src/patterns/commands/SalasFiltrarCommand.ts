import { SalaService } from "../../service/salaService";
import { ICommand } from "./ICommand";

export class SalasFiltrarCommand implements ICommand {
    constructor(
        private salaService: SalaService,
    ){}

    async execute(): Promise<any> {
        return await this.salaService.filtrarSalas();
    }
}