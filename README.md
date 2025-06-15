# Sistema de Reserva de Salas

Projeto desenvolvido para a disciplina de Técnicas de Programação 2, implementando um sistema de reserva de salas com padrões de projeto e práticas modernas de desenvolvimento.

## 💡 Sobre o Projeto

Este sistema permite o gerenciamento de reservas de diferentes tipos de salas (Auditórios, Laboratórios e Salas de Aula), implementando:

- Frontend em React com TypeScript
- Backend em Node.js com TypeScript
- Banco de dados MySQL
- Padrões de Projeto
- Docker para ambiente de desenvolvimento

### Padrões de Projeto Implementados

- **Adapter**: Converte requisições JSON do frontend para XML (sistema legado)
- **Factory Method**: Criação de diferentes tipos de salas
- **Singleton**: Gerenciamento de conexão com banco de dados
-
-
-

## 🚀 Como Executar

### Pré-requisitos

- Docker Desktop instalado

### Executando

1. Clone o repositório:
```bash
git clone https://github.com/Brunno-Bocardo/tcp2.git
cd tcp2
code .
```

2. Crie o arquivo `.env` a partir do `.env.example`:
```bash
cp .env.example .env
```

3. Inicie os containers:
```bash
docker compose up -d
```
**OBS:** O Docker Desktop deve estar aberto

O projeto estará disponível em:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000


### Comandos do Docker

1. Iniciar containers
```bash
docker compose up -d
```

2. Iniciar containers com build -> usado para baixar novas dependencias (recriar)
```bash
docker compose up -d --build
```

3. Parar containers
```bash
docker compose down
```

4. Reiniciar containers -> atualizar código mais simples, como css ou lógicas
```bash
docker compose restart
```

5. Ver estado dos containers
```bash
docker ps
```

