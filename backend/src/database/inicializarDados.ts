import { UserRepository } from "../repository/userRepository";
import { SalaRepository } from "../repository/salaRepository";
import { ProfessorFactory } from "../patterns/abstractFactory/professorFactory";
import { CoordenadorFactory } from "../patterns/abstractFactory/coordenadorFactory";
import { CriadorAuditorio } from "../patterns/methodFactory/criadorAuditorio";
import { CriadorLaboratorio } from "../patterns/methodFactory/criadorLaboratorio";
import { CriadorSalaDeAula } from "../patterns/methodFactory/criadorSalaDeAula";
import { ReservaRepository } from "../repository/reservaRepository";
import { LogRepository } from "../repository/logRepository";


export async function inicializarDados() {
    console.log("Verificando necessidade de inicializar dados padrão...");
    
    // Inicializar usuários padrão se necessário
    await inicializarUsuariosPadrao();
    console.log("Usuários padrão criados...");
    
    // Inicializar salas padrão se necessário
    await inicializarSalasPadrao();
    console.log("Salas padrão criadas...");
}

export async function inicializarTabelasEDados() {
  try {
    console.log("Inicializando tabelas...");
    
    // Primeiro criar todas as tabelas
    const userRepo = UserRepository.getInstance();
    await new Promise(resolve => setTimeout(resolve, 2500)); // Pequena pausa para garantir que a tabela foi criada
    
    const salaRepo = SalaRepository.getInstance();
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const reservaRepo = ReservaRepository.getInstance();
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const logRepo = LogRepository.getInstance();
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    console.log("Tabelas inicializadas com sucesso!");
    
    // Depois inicializar os dados
    await inicializarDados();
    
    console.log("Sistema totalmente inicializado!");
  } catch (error) {
    console.error("Erro ao inicializar tabelas:", error);
    throw error;
  }
}


async function inicializarUsuariosPadrao() {
    const userRepository = UserRepository.getInstance();
    // Verificar se já existem usuários no banco
    const usuarios = await userRepository.listarUsuarios();
    
    if (usuarios && usuarios.length > 0) {
        console.log("Usuários já existem, pulando inicialização de usuários padrão");
        return;
    } else {
        console.log("Nenhum usuário encontrado, iniciando criação de usuários padrão...");
    }
    
    // Criar usuários padrão
    const professorFactory = new ProfessorFactory();
    const coordenadorFactory = new CoordenadorFactory();
    const usuarios_padrao = [
        professorFactory.criarUsuario("Andriel", "andriel@gmail.com", "Redes", "1234"),
        professorFactory.criarUsuario("Brunno", "brunno@gmail.com", "Estrutura de Dados", "1234"),
        coordenadorFactory.criarUsuario("Flavia", "flavia@gmail.com", "Banco de Dados", "1234")
    ];
    
    // Inserir usuários no banco
    for (const usuario of usuarios_padrao) {
        await userRepository.inserirUsuario(usuario);
    }
}


async function inicializarSalasPadrao() {
    const salaRepository = SalaRepository.getInstance();
    // Verificar se já existem salas no banco
    const salas = await salaRepository.filtrarSalas();
    
    if (salas && salas.length > 0) {
        console.log("Salas já existem, pulando inicialização de salas padrão");
        return;
    } else {
        console.log("Nenhuma sala encontrada, iniciando criação de salas padrão...");
    }
    
    // Criar salas padrão
    const criadorAuditorio = new CriadorAuditorio();
    const criadorLaboratorio = new CriadorLaboratorio();
    const criadorSalaDeAula = new CriadorSalaDeAula();
    const salas_padrao = [
        criadorAuditorio.criarSala(101, 100),
        criadorLaboratorio.criarSala(202, 25),
        criadorSalaDeAula.criarSala(303, 35),
        criadorLaboratorio.criarSala(404, 20)
    ];
    
    // Inserir salas no banco
    for (const sala of salas_padrao) {
        await salaRepository.cadastrarSala(sala);
    }
}
