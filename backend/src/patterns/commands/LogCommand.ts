import { LogRepository } from "../../repository/logRepository";
import { ICommand } from "./ICommand";

export class LogCommand implements ICommand {
    limite: number;
    pagina: number;
    offset: number;
    evento?: string;
    usuarioId?: number;
    private logRepository: LogRepository;

    constructor(
        logRepository: LogRepository,
        limite?: string,
        pagina?: string, // qual a lógica de ter pagina?
        offset?: string,
        evento?: string,
        usuarioId?: string
    ) {
        this.logRepository = logRepository,
        this.limite = parseInt(limite as string) || 100;
        this.pagina = parseInt(pagina as string) || 1; // qual a lógica de ter pagina?
        this.offset = parseInt(offset as string) || 0;
        this.evento = evento || undefined;
        this.usuarioId = parseInt(usuarioId as string) || undefined
    }

    async execute(): Promise<any> {
        if(this.evento){
            return await this.logRepository.buscarLogsPorEvento(this.evento);
        } else if (this.usuarioId) {
            return await this.logRepository.buscarLogsPorUsuario(this.usuarioId)
        } else {
            return await this.logRepository.listarLogs(this.limite, this.offset)
        }
    }
}