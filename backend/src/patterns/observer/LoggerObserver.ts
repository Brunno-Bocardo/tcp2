import { IObserver } from "./IObserver";
import { LogRepository } from "../../repository/logRepository";
import { ILog } from "../../model/interfaces/ILog";

export class LoggerObserver implements IObserver {
    private static instance: LoggerObserver;
    private logRepository: LogRepository;

    private constructor() {
        this.logRepository = LogRepository.getInstance();
    }

    public static getInstance(): LoggerObserver {
        if (!this.instance) {
            this.instance = new LoggerObserver();
        }
        return this.instance;
    }

    // Processa eventos e cria logs correspondentes
    async update(evento: string, dados: any, usuarioId?: number): Promise<void> {
        console.log(`[Logger] Processando evento: ${evento}`);

        try {
            // Criar a descrição com base no tipo de evento
            let descricao = this.criarDescricao(evento, dados);
            
            // Preparar os dados para salvar
            const dadosSerializados = JSON.stringify(dados);
            
            // Criar objeto de log
            const log: ILog = {
                evento,
                descricao,
                usuario_id: usuarioId,
                data_hora: new Date(),
                dados: dadosSerializados
            };
            
            // Salvar no banco de dados
            await this.logRepository.inserirLog(log);
            console.log(`[Logger] Log registrado para evento: ${evento}`);
        } catch (error) {
            console.error(`[Logger] Erro ao registrar log para evento ${evento}:`, error);
        }
    }

    // Cria uma descrição legível com base no tipo de evento e dados
    private criarDescricao(evento: string, dados: any): string {
        switch (evento) {
        case 'criar_usuario':
            return `Usuário criado: ${dados.nome} (${dados.email})`;
        
        case 'login_usuario':
            return `Login realizado: ${dados.email}`;
        
        case 'login_falha':
            return `Tentativa de login falhou: ${dados.email}`;
        
        case 'criar_reserva':
            return `Reserva criada: Sala ${dados.salaId} para ${dados.dataDaReserva} das ${dados.horarioInicio} às ${dados.horarioFim}`;
        
        case 'cancelar_reserva':
            return `Reserva cancelada: ID ${dados.id}`;
        
        case 'criar_sala':
            return `Sala criada: ${dados.numero} (${dados.tipo})`;
        
        default:
            return `Evento ${evento}: ${JSON.stringify(dados)}`;
        }
    }
}