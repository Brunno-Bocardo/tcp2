import { parse, isValid, format} from 'date-fns';

export class Reserva {
    id: number;
    userId: number;
    salaId: number;
    dataDaSolicitacao: Date;
    dataDaReserva: Date;
    horarioInicio: string;
    horarioFim: string;

  constructor(dataSolicitacao: string, dia: string, inicio: string, fim: string, id?: number, userId?: number, salaId?: number) {
    this.id = id || 0;
    this.userId = userId || 0;
    this.salaId = salaId || 0;
    this.dataDaSolicitacao = this.formatadorDeData(dataSolicitacao);
    this.dataDaReserva = this.formatadorDeData(dia);
    this.horarioInicio = this.formatadorDeTempo(inicio);
    this.horarioFim = this.formatadorDeTempo(fim);
  }

  formatadorDeData(data:string): Date {
    const dataConvertida = parse(data, 'dd/MM/yyyy', new Date());

    if (!isValid(dataConvertida)) {
      throw new Error(`Data inválida: ${data}`);
    }

    return dataConvertida;
  }

  formatadorDeTempo(tempo:string){
    const tempoConvertido = parse(tempo, "HH:mm", new Date());

    if (!isValid(tempoConvertido)) {
      throw new Error(`Horário inválido: ${tempo}`);
    }

    return format(tempoConvertido, "HH:mm:ss");
  }
}