# 📅 Agenda Virtual — Frontend

Interface web de uma aplicação de comunicação escolar, desenvolvida para centralizar informações entre a escola e os pais ou responsáveis pelos alunos.

O projeto **Agenda Virtual** tem como objetivo facilitar o acompanhamento de eventos, comunicados e atividades escolares por meio de uma plataforma moderna, responsiva e integrada a uma API REST.

Este repositório contém o **frontend da aplicação**, desenvolvido com Angular e TypeScript.

## 🔗 Repositórios

- **Frontend (Angular):** [agenda-virtual-frontend](https://github.com/FabioKenzo/agenda-virtual-frontend)
- **Backend (Java + Spring Boot):** [agenda-virtual](https://github.com/FabioKenzo/agenda-virtual)

## 🚧 Status do Projeto

**Em desenvolvimento**

A aplicação já possui a estrutura inicial do frontend, integração com a API de autenticação e controle de acesso a rotas protegidas.

O desenvolvimento está avançando para as funcionalidades de consulta de eventos, comunicados escolares e gerenciamento administrativo.

## 🎯 Objetivo

Desenvolver uma solução digital que facilite a comunicação entre a escola e as famílias, permitindo:

- Centralizar eventos e comunicados escolares.
- Facilitar o acesso dos responsáveis às informações.
- Organizar a divulgação de atividades e eventos.
- Disponibilizar uma interface intuitiva e responsiva.
- Oferecer acesso seguro às funcionalidades restritas.

## 🛠️ Tecnologias e Ferramentas

| Tecnologia | Utilização |
|---|---|
| Angular 21 | Framework frontend |
| TypeScript | Desenvolvimento da aplicação |
| HTML5 | Estrutura das páginas |
| CSS3 | Estilização |
| Bootstrap 5 | Layout responsivo e componentes visuais |
| Bootstrap Icons | Iconografia |
| Angular Router | Navegação e proteção de rotas |
| Angular HttpClient | Comunicação com a API REST |
| RxJS | Tratamento de operações assíncronas |
| Git e GitHub | Versionamento e colaboração |

## 🏗️ Arquitetura da Aplicação

O frontend utiliza uma arquitetura baseada em componentes, serviços e recursos de navegação do Angular.

A comunicação com o backend é realizada por requisições HTTP para uma API REST desenvolvida em Java e Spring Boot.

**Fluxo simplificado:**

```text
             Usuário
                |
                v
       Frontend Angular 21
                |
       Components / Routes
                |
       Services / Interceptors
                |
                v
       API REST Spring Boot
                |
                v
         PostgreSQL
```

A aplicação utiliza **Client-Side Rendering (CSR)**, com renderização e navegação gerenciadas no navegador.

## 🔐 Autenticação e Segurança

A autenticação é integrada ao backend Spring Boot, utilizando JWT armazenado em cookie HttpOnly.

### Recursos implementados

- Login integrado à API REST.
- Logout com encerramento da sessão no navegador.
- Persistência da autenticação após atualização da página.
- Proteção de rotas utilizando Angular Route Guards.
- Verificação da sessão autenticada por meio da API.
- Envio de cookies nas requisições autenticadas.
- Interceptors HTTP para comunicação com a API e tratamento do token CSRF.

### Fluxo de autenticação

```text
Usuário
   |
   v
Tela de Login
   |
   v
POST /auth/login
   |
   v
Backend valida as credenciais
   |
   v
JWT enviado em cookie HttpOnly
   |
   v
Frontend acessa rota protegida
   |
   v
GET /auth/me
   |
   v
Sessão validada pelo backend
```

O token JWT não precisa ser armazenado manualmente no `localStorage` ou `sessionStorage`, pois é enviado pelo navegador por meio do cookie de autenticação.

A aplicação também utiliza proteção CSRF nas requisições aplicáveis, em conjunto com a configuração de segurança do backend.

> **Nota:** A validação efetiva das credenciais, permissões e tokens é responsabilidade do backend. Os guards do Angular complementam o controle de navegação no frontend.

## ✅ Funcionalidades Implementadas

- [x] Configuração inicial do projeto Angular.
- [x] Configuração do Angular Router.
- [x] Integração com a API REST de autenticação.
- [x] Tela de login.
- [x] Autenticação baseada em cookie HttpOnly.
- [x] Persistência de sessão.
- [x] Logout.
- [x] Proteção de rotas privadas.
- [x] Interceptors HTTP.
- [x] Integração com proteção CSRF.
- [x] Migração gradual do Angular 17 para o Angular 21.
- [x] Configuração da aplicação para CSR.

## 📌 Funcionalidades em Desenvolvimento

- [ ] Interface de visualização dos eventos escolares.
- [ ] Interface de visualização dos comunicados.
- [ ] Exibição de detalhes dos eventos.
- [ ] Melhorias na experiência do painel do responsável.
- [ ] Painel administrativo.
- [ ] Interface de cadastro e gerenciamento de eventos.
- [ ] Interface de gerenciamento de comunicados.
- [ ] Aprimoramentos de responsividade e experiência do usuário.
- [ ] Testes automatizados do frontend.

## 📂 Organização do Frontend

A aplicação segue a organização por funcionalidades e responsabilidades do Angular.

```text
src/
├── app/
│   ├── core/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   └── services/
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   └── login/
│   │   │
│   │   └── responsavel/
│   │       └── home/
│   │
│   ├── app.component.ts
│   ├── app.config.ts
│   └── app.routes.ts
│
└── main.ts
```

*Estrutura ilustrativa dos principais módulos lógicos e recursos utilizados. A organização de diretórios pode evoluir durante o desenvolvimento.*

## 🚀 Como Executar Localmente

### Pré-requisitos

- Node.js compatível com Angular 21.
- npm.
- Angular CLI.
- Git.
- Backend da Agenda Virtual configurado e em execução.

### 1. Clonar o repositório

```bash
git clone https://github.com/FabioKenzo/agenda-virtual-frontend.git
```

### 2. Acessar a pasta do projeto

```bash
cd agenda-virtual-frontend
```

### 3. Instalar as dependências

```bash
npm install
```

### 4. Iniciar o servidor de desenvolvimento

```bash
npx ng serve
```

A aplicação estará disponível em:

**http://localhost:4200**

### 5. Configurar o backend

Para utilizar os recursos de autenticação e as funcionalidades integradas, a API Spring Boot deve estar em execução.

**Endereço utilizado no ambiente local:**

```text
http://localhost:8080
```

Consulte o [repositório do backend](https://github.com/FabioKenzo/agenda-virtual) para informações sobre sua configuração e execução.

## 🧪 Build de Produção

Para gerar uma versão de produção:

```bash
npx ng build --configuration production
```

O build de produção foi validado após a migração para o Angular 21.

Ainda existem avisos de orçamento relacionados ao tamanho do bundle inicial e ao CSS de um componente, previstos para otimização futura.

## 🔄 Versionamento e Evolução

O desenvolvimento utiliza Git e GitHub para gerenciamento das alterações.

A migração do Angular 17 para o Angular 21 foi realizada de forma incremental, com commits separados por versão, validação do build e integração à branch principal por meio de Pull Request.

Esse processo contribui para a rastreabilidade das alterações e a manutenção do projeto.

## 📈 Próximas Etapas

As próximas etapas estão concentradas na evolução da experiência dos responsáveis e na implementação das interfaces administrativas.

O objetivo é consolidar uma aplicação Full Stack funcional, integrando frontend Angular, backend Spring Boot e banco de dados PostgreSQL.

---

**Projeto desenvolvido para aplicação prática de conhecimentos em desenvolvimento Full Stack, arquitetura de aplicações web, integração de APIs REST e boas práticas de engenharia de software.**


