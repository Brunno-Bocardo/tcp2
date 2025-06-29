import { executarComandoSQL } from "../database/mysql";

export interface Log {
  id?: number;
  evento: string;
  descricao: string;
  usuario_id?: number;
  data_hora: Date;
  dados: string;
}

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
      const resultado = await executarComandoSQL(query, []);
    } catch (err) {
      console.error("Erro ao criar tabela Logs:", err);
      throw err;
    }
  }

  async inserirLog(log: Log): Promise<Log> {
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

  async listarLogs(limite: number = 100, offset: number = 0): Promise<Log[]> {
    const query = `
      SELECT * FROM tcp2_db.Logs 
      ORDER BY data_hora DESC 
      LIMIT ? OFFSET ?
    `;

    try {
      const logs = await executarComandoSQL(query, [limite, offset]);
      return logs as Log[];
    } catch (err) {
      console.error("Erro ao listar logs:", err);
      return [];
    }
  }

  async buscarLogsPorEvento(evento: string): Promise<Log[]> {
    const query = `
      SELECT * FROM tcp2_db.Logs 
      WHERE evento = ?
      ORDER BY data_hora DESC
    `;

    try {
      const logs = await executarComandoSQL(query, [evento]);
      return logs as Log[];
    } catch (err) {
      console.error("Erro ao buscar logs por evento:", err);
      return [];
    }
  }

  async buscarLogsPorUsuario(usuarioId: number): Promise<Log[]> {
    const query = `
      SELECT * FROM tcp2_db.Logs 
      WHERE usuario_id = ?
      ORDER BY data_hora DESC
    `;

    try {
      const logs = await executarComandoSQL(query, [usuarioId]);
      return logs as Log[];
    } catch (err) {
      console.error("Erro ao buscar logs por usuário:", err);
      return [];
    }
  }
}