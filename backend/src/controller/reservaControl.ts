import { Request, Response } from "express";
import { ReservaService } from "../service/reservaService";
import { ReservarSalaCommand } from "../patterns/commands/ReservarSalaCommand";
import { CommandExecuter } from "../patterns/commands/CommandExecuter";

const reservaService = new ReservaService();
const executor = new CommandExecuter();

export async function reservarSala(req: Request, res: Response){
    const command = new ReservarSalaCommand(reservaService, req.body)

    try {
        const novaReserva = await executor.run(command);
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

// VERIFICAR RESERVAS EXISTENTES POR SALA ID E DATA 
export async function verificarReservas(req: Request, res: Response) {
    try {
        const reservas = await reservaService.verificarReservas(req.params)
        res.json(reservas);
    } catch (error: any) {
        res.status(500).json({error: "Erro ao buscar reservas"})
    } 
}
