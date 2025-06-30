# Sistema de Reserva de Salas

Projeto desenvolvido para a disciplina de Técnicas de Programação 2, implementando um sistema de reserva de salas com padrões de projeto e práticas modernas de desenvolvimento.

## Sobre o Projeto

Este sistema permite o gerenciamento de reservas de diferentes tipos de salas (Auditórios, Laboratórios e Salas de Aula), implementando:

- Frontend em React com TypeScript
- Backend em Node.js com TypeScript
- Banco de dados MySQL
- Padrões de Projeto
- Docker para ambiente de desenvolvimento

### Padrões de Projeto Implementados

- **Factory Method**: Criação de diferentes tipos de salas
- **Abstract Factory**: Fabrica diferentes tipos de usuário
- **Proxy**: Cria uma camada de segurança ao realizar o login


## Como Executar


1. Clone o repositório:
```bash
git clone https://github.com/Brunno-Bocardo/tcp2.git
cd tcp2
code .
```

2. Baixe as dependências no diretório raiz:
```bash
npm i
```

3. Entre no diretório do frontend, baixe as dependências, e o inicie:
```bash
cd frontend
npm i
npm run start
```

4. Abra o MySQL Workbench, e garanta que ele está funcionando. Em seguida, configure no arquivo `mysql.ts`, as configurações de conexão (user e senha).


5. Em outro terminal, entre no diretório do backend, baixe as dependências, dê build no projeto e o inicie:
```bash
cd backend
npm i
npm run build
npm run dev
```




