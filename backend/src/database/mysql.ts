import mysql, { Connection } from "mysql2";

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "ifsp",
  database: process.env.DB_NAME || "tcp2_db",
};

const mysqlConnection: Connection = mysql.createConnection(dbConfig);

mysqlConnection.connect((err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err);
    throw err;
  }
  console.log("Conexão bem-sucedida com o banco de dados MySQL");
});

export function executarComandoSQL(query: string, valores: any[]): Promise<any> {
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