import { Reserva } from "../../model/classes/Reserva";
import { ICommand } from "./ICommand";

export class CommandExecuter {
    private historico: Map<string, ICommand> = new Map();
    private historicoLogs: Map<string, ICommand> = new Map();

    private gerarChave(reserva: any): string {
        const userId = reserva.solicitante_id || reserva.solicitanteId;
        const reservaId = reserva.id
        return `${userId}:${reservaId}`
    }

    async run(command: ICommand, commandLog?: ICommand): Promise<any> {
        console.log("Executando comando...");
        const resposta = await command.execute();

        console.log(`Resposta: ${resposta.solicitanteId}`)
        
        if(!resposta.solicitanteId){
            return resposta
        }

        const chave = this.gerarChave(resposta);
        console.log(`Chave: ${chave}`);
        this.historico.set(chave, command);

        if(commandLog) {
            console.log("CommandLog inserido no histórico")
            this.historicoLogs.set(chave, commandLog);
        }

        console.log("Histórico atual:", Array.from(this.historico.keys()));

        return resposta;
    }

    async desfazer(command: ICommand): Promise<any> {
        const resposta = await command.search();
        
        console.log(`Resultando do search: ID: ${resposta.id}, ${resposta.user_id} e ${resposta.sala_id}`)

        console.log("Histórico no momento do desfazer:", Array.from(this.historico.keys()));

        if(resposta.id && resposta.user_id && resposta.sala_id) {
            const chave = this.gerarChave(resposta);
            console.log(`Chave: ${chave}`)
            const oldCommand = this.historico.get(chave);
            const oldCommandLog = this.historicoLogs.get(chave);

            if(!oldCommand || !oldCommandLog){
                throw new Error("Comando não encontrado ou você não tem permissão.");
            }

            await oldCommand.undo();
            await oldCommandLog.undo();
            this.historico.delete(chave);
            this.historicoLogs.delete(chave);
        }

        return resposta;
        
    }
}