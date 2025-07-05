import { ReservaDto } from "../../model/dto/ReservaDto";
import { ReservaService } from "../../service/reservaService";
import { ICommand } from "./ICommand";

export class ReservarSalaCommand implements ICommand {
    constructor(
        private reservaService: ReservaService, 
        private dadosReserva: ReservaDto
    ) {}

    async execute(): Promise<any> {
        const reserva =  await this.reservaService.registrarReserva(this.dadosReserva)

        this.dadosReserva.id = reserva.id
        this.dadosReserva.userId = reserva.userId
        this.dadosReserva.salaId = reserva.salaId

        return reserva;
    }

    async search(): Promise<any> {
        console.log(`Filtrando com ID: ${this.dadosReserva.id}`)
        return await this.reservaService.filtrarReservaPorId(this.dadosReserva.id)
    }

    async undo() {
        console.log(`Deletando reserva com ID: ${this.dadosReserva.id}`)
        await this.reservaService.deletarReserva(this.dadosReserva)
    }
}