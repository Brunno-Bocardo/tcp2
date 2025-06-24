import { executarComandoSQL } from "../database/mysql";
import { Reserva} from "../model/classes/reserva";

export class ReservaRepository {
    private static instance: ReservaRepository;

    private constructor(){
        this.createTable();
    }

    public static getInstance(): ReservaRepository {
        if(!this.instance) {
            this.instance = new ReservaRepository();
        }
        return this.instance;
    }

    private async createTable() {
        const query = `
            CREATE TABLE IF NOT EXISTS tcp2_db.Reservations
            (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                sala_id INT NOT NULL,
                data_da_solicitacao DATE NOT NULL,
                data_da_reserva DATE NOT NULL,
                horario_de_inicio TIME NOT NULL,
                horario_de_fim TIME NOT NULL,
                FOREIGN KEY (user_id) REFERENCES Users(id),
                FOREIGN KEY (sala_id) REFERENCES Rooms(id)
            )`;
        try {
            const resultado = await executarComandoSQL(query, []);
            console.log("Query executada com sucesso", resultado);
        } catch (err) {
            console.error("Error");
        }
    }

    async registrarReserva(reserva: Reserva): Promise<Reserva> {

        const query = "INSERT INTO Reservations (user_id, sala_id, data_da_solicitacao, data_da_reserva, horario_de_inicio, horario_de_fim) VALUES (?,?,?,?,?,?)";

        try{
            const resultado = await executarComandoSQL(query, [reserva.userId, reserva.salaId, reserva.dataDaSolicitacao, reserva.dataDaReserva, reserva.horarioInicio, reserva.horarioFim]);
            console.log("Reserva registrada com sucesso");
            reserva.id = resultado.insertId;
            return new Promise<Reserva>((resolve) => {
                resolve(reserva);
            })
        } catch (err: any) {
            console.log("Erro ao registrar reserva: ", err);
            throw err;
        }
    }

    async filtraReservaByUser(reserva: Reserva): Promise<Reserva[]> {

        const query = "SELECT * FROM Reservations where user_id = ?";

        try{
            const resultado = await executarComandoSQL(query, [reserva.userId]);
            console.log("Reservas filtradas com sucesso");
            return new Promise<Reserva[]>((resolve) => {
                resolve(resultado);
            })
        } catch (err: any) {
            console.log("Erro ao filtrar reservas: ", err);
            throw err;
        }
    }

    async filtraReservaBySala(id_sala: number): Promise<Reserva[]> {

        const query = "SELECT * FROM Reservations where sala_id = ?";

        try{
            const resultado = await executarComandoSQL(query, [id_sala]);
            console.log("Reservas filtradas com sucesso");
            return new Promise<Reserva[]>((resolve) => {
                resolve(resultado);
            })
        } catch (err: any) {
            console.log("Erro ao filtrar reservas: ", err);
            throw err;
        }
    }
}