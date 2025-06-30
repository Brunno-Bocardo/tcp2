import { executarComandoSQL } from "../database/mysql";
import { Reserva } from "../model/classes/Reserva";
import { AbstractSubject } from "../patterns/observer/AbstractSubject";
import { LoggerObserver } from "../patterns/observer/LoggerObserver";


export class ReservaRepository extends AbstractSubject {
  private static instance: ReservaRepository;

  private constructor() {
    super();
    this.createTable();
    
    // Adicionar o LoggerObserver como observador
    const logger = LoggerObserver.getInstance();
    this.attach(logger);
  }

  public static getInstance(): ReservaRepository {
    if (!this.instance) {
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
            FOREIGN KEY (sala_id) REFERENCES Rooms(id),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`;

    try {
      await executarComandoSQL(query, []);
    } catch (err) {
      console.error("Erro ao criar tabela Reservas:", err);
      throw err;
    }
  }

  async inserirReserva(reserva: Reserva): Promise<Reserva> {
    const query = `
      INSERT INTO tcp2_db.Reservations 
      (user_id, sala_id, data_da_solicitacao, data_da_reserva, horario_de_inicio, horario_de_fim)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    try {
        const resultado = await executarComandoSQL(query, [
            reserva.userId,
            reserva.salaId,
            reserva.dataDaSolicitacao,
            reserva.dataDaReserva,
            reserva.horarioInicio,
            reserva.horarioFim
        ]);
        console.log("Reserva inserida com sucesso");
        reserva.id = resultado.insertId;
        
        // Notificar observadores sobre a criação da reserva
        this.notify('criar_reserva', reserva, reserva.userId);
        
        return new Promise<Reserva>((resolve) => {
            resolve(reserva);
        })
    } catch (err: any) {
        console.error("Erro ao cadastrar reserva:", err);
        
        // Notificar observadores sobre o erro
        this.notify('erro_criar_reserva', {
            ...reserva,
            erro: err.message
        }, reserva.userId);
        
        throw err;
    }
  }

  async listarReservasPorSalaEData(salaId: number, data: string): Promise<Reserva[]> {
    const query = "SELECT * FROM tcp2_db.Reservations WHERE sala_id = ? AND data_da_reserva = ?";
    try {
      const resultado = await executarComandoSQL(query, [salaId, data]);
      return new Promise<Reserva[]>((resolve) => {
        resolve(resultado);
      })
    } catch (err: any) {
      console.error("Erro ao listar reservas por sala e data");
      throw err;
    }
  }

  async listarReservas(): Promise<Reserva[]> {
    const query = "SELECT * FROM tcp2_db.Reservations";

    try {
      const resultado = await executarComandoSQL(query, []);
      console.log("Reservas listadas com sucesso");
      return new Promise<Reserva[]>((resolve) => {
        resolve(resultado);
      })
    } catch (err: any) {
      console.error("Erro ao listar reservas");
      throw err;
    }
  }
}