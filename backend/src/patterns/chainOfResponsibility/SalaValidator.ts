import { SalaRepository } from "../../repository/salaRepository";
import { AbstractValidatorAsync } from "./AbstractValidatorAsync";

export class SalaValidator extends AbstractValidatorAsync {
    private salaRepository = SalaRepository.getInstance();

    public async validate(request: any): Promise<void> {
        const {sala_id: salaId} = request;

        console.log("Verificando sala");

        if(!salaId || isNaN(parseInt(salaId))) {
            throw new Error(`O ID informado não é válido`);
        }

        const sala = await this.salaRepository.filtrarSalaById(parseInt(salaId));

        if(!sala) {
            throw new Error(`Sala com ID ${salaId} não encontrado`);
        }

    }
}