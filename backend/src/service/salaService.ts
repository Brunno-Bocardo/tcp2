import { Sala } from "../model/interfaces/ISala";
import { CriadorAuditorio } from "../model/methodFactory/criadorAuditorio";
import { CriadorLaboratorio } from "../model/methodFactory/criadorLaboratorio";
import { CriadorSalaDeAula } from "../model/methodFactory/criadorSalaDeAula";
import { SalaRepository } from "../repository/salaRepository";

export class SalaService {
    private salaRepository = SalaRepository.getInstance();
    private CriadorAuditorio = new CriadorAuditorio();
    private CriadorLaboratorio = new CriadorLaboratorio();
    private CriadorSalaDeAula = new CriadorSalaDeAula();

    async registrarReserva(salaData: any): Promise<Sala> {
            const {numero, capacidadeMaxima, tipo} = salaData;

            let sala: Sala;

            //method factory
            if(tipo === "Auditorio"){
                sala = this.CriadorAuditorio.criarSala(numero, capacidadeMaxima);
            } else if (tipo === "Laboratorio") {
                sala = this.CriadorLaboratorio.criarSala(numero, capacidadeMaxima);
            } else {
                sala = this.CriadorSalaDeAula.criarSala(numero, capacidadeMaxima);
            }
    
            //Incluir verificações antes de registrar reserva
            
            const salaRegistrada = await this.salaRepository.cadastrarSala(sala);
            console.log("Sala Cadastrada", salaRegistrada)
            return new Promise<Sala>((resolve) => {
                resolve(salaRegistrada);
            });
        }
}