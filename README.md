# Sistema de Comissionamento

Aplicação web desenvolvida para o desafio de sistema de comissionamento de vendas. O sistema permite o gerenciamento de usuários e vendedores, registro de vendas com cálculo automático de comissões (baseado em regras de negócio específicas) e visualização de relatórios de desempenho.

## 🚀 Tecnologias e Decisões Técnicas

O desafio propôs originalmente TypeScript + AdonisJS para o backend. Optei por utilizar uma stack moderna baseada em **Bun** e **ElysiaJS** pelas seguintes razões:

- **Performance**: O runtime Bun e o framework Elysia oferecem performance superior.
- **Type Safety (End-to-End)**: Utilização do `@elysiajs/eden` para compartilhar tipos automaticamente entre backend e frontend, garantindo integridade dos dados e DX superior.
- **Simplicidade**: Arquitetura leve e focada em performance.

### Stack Completa

**Backend** (`apps/backend`)

- **Language**: TypeScript
- **Runtime**: [Bun](https://bun.sh/)
- **Framework**: [ElysiaJS](https://elysiajs.com/)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/) (PostgreSQL)
- **Validation**: Zod
- **Auth**: Better Auth

**Frontend** (`apps/frontend`)

- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **UI Library**: [Chakra UI v3](https://www.chakra-ui.com/)
- **State Management**: Zustand + TanStack Query
- **Charts**: Recharts
- **Routing**: React Router

**Estrutura**

- **Monorepo**: Gerenciado via Bun Workspaces.

## ✨ Funcionalidades Implementadas

- ✅ **Login e Autenticação**: Sistema seguro de login.
- ✅ **Cadastro de Usuários**: Gerenciamento de acesso.
- ✅ **Cadastro de Vendedores**: Registro completo com regras de comissão (percentual e fixa).
- ✅ **Registro de Vendas**: Inserção de vendas vinculadas a vendedores.
- ✅ **Cálculo Automático de Comissões**:
  - Aplicação das regras de comissão do vendedor (Fixa/Percentual).
  - Cálculo da comissão do gerente baseada nas regras de negócio.
- ✅ **Dashboard Interativo**:
  - Cards com resumo de vendas e comissões.
  - Lista de vendas recentes.
- ✅ **Relatórios Visuais**:
  - Gráfico de Evolução de Vendas (30 dias).
  - Ranking de Vendedores.
  - Distribuição de Comissão (Vendedor vs Gerente).

## 🛠️ Como Rodar o Projeto

### Pré-requisitos

- [Bun](https://bun.sh/) instalado.
- [PostgreSQL](https://www.postgresql.org/) rodando (local ou Docker).

### Passo a Passo

1.  **Clone o repositório**

    ```bash
    git clone `https://github.com/rafaelsell/sances-commission.git`
    cd sances-commission
    ```

2.  **Instale as dependências**
    Na raiz do projeto:

    ```bash
    bun install
    ```

3.  **Configuração do Banco de Dados (Backend)**

        **Opção A: Rodar via Docker (Recomendado)**
        Dentro de `apps/backend`, execute:

        ```bash
        docker-compose up -d
        ```

        Isso subirá o container do PostgreSQL configurado para o projeto.

        **Opção B: Manual**
        Se preferir rodar um Postgres localmente, crie um arquivo `.env` em `apps/backend/` com as credenciais:

        ```env
        PORT=8888
        NODE_ENV=development
        POSTGRES_USER=postgres
        POSTGRES_PASSWORD=postgres
        POSTGRES_DB=sances_commission
        POSTGRES_HOST=localhost
        POSTGRES_PORT=5432
        DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sances_commission?schema=public"
        BETTER_AUTH_SECRET=seu_segredo_aqui
        BETTER_AUTH_URL=http://localhost:8888
        ```

4.  **Execute as Migrations**
    Dentro de `apps/backend`:

    bun db:generate
    bun db:migrate

    Voce pode acessar o Drizzle Studio com bun run db:studio para visualizar o banco de dados.

    ```bash
    bun run dev
    ```

    - Backend rodará em: `http://localhost:8888`
    - Frontend rodará em: `http://localhost:5173`

## 📁 Estrutura do Projeto

```
sances-commission/
├── apps/
│   ├── backend/                # API ElysiaJS
│   │   ├── src/
│   │   │   ├── config/         # Configurações do ambiente
│   │   │   ├── db/             # Configuração do Drizzle ORM
│   │   │   ├── modules/        # Rotas e Controllers (Sales, Sellers, Auth)
│   │   │   ├── lib/            # Utilitários
│   │   │   └── index.ts        # Entry point
│   │   └── ...
│   └── frontend/               # Aplicação React
│       ├── src/
│       │   ├── components/     # Componentes UI
│       │   ├── hooks/          # Custom Hooks (API integration)
│       │   ├── pages/          # Páginas da aplicação
│       │   ├── stores/         # Gerenciamento de estado (Zustand)
│       │   ├── router.tsx      # Configuração de rotas
│       │   └── main.tsx        # Entry point
│       └── ...
├── package.json                # Configuração do Workspace
└── README.md
```

## 🎥 Demonstração

[Video de demo](https://youtu.be/qA8-XDQalYA)
