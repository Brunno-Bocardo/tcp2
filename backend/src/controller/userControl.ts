import {Request, Response} from "express";
import { UserService } from "../service/userService";
import { ProxyLogin } from "../patterns/proxy/ProxyLogin";
import { CommandExecuter } from "../patterns/commands/CommandExecuter";
import { UserFiltrarCommand } from "../patterns/commands/UserFiltrarCommand";

const usuarioService = new UserService();
const executor = new CommandExecuter();

export async function cadastrarUsuario(req: Request, res: Response){
    try{
        const novoUsuario = await usuarioService.cadastrarUsuario(req.body);
        res.status(201).json(
            {
                mensagem: "Usuario adicionado com sucesso!",
                user: novoUsuario
            }
        );
    } catch (error: any){
        res.status(400).json({message:error.message})
    }
};

export async function filtrarUsuario(req: Request, res: Response) {
    const command = new UserFiltrarCommand(usuarioService, req.query.id as string, req.query.email as string, req.query.nome as string)

    try {
        const usuario = await executor.run(command);
        res.json(usuario);
    } catch (error: any) {
        res.status(500).json({error: "Erro ao buscar usuário"});
    }
}

export async function verificarUsuario(req: Request, res: Response) {

    const proxyLogin = new ProxyLogin();
    try {
        const usuario = await proxyLogin.login(req.body)
        res.json(usuario)
    } catch (error: any) {
        res.status(400).json({error: "Erro ao logar usuário"})
    }
}

export async function atualizarUsuario(req: Request, res: Response) {
    try {
        const usuario = await usuarioService.atualizarUsuario(req.body);
        res.status(200).json(
            {
                mensagem: "Usuário atualizado com sucesso",
                usuario: usuario
            }
        )
    } catch (error: any) {
        res.status(400).json({message:error.message})
    }
}

export async function deletarUsuario(req: Request, res: Response) {
    try {
        const usuario = await usuarioService.deletarUsuario(req.body);
        res.status(200).json(
            {
                mensagem: "Usuário deletado com sucesso",
                usuario: usuario
            }
        )
    } catch (error: any){
        res.status(400).json({message:error.message})
    }
}

export async function filtrarUsuarios(req: Request, res: Response) {
    try {
        const users = await usuarioService.filtrarUsers()
        res.status(200).json(users)

    } catch (error: any){
        res.status(400).json({error: "Erro ao buscar usuários"});
    }
}