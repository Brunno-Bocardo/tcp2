import { executarComandoSQL } from "../database/mysql";
import { User } from "../model/interfaces/IUser";

export class UserRepository {
  private static instance: UserRepository;

  constructor() {
    this.createTable();
  }

  public static getInstance(): UserRepository {
    if (!this.instance) {
      this.instance = new UserRepository();
    }
    return this.instance;
  }

  private async createTable() {
    const query = `
        CREATE TABLE IF NOT EXISTS tcp2_db.Users
        (
            id INT AUTO_INCREMENT PRIMARY KEY,
            nome VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            curso VARCHAR(255) NOT NULL,
            senha VARCHAR(255) NOT NULL,
            tipo VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )`;

    try {
      const resultado = await executarComandoSQL(query, []);
      console.log("Query executada com sucesso: ", resultado);
    } catch (err) {
      console.error("Error");
    }
  }

  async inserirUsuario(user: User): Promise<User> {
    const query =
      "INSERT INTO tcp2_db.Users(nome, email, curso, senha, tipo) VALUES (?,?,?,?,?)";

    try {
      const resultado = await executarComandoSQL(query, [
        user.nome,
        user.email,
        user.curso,
        user.senha,
        user.tipo,
      ]);
      console.log("Usuario cadastrado com sucesso");
      user.id = resultado.insertId;
      return new Promise<User>((resolve) => {
        resolve(user);
      });
    } catch (err: any) {
      console.error("Erro ao cadastrar Usuário: ", err);
      throw err;
    }
  }

  async filtraUsuarioById(id?: number): Promise<User> {
    let query = "SELECT * FROM tcp2_db.Users where id = ?";

    try {
      const resultado = await executarComandoSQL(query, [id]);
      console.log("Busca efetuada com sucesso: ", resultado);
      return new Promise<User>((resolve) => {
        resolve(resultado);
      });
    } catch (err: any) {
      console.error(`Falha ao procurar usuario gerando o erro: ${err}`);
      throw err;
    }
  }

  async filtraUsuarioByName(name?: number): Promise<User> {
    let query = "SELECT * FROM tcp2_db.Users where nome = ?";

    try {
      const resultado = await executarComandoSQL(query, [name]);
      console.log("Busca efetuada com sucesso: ", resultado);
      return new Promise<User>((resolve) => {
        resolve(resultado);
      });
    } catch (err: any) {
      console.error(`Falha ao procurar usuario gerando o erro: ${err}`);
      throw err;
    }
  }
  

  async filtraUsuarioByEmail(email?: string): Promise<User | undefined> {
    let query = "SELECT * FROM tcp2_db.users where email = ?";
    
    console.log("Email, ", email);

    try {
      const resultado = await executarComandoSQL(query, [email]);
      console.log("Busca efetuada com sucesso: ", resultado);
      
      // Verifica se há resultados e retorna o primeiro
      if (resultado) {
        return resultado[0];
      }
    } catch (err: any) {
      console.error(`Falha ao procurar usuario gerando o erro: ${err}`);
      throw err;
    }
  }
}
