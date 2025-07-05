import { ReservaDto } from "../../model/dto/ReservaDto";
import { LogRepository } from "../../repository/logRepository";
import { ICommand } from "./ICommand";

export class LogCommand implements ICommand {
    limite: number;
    pagina: number;
    offset: number;
    evento?: string;
    usuarioId?: number;
    reservaData?: ReservaDto
    private logRepository: LogRepository;

    constructor(
        logRepository: LogRepository,
        reservaData?: ReservaDto,
        usuarioId?: string,
        limite?: string,
        pagina?: string, // qual a lógica de ter pagina?
        offset?: string,
        evento?: string,
    ) {
        this.logRepository = logRepository,
        this.reservaData = reservaData || undefined
        this.usuarioId = parseInt(usuarioId as string) || undefined
        this.limite = parseInt(limite as string) || 100;
        this.pagina = parseInt(pagina as string) || 1; // qual a lógica de ter pagina?
        this.offset = parseInt(offset as string) || 0;
        this.evento = evento || undefined;
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

    async search(): Promise<any> {
        return await this.logRepository.listarLogs(this.limite, this.offset)
    }

    async undo(): Promise<any> {
        if(this.reservaData?.id) {
            await this.logRepository.removerLog(this.reservaData.id)
        }
    }
}