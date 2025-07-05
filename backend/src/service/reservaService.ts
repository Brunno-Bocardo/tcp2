import { EventEmitterAsyncResource } from "node:stream";
import { Reserva } from "../model/classes/Reserva";
import { ReservaRepository } from "../repository/reservaRepository";
import { UserRepository } from "../repository/userRepository";
import { SalaRepository } from "../repository/salaRepository";

export class ReservaService {
    private reservaRepository = ReservaRepository.getInstance();
    private userRepository = UserRepository.getInstance();
    private salaRepository = SalaRepository.getInstance();


    async registrarReserva(reservaData: any): Promise<Reserva> {
        console.log("registrarReserva chamado com dados:", reservaData);
        const {
            user_id: userId,
            sala_id: salaId,
            data_da_solicitacao: dataSolicitacao,
            data_da_reserva: dataReserva,
            horario_inicio: horarioInicio,
            horario_fim: horarioFim
        } = reservaData;
        if (!userId || !salaId || !dataSolicitacao || !dataReserva || !horarioInicio || !horarioFim) {
            console.error("Dados da reserva incompletos:", reservaData);
            throw new Error("Dados da reserva incompletos");
        }

        const user = await this.userRepository.filtraUsuarioById(userId);
        const sala = await this.salaRepository.filtrarSalaById(salaId);

        if (!user) {
            console.error(`Usuário com ID ${userId} não encontrado.`);
            throw new Error(`Usuário com ID ${userId} não encontrado.`);
        }
        if (!sala) {
            console.error(`Sala com ID ${salaId} não encontrada.`);
            throw new Error(`Sala com ID ${salaId} não encontrada`);
        }

        const reserva = new Reserva(userId, salaId, dataSolicitacao, dataReserva, horarioInicio, horarioFim);

        const reservaRegistrada = await this.reservaRepository.inserirReserva(reserva);
        console.log('Reserva registrada:', reservaRegistrada);

        return reservaRegistrada;
    }

    async verificarReservas(reservaData: any): Promise<Reserva[]> {
        const { salaId, data } = reservaData;

        if (!salaId || !data) {
            throw new Error("Dados da reserva incompletos");
        }

        const reservas = await this.reservaRepository.listarReservasPorSalaEData(parseInt(salaId), data);
        return new Promise<Reserva[]>((resolve) => {
            resolve(reservas)
        });
    }
}