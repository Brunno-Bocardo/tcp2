import { EventEmitterAsyncResource } from "node:stream";
import { Reserva } from "../model/classes/Reserva";
import { ReservaRepository } from "../repository/reservaRepository";
import { UserRepository } from "../repository/userRepository";
import { SalaRepository } from "../repository/salaRepository";

export class ReservaService {
    private reservaRepository = ReservaRepository.getInstance();
    private userRepository = UserRepository.getInstance();
    private salaRepository = SalaRepository.getInstance();
    

    async registrarReserva(reservaData: any): Promise<void> {

        const {userId, salaId, dataSolicitacao, dataReserva, horarioInicio, horarioFim} = reservaData;

        const user = await this.userRepository.filtraUsuarioById(userId);
        const sala = await this.salaRepository.filtrarSalaById(salaId)

        if(!user){
            throw new Error(`Usuário com ID ${userId} não encontrado.`);
        }
        if(!sala){
            throw new Error(`Sala com ID ${salaId} não encontrada`);
        }

        // const reserva = new Reserva(userId, salaId, dataSolicitacao, dataReserva, horarioInicio, horarioFim);

        const reserva = {
            userId: userId,
            salaId: salaId,
            dataDaSolicitacao: dataSolicitacao,
            dataDaReserva: dataReserva,
            horarioInicio: horarioInicio,
            horarioFim: horarioFim
        }

        // console.log(`${reserva.dataDaReserva, reserva.dataDaSolicitacao, reserva.horarioInicio, reserva.horarioFim}`);

         //Incluir verificações antes de registrar reserva

        const reservaRegistrada = await this.reservaRepository.inserirReserva(reserva);
        console.log('Reserva registrada: ', reservaRegistrada);
        // TODO: Corrigir esse return e o tipo de retorno do método registrarReserva -> Reserva 
        // return new Promise<Reserva>((resolve) => {
        //     resolve(reservaRegistrada);
        // });
    }
}