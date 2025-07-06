import { ISala } from "../model/interfaces/ISala";
import { CriadorAuditorio } from "../patterns/methodFactory/criadorAuditorio";
import { CriadorLaboratorio } from "../patterns/methodFactory/criadorLaboratorio";
import { CriadorSalaDeAula } from "../patterns/methodFactory/criadorSalaDeAula";
import { SalaRepository } from "../repository/salaRepository";

export class SalaService {
    private salaRepository = SalaRepository.getInstance();
    private CriadorAuditorio = new CriadorAuditorio();
    private CriadorLaboratorio = new CriadorLaboratorio();
    private CriadorSalaDeAula = new CriadorSalaDeAula();

    async cadastrarSala(salaData: any): Promise<ISala> {
        const {numero, capacidadeMaxima, tipo} = salaData;

        if (!numero || !capacidadeMaxima || !tipo) {
            throw new Error("Dados incompletos da sala");
        }

        let sala: ISala;

        //method factory
        if(tipo === "Auditorio"){
            sala = this.CriadorAuditorio.criarSala(0, numero, capacidadeMaxima);
        } else if (tipo === "Laboratorio") {
            sala = this.CriadorLaboratorio.criarSala(0, numero, capacidadeMaxima);
        } else {
            sala = this.CriadorSalaDeAula.criarSala(0, numero, capacidadeMaxima);
        }

        //Incluir verificações antes de registrar reserva
        
        const salaRegistrada = await this.salaRepository.cadastrarSala(sala);
        console.log("Sala Cadastrada", salaRegistrada)
        return new Promise<ISala>((resolve) => {
            resolve(salaRegistrada);
        });
    }

    async filtrarSalaPorId(salaId: string): Promise<ISala>{

        if(!salaId){
            throw new Error(`ID ${salaId} inválido`)
        }
        
        const id = parseInt(salaId);

        const sala = await this.salaRepository.filtrarSalaById(id)

        if(!sala) {
            throw new Error("Sala não localizada");
        }

        console.log("Sala encontrada com sucesso");
        return new Promise<ISala>((resolve) => {
            resolve(sala)
        });
    }

    async atualizarSala(salaData: any): Promise<ISala>{
        const {salaId, numero, capacidadeMaxima, tipo} = salaData;

        if (!salaId || !numero || !capacidadeMaxima || !tipo) {
            throw new Error("Dados incompletos da sala");
        }

        const salaExiste = await this.salaRepository.filtrarSalaById(salaId)
        if(!salaExiste){
            throw new Error(`Sala com ID ${salaId} não encontrada`);
        }

        let sala: ISala;

        //method factory
        if(tipo === "Auditorio"){
            sala = this.CriadorAuditorio.criarSala(salaId, numero, capacidadeMaxima);
        } else if (tipo === "Laboratorio") {
            sala = this.CriadorLaboratorio.criarSala(salaId, numero, capacidadeMaxima);
        } else {
            sala = this.CriadorSalaDeAula.criarSala(salaId, numero, capacidadeMaxima);
        }

        await this.salaRepository.atualizarSala(sala);
        console.log("Sala atualizada");
        return new Promise<ISala>((resolve) => {
            resolve(sala)
        });
    }
          

    async deletarSala(salaData:any) {
        const {salaId, numero, capacidadeMaxima, tipo} = salaData;

        if (!salaId || !numero || !capacidadeMaxima || !tipo) {
            throw new Error("Dados incompletos da sala");
        }

        const salaExiste = await this.salaRepository.filtrarSalaById(salaId)
        if(!salaExiste){
            throw new Error(`Sala com ID ${salaId} não encontrada`);
        }

        let sala: ISala;

        //method factory
        if(tipo === "Auditorio"){
            sala = this.CriadorAuditorio.criarSala(salaId, numero, capacidadeMaxima);
        } else if (tipo === "Laboratorio") {
            sala = this.CriadorLaboratorio.criarSala(salaId, numero, capacidadeMaxima);
        } else {
            sala = this.CriadorSalaDeAula.criarSala(salaId, numero, capacidadeMaxima);
        }

        await this.salaRepository.deletarSala(sala);
        console.log("Sala excluida");
        return new Promise<ISala>((resolve) => {
            resolve(sala)
        });
    }

    async filtrarSalas(): Promise<ISala[]> {
        const salas = await this.salaRepository.filtrarSalas();
        console.log("Salas filtradas", salas);
        return salas;
    }
}