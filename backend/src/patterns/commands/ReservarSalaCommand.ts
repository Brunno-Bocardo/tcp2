import { ReservaRequestDto } from "../../model/dto/ReservaRequestDto";
import { ReservaService } from "../../service/reservaService";
import { ICommand } from "./ICommand";

export class ReservarSalaCommand implements ICommand {
    constructor(
        private reservaService: ReservaService, 
        private dadosReserva: ReservaRequestDto
    ) {}

    async execute(): Promise<any> {
        return await this.reservaService.registrarReserva(this.dadosReserva)
    }
}