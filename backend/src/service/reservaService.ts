import { Reserva } from "../model/classes/Reserva";
import { ReservaRepository } from "../repository/reservaRepository";
import { CriadorReserva } from "../patterns/methodFactory/criadorReserva";
import { UserValidator } from "../patterns/chainOfResponsibility/UserValidator";
import { SalaValidator } from "../patterns/chainOfResponsibility/SalaValidator";
import { CampoValidator } from "../patterns/chainOfResponsibility/CampoValidator";

export class ReservaService {
    private reservaRepository = ReservaRepository.getInstance();
    private criadorReserva = new CriadorReserva(); // cria reservas
    private validorCampos = new CampoValidator(); // valida os dados da reserva enviados
    private validorUsuario = new UserValidator(); // valida se o usuario informado existe
    private validorSala = new SalaValidator(); // valida se a sala informada existe


    async registrarReserva(reservaData: any): Promise<Reserva> {

        this.validorCampos.validate(reservaData)
        await this.validorUsuario.validate(reservaData);
        await this.validorSala.validate(reservaData);

        const { sala_id, data_da_reserva, horario_inicio } = reservaData

        const reservaDataTimeExiste = await this.reservaRepository.listarReservasPorSalaDataTime(sala_id, data_da_reserva, horario_inicio)

        if (reservaDataTimeExiste) {
            throw new Error(`Sala já reservada para data: ${data_da_reserva} no horario: ${horario_inicio}`)
        }

        const reserva = this.criadorReserva.criarReserva(reservaData)

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

    async filtrarReservasPorIdUser(solicitanteId: string): Promise<Reserva[]> {


        if (!solicitanteId) {
            throw new Error(`ID ${solicitanteId} inválido`);
        }

        const id = typeof solicitanteId === 'string' ? parseInt(solicitanteId) : solicitanteId;

        const reservas = await this.reservaRepository.filtrarReservasByIdUser(id);

        if (!reservas) {
            throw new Error("Reservas não localizadas");
        }

        console.log("Reservas encontradas com sucesso!");
        return new Promise<Reserva[]>((resolve) => {
            resolve(reservas);
        })
    }

    async atualizarReserva(reservaData: any): Promise<Reserva> {
        const { id } = reservaData;

        if (!id) {
            throw new Error("O ID da reserva não foi informado")
        }

        this.validorCampos.validate(reservaData)
        await this.validorUsuario.validate(reservaData);
        await this.validorSala.validate(reservaData);

        const reservaExiste = await this.reservaRepository.filtrarReservaById(parseInt(id))

        if (!reservaExiste) {
            throw new Error(`Reserva com ID ${id} não encontrada`)
        }

        const reserva = this.criadorReserva.criarReserva(reservaData)
        await this.reservaRepository.atualizarReserva(reserva);

        return reserva;
    }

    async deletarReserva(reservaData: any) {
        const { id, solicitanteId } = reservaData;

        if (!id) {
            throw new Error("Dados da reserva incompletos")
        }

        const usuarioExiste = await this.reservaRepository.filtrarReservasByIdUser(solicitanteId)

        if (!usuarioExiste) {
            throw new Error(`Usuario com id ${solicitanteId} não encontrado`)
        }

        const reservaExiste = await this.reservaRepository.filtrarReservaById(parseInt(id))

        if (!reservaExiste) {
            throw new Error(`Reserva com id ${id} não encontrada`)
        }

        const resposta = await this.reservaRepository.deletarReserva(parseInt(id));

        if (resposta.affectedRows === 0) {
            throw new Error("Reserva não encontrada ou já deletada.");
        }

        console.log('Reserva Deletada com sucesso!');
    }

    async verificarReservas(reservaData: any): Promise<Reserva[]> {
        const { salaId, data, time } = reservaData;

        if (!salaId || !data) {
            throw new Error("Dados da reserva incompletos");
        }

        const reservas = await this.reservaRepository.listarReservasPorSalaDataTime(parseInt(salaId), data, time);
        return new Promise<Reserva[]>((resolve) => {
            resolve(reservas)
        });
    }
    async verificarReservas2(reservaData: any): Promise<Reserva[]> {
        const { salaId, data } = reservaData;

        if (!salaId || !data) {
            throw new Error("Dados da reserva incompletos");
        }

        const reservas = await this.reservaRepository.listarReservasPorSalaEData(parseInt(salaId), data);
        return new Promise<Reserva[]>((resolve) => {
            resolve(reservas)
        });
    }
    async listarTodasAsReservas(): Promise<Reserva[]> {
        const reservas = await this.reservaRepository.listarReservas();
        return reservas;
    }

}