import { IObserver } from "./IObserver";

export interface ISubject {
  // Adiciona um observador à lista de observadores
  attach(observer: IObserver): void;
  
  // Remove um observador da lista de observadores
  detach(observer: IObserver): void;
  
  // Notifica todos os observadores sobre um evento
  notify(evento: string, dados: any, usuarioId?: number): void;
}