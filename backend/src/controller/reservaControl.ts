import { Request, Response } from "express";
import { ReservaService } from "../service/reservaService";
import { ReservarSalaCommand } from "../patterns/commands/ReservarSalaCommand";
import { CommandExecuter } from "../patterns/commands/CommandExecuter";
import { LogRepository } from "../repository/logRepository";
import { LogCommand } from "../patterns/commands/LogCommand";

const logRepository = LogRepository.getInstance();
const reservaService = new ReservaService();
const executor = new CommandExecuter();

export async function reservarSala(req: Request, res: Response){
    const command = new ReservarSalaCommand(reservaService, req.body)
    const commandLog = new LogCommand(logRepository, req.body);

    try {
        const novaReserva = await executor.run(command, commandLog);
        res.status(201).json(
            {
                mensagem: 'Reserva registrada com sucesso!',
                reserva: novaReserva
            }
        );
    } catch (error:any) {
        res.status(500).json({message: error.message})
    }
}

export async function filtrarReservaPorId(req: Request, res: Response) {
    try {
        const reserva = await reservaService.filtrarReservaPorId(req.query.id as string);
        res.status(200).json(
            {
                mensagem: "Reserva filtrada com sucesso!",
                reserva: reserva
            }
        )
    } catch (error:any){
        res.status(400).json({message:error.message})
    }
}

export async function atualizarReserva(req: Request, res: Response) {
    try {
        const resposta = await reservaService.atualizarReserva(req.body);
        res.status(200).json(
            {
                mensagem: "Reserva atualizada com sucesso",
                resposta: resposta
            }
        )
    } catch (error:any){
        res.status(400).json({message:error.message})
    }
}

export async function cancelarReserva(req: Request, res: Response) {
    const command = new ReservarSalaCommand(reservaService, req.body)

    try {
        const resposta = await executor.desfazer(command);
        res.status(200).json(
            {
                mensagem: "Reserva cancelada com sucesso!",
                resposta: resposta
            }
        )
    } catch (error:any) {
        res.status(400).json({message:error.message})
    }
}

// VERIFICAR RESERVAS EXISTENTES POR SALA ID E DATA 
export async function verificarReservas(req: Request, res: Response) {
    try {
        const reservas = await reservaService.verificarReservas(req.params)
        res.json(reservas);
    } catch (error: any) {
        res.status(500).json({error: "Erro ao buscar reservas"})
    } 
}
