# Sistema de Atendimento de Fila do Refeitório

Projeto do Lab04 (ES2) com frontend em Angular, backend em PHP puro e base de dados MySQL.

## Funcionalidades entregues

- Autenticação completa:
	- Login
	- Registo
	- Logout
	- Recuperação de senha
- Gestão de utilizadores com tipos de conta:
	- `institucional`
	- `guest`
	- `operador`
	- `admin`
- Permissões diferenciadas por rota no frontend:
	- Menu e Histórico: utilizadores autenticados
	- Cozinha: `operador` e `admin`
	- Gestão de pratos: `admin`
- Base de dados relacional com 3 tabelas (`utilizadores`, `pratos`, `pedidos`) e operações CRUD
- Integração com API externa:
	- Open-Meteo (clima atual de Luanda no módulo do Menu)
- Interface responsiva (desktop e mobile)
- Modo claro/escuro com alternância global
- Suporte a múltiplos idiomas (PT/EN no shell principal)
- Exportação de dados em CSV:
	- Histórico de pedidos
	- Relatório de pratos no módulo admin

## Estrutura

- `frontend/`: aplicação Angular (SPA)
- `backend/api/`: endpoints PHP organizados por domínio (`auth`, `menu`, `pedidos`, `admin`, `utilizadores`)
- `backend/mysql-scripts/`: scripts SQL (`schema.sql`, `seed.sql`, `seed-update.sql`)
- `docs/`: documentos do laboratório e PRD

## Como executar

## 1. Base de dados

1. Criar a BD e tabelas:
	 - Executar `backend/mysql-scripts/schema.sql`
2. Popular dados iniciais (opcional):
	 - Executar `backend/mysql-scripts/seed.sql`
	 - Executar `backend/mysql-scripts/seed-update.sql`

## 2. Backend (PHP)

1. Entrar em `backend/api`
2. Iniciar servidor local:
	 - `php -S localhost:8000`

## 3. Frontend (Angular)

1. Entrar em `frontend`
2. Instalar dependências:
	 - `npm install`
3. Iniciar aplicação:
	 - `npm start`
4. Aceder em `http://localhost:4200`

## Endpoints principais

- Autenticação:
	- `POST /auth/login.php`
	- `POST /auth/register.php`
	- `POST /auth/recover_password.php`
- Menu e pedidos:
	- `GET /menu/get_pratos.php`
	- `POST /pedidos/criar.php`
	- `GET /pedidos/historico.php?utilizador_id={id}`
	- `GET /pedidos/listar_cozinha.php`
	- `POST /pedidos/atualizar_status.php`
- Administração:
	- `GET|POST|PUT|PATCH|DELETE /admin/gestao_pratos.php`
	- `GET /admin/stats.php`
- Utilizador:
	- `POST /utilizadores/carregar_saldo.php`

## Notas técnicas

- Frontend com componentes standalone e serviço central de API (`frontend/src/app/services/api.ts`)
- Guardas de rota em `frontend/src/app/auth.guard.ts`
- Tema global em `frontend/src/app/services/theme.ts`
- Idioma global em `frontend/src/app/services/i18n.ts`

## Validação executada

- Build Angular concluído com sucesso (`npm run build`)
- Validação de sintaxe dos ficheiros PHP concluída (`php -l`)
