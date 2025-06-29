import { EventEmitterAsyncResource } from "node:stream";
import { Reserva } from "../model/classes/Reserva";
import { ReservaRepository } from "../repository/reservaRepository";

export class ReservaService {
    private ReservaRepository = ReservaRepository.getInstance();

    // async registrarReserva(reservaData: any): Promise<Reserva> {
    //     const {userId, salaId, dataSolicitacao, dataReserva, horarioInicio, horarioFim} = reservaData;

    //     const reserva = new Reserva(dataSolicitacao, dataReserva, horarioInicio, horarioFim);

    //     //Incluir verificações antes de registrar reserva
    //     const reservaRegistrada = await this.ReservaRepository.registrarReserva(reserva);
    //     console.log('Reserva registrada: ', reservaRegistrada);
    //     return new Promise<Reserva>((resolve) => {
    //         resolve(reservaRegistrada);
    //     });
    // }
}