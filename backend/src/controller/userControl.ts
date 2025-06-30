import {Request, Response} from "express";
import { UserService } from "../service/userService";
import { ProxyLogin } from "../patterns/proxy/ProxyLogin";

const usuarioService = new UserService();

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

export async function verificarUsuario(req: Request, res: Response) {

    const proxyLogin = new ProxyLogin();
    try {
        const usuario = await proxyLogin.login(req.body)
        res.json(usuario)
    } catch (error: any) {
        res.status(400).json({error: "Erro ao logar usuário"})
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