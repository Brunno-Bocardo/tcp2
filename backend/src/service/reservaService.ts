import { EventEmitterAsyncResource } from "node:stream";
import { Reserva } from "../model/classes/Reserva";
import { ReservaRepository } from "../repository/reservaRepository";
import { UserRepository } from "../repository/userRepository";
import { SalaRepository } from "../repository/salaRepository";

export class ReservaService {
    private ReservaRepository = ReservaRepository.getInstance();
    private UserRepository = UserRepository.getInstance();
    private SalaRepository = SalaRepository.getInstance();

    async registrarReserva(reservaData: any): Promise<Reserva> {

        const {userId, salaId, dataSolicitacao, dataReserva, horarioInicio, horarioFim} = reservaData;

        const user = await this.UserRepository.filtraUsuarioById(userId);
        const sala = await this.SalaRepository.filtrarSalaById(salaId)

        if(!user){
            throw new Error(`Usuário com ID ${userId} não encontrado.`);
        }
        if(!sala){
            throw new Error(`Sala com ID ${salaId} não encontrada`);
        }

        const reserva = new Reserva(userId, salaId, dataSolicitacao, dataReserva, horarioInicio, horarioFim);

        console.log(`${reserva.dataDaReserva, reserva.dataDaSolicitacao, reserva.horarioInicio, reserva.horarioFim}`);

         //Incluir verificações antes de registrar reserva

        const reservaRegistrada = await this.ReservaRepository.registrarReserva(reserva);
        console.log('Reserva registrada: ', reservaRegistrada);
        return new Promise<Reserva>((resolve) => {
            resolve(reservaRegistrada);
        });
    }
}