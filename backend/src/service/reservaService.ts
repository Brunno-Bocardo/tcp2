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
        const { solicitanteId, userId, salaId, dataSolicitacao, dataReserva, horarioInicio, horarioFim } = reservaData;

        if (!solicitanteId || !userId || !salaId || !dataSolicitacao || !dataReserva || !horarioInicio || !horarioFim) {
            throw new Error("Dados da reserva incompletos")
        }

        const user = await this.userRepository.filtraUsuarioById(userId);

        if (!user) {
            console.error(`Usuário com ID ${userId} não encontrado.`);
            throw new Error(`Usuário com ID ${userId} não encontrado.`);
        }

        const sala = await this.salaRepository.filtrarSalaById(salaId)

        if (!sala) {
            throw new Error(`Sala com ID ${salaId} não encontrada`);
        }

        const reserva = new Reserva(userId, salaId, dataSolicitacao, dataReserva, horarioInicio, horarioFim, undefined, solicitanteId);

        const reservaRegistrada = await this.reservaRepository.inserirReserva(reserva);
        console.log('Reserva registrada: ', reservaRegistrada);
        return new Promise<Reserva>((resolve) => {
            resolve(reservaRegistrada);
        });
    }

    async filtrarReservaPorId(reservaId: string | any): Promise<Reserva> {

        if (!reservaId) {
            throw new Error(`ID ${reservaId} inválido`);
        }

        const id = typeof reservaId === 'string' ? parseInt(reservaId) : reservaId;

        const reserva = await this.reservaRepository.filtrarReservaById(id);

        if (!reserva) {
            throw new Error("Reserva não localizada");
        }

        console.log("Reserva encontrada com sucesso!");
        return new Promise<Reserva>((resolve) => {
            resolve(reserva);
        })
    }

    async atualizarReserva(reservaData: any) {
        const { id, solicitanteId, userId, salaId, dataSolicitacao, dataReserva, horarioInicio, horarioFim } = reservaData;

        if (!id || !solicitanteId || !userId || !salaId || !dataSolicitacao || !dataReserva || !horarioInicio || !horarioFim) {
            throw new Error("Dados da reserva incompletos")
        }

        const reservaExiste = await this.reservaRepository.filtrarReservaById(parseInt(id))

        if (!reservaExiste) {
            throw new Error(`Reserva com ID ${id} não encontrada`)
        }

        const usuarioExiste = await this.userRepository.filtraUsuarioById(userId)

        if (!usuarioExiste) {
            throw new Error(`Usuario com ID ${id} não encontrado`)
        }

        const salaExiste = await this.salaRepository.filtrarSalaById(parseInt(salaId))

        if (!salaExiste) {
            throw new Error(`Sala com ID ${id} não encontrado`)
        }

        const reserva = new Reserva(parseInt(userId), parseInt(salaId), dataSolicitacao, dataReserva, horarioInicio, horarioFim, parseInt(id), parseInt(solicitanteId));

        const resposta = await this.reservaRepository.atualizarReserva(reserva);

        if (resposta.affectedRows === 0) {
            throw new Error("Reserva não encontrada ou já deletada.");
        }
    }

    async deletarReserva(reservaData: any) {
        const { id, solicitanteId, userId, salaId, dataSolicitacao, dataReserva, horarioInicio, horarioFim } = reservaData;

        if (!id || !solicitanteId || !userId || !salaId || !dataSolicitacao || !dataReserva || !horarioInicio || !horarioFim) {
            throw new Error("Dados da reserva incompletos")
        }

        const reservaExiste = await this.reservaRepository.filtrarReservaById(parseInt(id))

        if (!reservaExiste) {
            throw new Error(`Reserva com ID ${id} não encontrada`)
        }

        const reserva = new Reserva(userId, salaId, dataSolicitacao, dataReserva, horarioInicio, horarioFim, id, solicitanteId);

        const resposta = await this.reservaRepository.deletarReserva(reserva);

        if (resposta.affectedRows === 0) {
            throw new Error("Reserva não encontrada ou já deletada.");
        }

        console.log('Reserva Deletada com sucesso!');
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