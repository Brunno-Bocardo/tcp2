import { executarComandoSQL } from "../database/mysql";
import { Sala } from "../model/interfaces/ISala";
import { AbstractSubject } from "../patterns/observer/AbstractSubject";
import { LoggerObserver } from "../patterns/observer/LoggerObserver";

export class SalaRepository extends AbstractSubject {
    private static instance : SalaRepository;

    private constructor(){
        super();
        this.createTable();
        
        // Adicionar o LoggerObserver como observador
        const logger = LoggerObserver.getInstance();
        this.attach(logger);
    }
    
    public static getInstance(): SalaRepository {
        if(!this.instance) {
            this.instance = new SalaRepository();
        }
        return this.instance;
    }
    
    private async createTable() {
        const query = `
            CREATE TABLE IF NOT EXISTS tcp2_db.Rooms
            (
                id INT AUTO_INCREMENT PRIMARY KEY,
                numero INT NOT NULL,
                capacidade_maxima INT NOT NULL,
                tipo VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )`;
        try {
            await executarComandoSQL(query, []);
        } catch (err) {
            console.error("Error");
        }
    }

    async cadastrarSala(sala: Sala): Promise<Sala> {
        const query = "INSERT INTO tcp2_db.Rooms (numero, capacidade_maxima, tipo) VALUES (?,?,?)";

        try{
            const resultado = await executarComandoSQL(query, [sala.numero, sala.capacidadeMaxima, sala.tipo]);
            console.log("Sala cadastrada com sucesso");
            sala.id = resultado.insertId;
            
            // Notificar observadores sobre a criação da sala
            this.notify('criar_sala', {
                id: sala.id,
                numero: sala.numero,
                capacidadeMaxima: sala.capacidadeMaxima,
                tipo: sala.tipo
            });

            return new Promise<Sala>((resolve) => {
                resolve(sala);
            })
        } catch (err: any) {
            console.log("Erro ao cadastrar sala: ", err);
            
            // Notificar observadores sobre o erro
            this.notify('erro_criar_sala', {
                numero: sala.numero,
                tipo: sala.tipo,
                erro: err.message
            });
            
            throw err;
        }
    }

    async filtrarSalaById(salaId: number): Promise<Sala> {
    
        const query = "SELECT * FROM Rooms where id = ?";

        try{
            const resultado = await executarComandoSQL(query, [salaId]);
            return resultado[0];
            
        } catch (err: any) {
            console.log("Erro ao filtrar sala: ", err);
            throw err;
        }
    }

    async atualizarSala(sala: Sala): Promise<Sala> {
        const query = "UPDATE Rooms set numero = ?, capacidade_maxima = ?, tipo = ? where id = ?";

        try {
            const resultado = await executarComandoSQL(query, [sala.numero, sala.capacidadeMaxima, sala.tipo, sala.id])
            console.log(`Sala com ID ${sala.id} atualizada com sucesso`);
            return new Promise<Sala>((resolve) => {
                resolve(resultado[0]);
            })
        } catch (err: any){
            console.log(`Erro ao tentar atualizar sala com ID ${sala.id}`)
            throw err;
        }
    }

    async deletarSala(sala: Sala): Promise<any> {
        const query = "DELETE FROM Rooms where id = ?";

        try {
            const resultado = await executarComandoSQL(query, [sala.id]);
            console.log(`Sala com ID ${sala.id} deletada com sucesso`);
            return new Promise<any>((resolve) => {
                resolve(resultado[0]);
            })
        } catch (err: any) {
            console.log(`Erro ao tentar deletar sala com ID ${sala.id}`);
            throw err;
        }
    }

    async filtrarSalas(): Promise<Sala[]> {
    
        const query = "SELECT * FROM Rooms";

        try{
            const resultado = await executarComandoSQL(query, []);
            console.log("Salas filtradas com sucesso", resultado);
            return resultado;
        } catch (err: any) {
            console.log("Erro ao filtrar salas: ", err);
            throw err;
        }
    }
}