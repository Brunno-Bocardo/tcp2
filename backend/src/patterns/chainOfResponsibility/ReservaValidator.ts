import { AbstractValidator } from "./AbstractValidator";

export class ReservaValidator extends AbstractValidator {
    public validate(request: any): void {
        const {solicitanteId, userId, salaId, dataSolicitacao, dataReserva, horarioInicio, horarioFim} = request

        if(!solicitanteId || !userId || !salaId || !dataSolicitacao || !dataReserva || !horarioInicio || !horarioFim) {
            throw new Error("Dados da reserva incompletos")
        }

        super.validate(request);
    }
}