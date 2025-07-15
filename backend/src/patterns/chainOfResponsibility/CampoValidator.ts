import { AbstractValidator } from "./AbstractValidator";

export class CampoValidator extends AbstractValidator {
    public validate(request: any): void {
        const {email} = request
        const {numero} = request

        if(email) {
            const { nome, email, curso, senha, tipo } = request
            if(!nome || !email || !curso || !senha || !tipo){
                throw new Error("Dados do usuário incompletos");
            }
        } else if (numero) {
            const {numero, capacidadeMaxima, tipo} = request
            if (!numero || !capacidadeMaxima || !tipo) {
                throw new Error("Dados incompletos da sala");
            }
        } else {
            const {
                solicitante_id: solicitanteId, 
                user_id: userId, 
                sala_id: salaId, 
                data_da_solicitacao: dataSolicitacao, 
                data_da_reserva: dataReserva, 
                horario_inicio: horarioInicio,
                horario_fim: horarioFim
            } = request

            if(!solicitanteId || !userId || !salaId || !dataSolicitacao || !dataReserva || !horarioInicio || !horarioFim) {
                throw new Error("Dados da reserva incompletos")
            }
        }

        super.validate(request);
    }
}