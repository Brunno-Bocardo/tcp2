import { Reserva } from "../../model/classes/Reserva";

export class CriadorReserva {
    criarReserva(reservaData: any): Reserva {
        const {id, solicitanteId, userId, salaId,dataSolicitacao, dataReserva, horarioInicio, horarioFim} = reservaData

        return new Reserva(parseInt(userId), parseInt(salaId), dataSolicitacao, dataReserva, horarioInicio, horarioFim, parseInt(id), parseInt(solicitanteId));
    }
}