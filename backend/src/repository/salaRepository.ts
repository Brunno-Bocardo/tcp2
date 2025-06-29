import { executarComandoSQL } from "../database/mysql";
import { Sala } from "../model/interfaces/ISala";

export class SalaRepository {
    private static instance : SalaRepository;

    private constructor(){
            this.createTable();
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
                const resultado = await executarComandoSQL(query, []);
                console.log("Query executada com sucesso", resultado);
            } catch (err) {
                console.error("Error");
            }
        }

        async cadastrarSala(sala: Sala): Promise<Sala> {
            const query = "INSERT INTO Rooms (numero, capacidade_maxima, tipo) VALUES (?,?,?)";
        
            try{
                const resultado = await executarComandoSQL(query, [sala.numero, sala.capacidadeMaxima, sala.tipo]);
                console.log("Reserva registrada com sucesso");
                sala.id = resultado.insertId;
                return new Promise<Sala>((resolve) => {
                    resolve(sala);
                })
            } catch (err: any) {
                console.log("Erro ao cadastrar sala: ", err);
                throw err;
            }
        }

        async filtrarSalaById(salaId: number): Promise<Sala> {
        
            const query = "SELECT * FROM Rooms where id = ?";
    
            try{
                const resultado = await executarComandoSQL(query, [salaId]);
                console.log("Sala filtrada com sucesso");
                return new Promise<Sala>((resolve) => {
                    resolve(resultado);
                })
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
                    resolve(resultado);
                })
            } catch (err: any){
                console.log(`Erro ao tentar atualizar sala com ID ${sala.id}`)
                throw err;
            }
        }

        async deletarSala(sala: Sala): Promise<Sala> {
            const query = "DELETE FROM Rooms where id = ?";

            try {
                const resultado = await executarComandoSQL(query, [sala.id]);
                console.log(`Sala com ID ${sala.id} deletada com sucesso`);
                return new Promise<Sala>((resolve) => {
                    resolve(resultado);
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
                console.log("Salas filtradas com sucesso");
                return new Promise<Sala[]>((resolve) => {
                    resolve(resultado);
                })
            } catch (err: any) {
                console.log("Erro ao filtrar salas: ", err);
                throw err;
            }
        }
}