import mysql, { Connection } from "mysql2";
import dotenv from "dotenv";

// Carrega as variáveis do arquivo .env
dotenv.config();

const dbConfig = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "admin",
  database: "tcp2_db",
};

// Função para criar o banco de dados, se não existir
async function criarBancoDeDados(): Promise<void> {
  const initialConnection: Connection = mysql.createConnection({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
  });

  initialConnection.connect((err) => {
    if (err) {
      console.error("Erro ao conectar ao MySQL:", err);
      throw err;
    }
    console.log("Conexão inicial com MySQL bem-sucedida!");

    initialConnection.query(
      `CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`,
      (err) => {
        if (err) {
          console.error("Erro ao criar o banco de dados:", err);
          throw err;
        }
        console.log(`Banco de dados '${dbConfig.database}' criado ou já existente.`);
        initialConnection.end(); // Fecha a conexão inicial após criar o banco
      }
    );
  });
}

// Conexão principal para usar o banco de dados
async function conectarAoBanco(): Promise<Connection> {
  await criarBancoDeDados(); // Garante que o banco foi criado antes de conectar
  const mysqlConnection: Connection = mysql.createConnection(dbConfig);

  mysqlConnection.connect((err) => {
    if (err) {
      console.error("Erro ao conectar ao banco de dados:", err);
      throw err;
    }
    console.log("Conexão bem-sucedida com o banco de dados MySQL");
  });

  return mysqlConnection;
}

// Exporta a função para executar comandos SQL
export async function executarComandoSQL(query: string, valores: any[]): Promise<any> {
  const mysqlConnection = await conectarAoBanco();
  return new Promise<any>((resolve, reject) => {
    mysqlConnection.query(query, valores, (err, resultado: any) => {
      if (err) {
        reject(err);
        throw err;
      }
      resolve(resultado);
    });
  });
}