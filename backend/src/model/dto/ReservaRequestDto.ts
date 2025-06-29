export class ReservaRequestDto {
    userId: number;
    salaId: number;
    dataDaSolicitacao: string;
    dataDaReserva: string;
    horarioInicio: string;
    horarioFim: string;

  constructor(userId?: number, salaId?: number, dataSolicitacao?: string, dia?: string, inicio?: string, fim?: string) {
    this.userId = userId || 0;
    this.salaId = salaId || 0;
    this.dataDaSolicitacao = dataSolicitacao || "";
    this.dataDaReserva = dia || "";
    this.horarioInicio = inicio || "";
    this.horarioFim = fim || "";
  }
}