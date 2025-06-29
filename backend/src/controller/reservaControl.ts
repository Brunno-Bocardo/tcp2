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
        res.status(400).json({message: error.message})
    }
}