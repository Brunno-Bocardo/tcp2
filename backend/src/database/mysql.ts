import mysql, { Connection, Pool, PoolConnection } from "mysql2/promise";


const dbConfig = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "1234",
  database: "tcp2_db",
};

// Pool de conexões para reutilização
let pool: Pool | null = null;

// Função para criar o banco de dados, se não existir
export async function criarBancoDeDados(): Promise<void> {
  try {
    // Criar conexão sem especificar banco de dados
    const initialConnection = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
    });

    console.log("Conexão inicial com MySQL bem-sucedida!");

    // Criar o banco de dados se não existir
    await initialConnection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    console.log(`Banco de dados '${dbConfig.database}' criado ou já existente.`);

    // Fechar conexão inicial
    await initialConnection.end();
  } catch (error) {
    console.error("Erro ao criar banco de dados:", error);
    throw error;
  }
}

// Inicializa o pool de conexões
export async function inicializarPool(): Promise<void> {
  try {
    if (!pool) {
      pool = mysql.createPool({
        host: dbConfig.host,
        port: dbConfig.port,
        user: dbConfig.user,
        password: dbConfig.password,
        database: dbConfig.database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });
      console.log("Pool de conexões inicializado com sucesso!");
    }
  } catch (error) {
    console.error("Erro ao inicializar pool de conexões:", error);
    throw error;
  }
}

// Função para executar comandos SQL
export async function executarComandoSQL(query: string, valores: any[]): Promise<any> {
  try {
    // Certifique-se de que o pool foi inicializado
    if (!pool) {
      await inicializarPool();
    }

    // Executar a query
    const [resultado] = await pool!.execute(query, valores);
    return resultado;
  } catch (error) {
    console.error(`Erro ao executar query: ${query}`, error);
    throw error;
  }
}