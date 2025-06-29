import { Request, Response } from "express";
import { SalaService } from "../service/salaService";
import { CommandExecuter } from "../patterns/commands/CommandExecuter";
import { SalaCadastrarCommand } from "../patterns/commands/SalaCadastrarCommand";
import { SalaAtualizarCommand } from "../patterns/commands/SalaAtualizarCommand";
import { SalaExcluirCommand } from "../patterns/commands/SalaExcluirCommand";
import { SalaFiltrarCommand } from "../patterns/commands/SalaFiltrarCommand";
import { SalasFiltrarCommand } from "../patterns/commands/SalasFiltrarCommand";

const salaService = new SalaService();
const executor = new CommandExecuter();

export async function cadastrarSala(req: Request, res: Response) {
    const command = new SalaCadastrarCommand(salaService, req.body)

    try {
        const novaSala = await executor.run(command);
        res.status(201).json(
            {
                mensagem: "Sala adicionada com sucesso!",
                sala: novaSala
            }
        )

    } catch(error:any){
        res.status(400).json({message:error.message})
    }
}

export async function filtrarSala(req: Request, res: Response) {
    const command = new SalaFiltrarCommand(salaService, req.query.id)

    try {
        const sala = await executor.run(command);
        res.status(200).json(
            {
                mensagem: "Sala filtrada com sucesso!",
                sala: sala
            }
        )
    } catch (error:any){
        res.status(400).json({message:error.message})
    }
}

export async function atualizarSala(req: Request, res: Response) {
    const command = new SalaAtualizarCommand(salaService, req.body)

    try {
        const sala = await executor.run(command);
        res.status(200).json(
            {
                mensagem: "Sala atualizada com sucesso!",
                sala: sala
            }
        )
    } catch (error:any){
        res.status(400).json({message:error.message})
    }
}

export async function excluirSala(req: Request, res: Response) {
    const command = new SalaExcluirCommand(salaService, req.body)

    try {
        const resposta = await executor.run(command);
        res.status(200).json(
            {
                mensagem: "Sala excluida com sucesso!",
                resposta: resposta
            }
        )
    } catch (error:any){
        res.status(400).json({message:error.message})
    }
}

export async function filtrarSalas(req: Request, res: Response) {
    const command = new SalasFiltrarCommand(salaService)

    try {
        const sala = await executor.run(command);
        res.status(200).json(
            {
                mensagem: "Salas filtradas com sucesso!",
                sala: sala
            }
        )
    } catch (error:any){
        res.status(400).json({message:error.message})
    }
}