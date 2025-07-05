import { Request, Response } from "express";
import { SalaService } from "../service/salaService";

const salaService = new SalaService();

export async function cadastrarSala(req: Request, res: Response) {
    try {
        const novaSala = await salaService.cadastrarSala(req.body)
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
    try {
        const sala = await salaService.filtrarSalaPorId(req.query.id as string)
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
    try {
        const sala = await salaService.atualizarSala(req.body)
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

    try {
        const resposta = await salaService.deletarSala(req.body);
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
    try {
        const salas = await salaService.filtrarSalas();
        res.status(200).json({
            mensagem: "Salas encontradas com sucesso",
            salas: salas
        });
    } catch (error:any){
        res.status(500).json({error: "Erro ao buscar salas"});
    }
}