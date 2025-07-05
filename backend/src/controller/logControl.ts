import { Request, Response } from "express";
import { CommandExecuter } from "../patterns/commands/CommandExecuter";
import { LogCommand } from "../patterns/commands/LogCommand";
import { LogRepository } from "../repository/logRepository";

const logRepository = LogRepository.getInstance();
const executor = new CommandExecuter();

export async function filtrarLogs(req: Request, res: Response) {
    const command = new LogCommand(logRepository, undefined, req.query.usuario as string, req.query.limite as string, req.query.pagina as string, req.query.offset as string, req.query.evento as string)

    try {
        const logs = await executor.run(command);
        res.json(logs) //Formatar resposta?
    } catch (error: any) {
        res.status(500).json({ error: "Erro ao buscar logs"});
    }
}
