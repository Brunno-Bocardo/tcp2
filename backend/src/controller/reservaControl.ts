import { Request, Response } from "express";
import { ReservaService } from "../service/reservaService";


const reservaService = new ReservaService();

// export function registrarReserva(req: Request, res: Response){
//     try {
//         const novaReserva = reservaService.registrarReserva(req.body);
//         res.status(201).json(
//             {
//                 mensagem: 'Reserva registrada com sucesso!',
//                 reserva: novaReserva
//             }
//         );
//     } catch (error:any) {
//         res.status(400).json({message: error.message})
//     }
// }