import { ProfessorFactory } from "../patterns/abstractFactory/professorFactory";
import { CoordenadorFactory } from "../patterns/abstractFactory/coordenadorFactory";
import { CriadorAuditorio } from "../patterns/methodFactory/criadorAuditorio";
import { CriadorLaboratorio } from "../patterns/methodFactory/criadorLaboratorio";
import { CriadorSalaDeAula } from "../patterns/methodFactory/criadorSalaDeAula";
import { ReservaRepository } from "../repository/reservaRepository";
import { SalaRepository } from "../repository/salaRepository";
import { UserRepository } from "../repository/userRepository";
import { LogRepository } from "../repository/logRepository";
import { criarBancoDeDados, inicializarPool } from "./mysql";


export async function inicializarSistema() {
  try {
    console.log("Iniciando configuração do sistema...");

    // 1. Criar banco de dados se não existir
    await criarBancoDeDados();

    // 2. Inicializar pool de conexões
    await inicializarPool();

    // 3. Inicializar tabelas e dados
    await inicializarTabelasEDados();

    // 4. Iniciar servidor após configuração
    
  } catch (error) {
    console.error("Erro fatal durante a inicialização do sistema:", error);
    process.exit(1);
  }
}


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
    UserRepository.getInstance();
    await new Promise(resolve => setTimeout(resolve, 2500)); // Pequena pausa para garantir que a tabela foi criada
    
    SalaRepository.getInstance();
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    ReservaRepository.getInstance();
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    LogRepository.getInstance();
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
        criadorAuditorio.criarSala(0, 101, 100),
        criadorLaboratorio.criarSala(1, 202, 25),
        criadorSalaDeAula.criarSala(2, 303, 35),
        criadorLaboratorio.criarSala(3, 404, 20)
    ];
    
    // Inserir salas no banco
    for (const sala of salas_padrao) {
        await salaRepository.cadastrarSala(sala);
    }
}
