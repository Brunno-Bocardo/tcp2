import { executarComandoSQL } from "../database/mysql";
import { User } from "../model/interfaces/IUser";
import { AbstractSubject } from "../patterns/observer/AbstractSubject";
import { LoggerObserver } from "../patterns/observer/LoggerObserver";

export class UserRepository extends AbstractSubject {
  private static instance: UserRepository;

  private constructor() {
    super();
    this.createTable();
    
    // Adicionar o LoggerObserver como observador
    const logger = LoggerObserver.getInstance();
    this.attach(logger);
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
      await executarComandoSQL(query, []);
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
      
      // Notificar observadores sobre a criação do usuário
      this.notify('criar_usuario', {
        id: user.id,
        nome: user.nome,
        email: user.email,
        curso: user.curso,
        tipo: user.tipo
      });
      
      return user;
    } catch (err: any) {
      console.error("Erro ao cadastrar Usuário: ", err);
      
      // Notificar observadores sobre o erro
      this.notify('erro_criar_usuario', {
        nome: user.nome,
        email: user.email,
        erro: err.message
      });
      
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
    let query = "SELECT * FROM tcp2_db.Users where email = ?";
    
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

  async listarUsuarios(): Promise<User[]> {
    let query = "SELECT * FROM tcp2_db.Users";

    try {
      const resultado = await executarComandoSQL(query, []);
      console.log("Usuários buscados com sucesso");
      return resultado;
    } catch (err: any) {
      console.error(`Falha ao listar usuários: ${err}`);
      throw err;
    }
  }
}
