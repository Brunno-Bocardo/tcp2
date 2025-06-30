import { IObserver } from "./IObserver";
import { ISubject } from "./ISubject";

// Classe abstrata que implementa os métodos básicos de Subject
// Fornece uma implementação padrão para gerenciar e notificar observadores
export abstract class AbstractSubject implements ISubject {
  private observers: IObserver[] = [];
  
  /**
   * Adiciona um observador à lista de observadores
   * @param observer - O observador a ser adicionado
   */
  public attach(observer: IObserver): void {
    const isExist = this.observers.includes(observer);
    if (!isExist) {
      this.observers.push(observer);
    } else {
      console.log('Observer já existe na lista');
    }
  }
  
  /**
   * Remove um observador da lista de observadores
   * @param observer - O observador a ser removido
   */
  public detach(observer: IObserver): void {
    const observerIndex = this.observers.indexOf(observer);
    if (observerIndex !== -1) {
      this.observers.splice(observerIndex, 1);
      console.log('Observer removido com sucesso');
    } else {
      console.log('Observer não encontrado na lista');
    }
  }
  
  /**
   * Notifica todos os observadores sobre um evento
   * @param evento - Tipo de evento ocorrido
   * @param dados - Dados relacionados ao evento
   * @param usuarioId - ID do usuário que executou a ação (se aplicável)
   */
  public notify(evento: string, dados: any, usuarioId?: number): void {
    console.log(`Notificando ${this.observers.length} observadores sobre: ${evento}`);
    
    for (const observer of this.observers) {
      observer.update(evento, dados, usuarioId).catch(err => {
        console.error(`Erro ao notificar observer sobre evento ${evento}:`, err);
      });
    }
  }
}