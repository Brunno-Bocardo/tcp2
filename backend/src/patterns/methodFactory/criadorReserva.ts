import { Reserva } from "../../model/classes/Reserva";

export class CriadorReserva {
    criarReserva(reservaData: any): Reserva {
        const {
            id: id,
            solicitante_id: solicitanteId, 
            user_id: userId, sala_id: salaId, 
            data_da_solicitacao: dataSolicitacao, 
            data_da_reserva: dataReserva, 
            horario_inicio: horarioInicio,
            horario_fim: horarioFim
        } = reservaData

        return new Reserva(parseInt(userId), parseInt(salaId), dataSolicitacao, dataReserva, horarioInicio, horarioFim, parseInt(id), parseInt(solicitanteId));
    }
}