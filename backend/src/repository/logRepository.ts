import { executarComandoSQL } from "../database/mysql";
import { ILog } from "../model/interfaces/ILog";

export class LogRepository {
  private static instance: LogRepository;

  private constructor() {
    this.createTable();
  }

  public static getInstance(): LogRepository {
    if (!this.instance) {
      this.instance = new LogRepository();
    }
    return this.instance;
  }

  private async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS tcp2_db.Logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        evento VARCHAR(255) NOT NULL,
        descricao TEXT NOT NULL,
        usuario_id INT,
        data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        dados TEXT,
        FOREIGN KEY (usuario_id) REFERENCES tcp2_db.Users(id) ON DELETE SET NULL
      )`;

    try {
      await executarComandoSQL(query, []);
    } catch (err) {
      console.error("Erro ao criar tabela Logs:", err);
      throw err;
    }
  }

  async inserirLog(log: ILog): Promise<ILog> {
    const query = `
      INSERT INTO tcp2_db.Logs 
      (evento, descricao, usuario_id, dados)
      VALUES (?, ?, ?, ?)
    `;

    try {
      const resultado = await executarComandoSQL(query, [
        log.evento,
        log.descricao,
        log.usuario_id || null,
        log.dados || null
      ]);
      console.log("Log registrado com sucesso");
      
      log.id = resultado.insertId;
      return log;
    } catch (err) {
      console.error("Erro ao registrar log:", err);
      throw err;
    }
  }

  async listarLogs(limite: number, offset: number): Promise<ILog[]> {
    const query = `
      SELECT * FROM tcp2_db.Logs ORDER BY data_hora DESC LIMIT ${Number(limite)} OFFSET ${Number(offset)}`;

    try {
      const logs = await executarComandoSQL(query, []);
      return new Promise<ILog[]>((resolve) => {
        resolve(logs);
      })
    } catch (err) {
      console.error("Erro ao listar logs");
      throw err;
    }
  }

  async buscarLogsPorEvento(evento: string): Promise<ILog[]> {
    const query = `
      SELECT * FROM tcp2_db.Logs 
      WHERE evento = ?
      ORDER BY data_hora DESC
    `;

    try {
      const logs = await executarComandoSQL(query, [evento]);
      return new Promise<ILog[]>((resolve) => {
        resolve(logs);
      })
    } catch (err) {
      console.error("Erro ao buscar logs por evento");
      throw err;
    }
  }

  async buscarLogsPorUsuario(usuarioId: number): Promise<ILog[]> {
    const query = `
      SELECT * FROM tcp2_db.Logs 
      WHERE usuario_id = ?
      ORDER BY data_hora DESC
    `;

    try {
      const logs = await executarComandoSQL(query, [usuarioId]);
      return new Promise<ILog[]>((resolve) => {
        resolve(logs);
      })
    } catch (err) {
      console.error("Erro ao buscar logs por usuário");
      throw err;
    }
  }
}