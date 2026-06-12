# Agenda Pro

Aplicação web completa de gestão de agenda para clientes, com controle de agendamentos, atendimentos e faturamento.

> **Dados simulados em memória** — sem banco de dados real. A estrutura está preparada para migração futura para PostgreSQL (ou similar) apenas substituindo a camada de repositórios.

---

## Funcionalidades

- **Agendamentos** — criar, editar, excluir e filtrar por data e status
- **Clientes** — cadastro completo com busca por nome, telefone ou e-mail
- **Serviços** — CRUD com nome, valor e tempo estimado
- **Atendimentos** — registro vinculado ao agendamento, com observações e upload de fotos (base64)
- **Faturamento** — dashboard com faturamento diário e mensal, gráficos e tabela detalhada com filtros de período

---

## Tecnologias

| Camada     | Tecnologias                                |
|------------|--------------------------------------------|
| Backend    | Node.js, Express, UUID                     |
| Frontend   | React 18, Vite, React Router DOM, Recharts |
| HTTP       | Axios                                      |
| Estilo     | CSS puro (design system próprio)           |

---

## Estrutura do projeto

```
agenda/
├── backend/
│   └── src/
│       ├── app.js                   # Entry point do servidor Express
│       ├── data/
│       │   └── db.js                # Mock de banco de dados (arrays em memória)
│       ├── repositories/            # Camada de acesso a dados (substituível por ORM)
│       │   ├── agendamentosRepository.js
│       │   ├── atendimentosRepository.js
│       │   ├── clientesRepository.js
│       │   └── servicosRepository.js
│       ├── services/                # Regras de negócio
│       │   ├── agendamentosService.js
│       │   ├── atendimentosService.js
│       │   ├── clientesService.js
│       │   ├── faturamentoService.js
│       │   └── servicosService.js
│       ├── controllers/             # Camada HTTP (request/response)
│       │   ├── agendamentosController.js
│       │   ├── atendimentosController.js
│       │   ├── clientesController.js
│       │   ├── faturamentoController.js
│       │   └── servicosController.js
│       └── routes/                  # Definição das rotas REST
│           ├── index.js
│           ├── agendamentos.js
│           ├── atendimentos.js
│           ├── clientes.js
│           ├── faturamento.js
│           └── servicos.js
│
└── frontend/
    └── src/
        ├── App.jsx                  # Rotas da aplicação
        ├── main.jsx                 # Entry point React
        ├── index.css                # Design system global
        ├── services/
        │   └── api.js               # Axios — funções de chamada à API
        ├── hooks/
        │   └── useApi.js            # Hooks genéricos para estado de requisição
        ├── components/
        │   ├── Layout/
        │   │   ├── Layout.jsx       # Estrutura da página com sidebar
        │   │   └── Sidebar.jsx      # Navegação lateral
        │   └── common/
        │       ├── Modal.jsx
        │       ├── ConfirmDialog.jsx
        │       ├── LoadingSpinner.jsx
        │       └── ErrorMessage.jsx
        └── pages/
            ├── Agenda.jsx
            ├── Clientes.jsx
            ├── Servicos.jsx
            ├── Atendimentos.jsx
            └── Faturamento.jsx
```

---

## Como rodar localmente

### Pré-requisitos

- Node.js 18+
- npm 9+

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/agenda.git
cd agenda
```

### 2. Instale as dependências

```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 3. Configure as variáveis de ambiente

```bash
# backend/.env
PORT=3001
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

```bash
# frontend/.env
VITE_API_URL=http://localhost:3001/api
```

### 4. Inicie os servidores

Em dois terminais separados:

```bash
# Terminal 1 — backend
cd backend && npm run dev
```

```bash
# Terminal 2 — frontend
cd frontend && npm run dev
```

Acesse em: **http://localhost:5173**

---

## Endpoints da API

Base URL: `http://localhost:3001/api`

| Método   | Rota                                        | Descrição                        |
|----------|---------------------------------------------|----------------------------------|
| `GET`    | `/clientes`                                 | Listar clientes                  |
| `POST`   | `/clientes`                                 | Criar cliente                    |
| `PUT`    | `/clientes/:id`                             | Atualizar cliente                |
| `DELETE` | `/clientes/:id`                             | Excluir cliente                  |
| `GET`    | `/servicos`                                 | Listar serviços                  |
| `POST`   | `/servicos`                                 | Criar serviço                    |
| `PUT`    | `/servicos/:id`                             | Atualizar serviço                |
| `DELETE` | `/servicos/:id`                             | Excluir serviço                  |
| `GET`    | `/agendamentos`                             | Listar agendamentos (com filtros)|
| `POST`   | `/agendamentos`                             | Criar agendamento                |
| `PUT`    | `/agendamentos/:id`                         | Atualizar agendamento            |
| `DELETE` | `/agendamentos/:id`                         | Excluir agendamento              |
| `GET`    | `/atendimentos`                             | Listar atendimentos              |
| `POST`   | `/atendimentos`                             | Registrar atendimento            |
| `GET`    | `/atendimentos/agendamento/:agendamentoId`  | Buscar atendimento por agendamento |
| `PUT`    | `/atendimentos/:id`                         | Atualizar atendimento            |
| `DELETE` | `/atendimentos/:id`                         | Excluir atendimento              |
| `GET`    | `/faturamento/resumo`                       | Resumo diário e mensal           |
| `GET`    | `/faturamento/diario`                       | Faturamento dia a dia            |
| `GET`    | `/faturamento/mensal`                       | Faturamento mês a mês            |
| `GET`    | `/faturamento/detalhado`                    | Lista de atendimentos com valores|

---

## Modelo de dados

```
Cliente         { id, nome, telefone, email }
Serviço         { id, nome, valor, tempoMinutos }
Agendamento     { id, clienteId, servicoId, dataHora, observacoes, status }
Atendimento     { id, agendamentoId, fotos[], observacoes }
```

---

## Evolução futura

A camada de **repositórios** (`backend/src/repositories/`) foi desenhada para ser o único ponto de troca ao migrar para um banco de dados real.

Passos para migrar para PostgreSQL:

1. Instalar o ORM desejado (ex: Prisma, Knex ou TypeORM)
2. Criar os schemas equivalentes ao modelo acima
3. Substituir as implementações em cada `*Repository.js` por queries do ORM
4. Services e controllers **não precisam de alteração**
