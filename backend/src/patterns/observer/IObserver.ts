export interface IObserver {
  update(evento: string, dados: any, usuarioId?: number): Promise<void>;
}