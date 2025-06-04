// import {Request, Response} from "express";
// import { UserService } from "../service/userService";

// const UsuarioService = new UserService();

// export function cadastrarUsuario(req: Request, res: Response){
//     try{
//         const novoUsuario = UsuarioService.cadastrarUsuario(req.body);
//         res.status(201).json(
//             {
//                 mensagem: "Usuario adicionado com sucesso!",
//                 user: novoUsuario
//             }
//         );
//     } catch (error: any){
//         res.status(400).json({message:error.message})
//     }
// };