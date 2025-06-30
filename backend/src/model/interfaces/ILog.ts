export interface ILog {
  id?: number;
  evento: string;
  descricao: string;
  usuario_id?: number;
  data_hora: Date;
  dados: string;
}