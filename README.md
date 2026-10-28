# 🐾 PetGuardian — Mobile Application Development

> **Arquitetura Pet-Centric, Governança Familiar Colaborativa, Inteligência Artificial Preventiva & Notificações Nativas**  
> *Aplicativo mobile desenvolvido para a 4ª Sprint (Entrega Final) do Challenge Clyvo 2026 — 2TDSPG (FIAP).*

---

## 👥 Equipe de Desenvolvimento

| Nome | RM | Turma | GitHub | LinkedIn |
| :--- | :---: | :---: | :--- | :--- |
| **Enzo Okuizumi** | **561432** | 2TDSPG | [EnzoOkuizumiFiap](https://github.com/EnzoOkuizumiFiap) | [Enzo Okuizumi](https://www.linkedin.com/in/enzo-okuizumi-b60292256/) |
| **Gustavo Okada** | **563428** | 2TDSPG | [Gdev3356](https://github.com/Gdev3356) | [Gustavo Okada](https://www.linkedin.com/in/gustavo-okada-53a3b8359/) |
| **Lucas Barros Gouveia** | **566422** | 2TDSPG | [LuzBGouveia](https://github.com/LuzBGouveia) | [Lucas Barros Gouveia](https://www.linkedin.com/in/lucas-barros-gouveia-09b147355/) |
| **Luna de Carvalho Guimarães** | **562290** | 2TDSPG | [lunaguima](https://github.com/lunaguima) | [Luna Guimarães](https://www.linkedin.com/in/luna-guimar%C3%A3es-b0ba82309/) |
| **Milton Marcelino** | **564836** | 2TDSPG | [MiltonMarcelino](https://github.com/MiltonMarcelino) | [Milton Marcelino](https://www.linkedin.com/in/milton-marcelino-250298142) |

---

## 🔗 Links Oficiais do Projeto

* **Download Direto do APK (Android Standalone):** 📥 [**Baixar pet-guardian.apk (Build Oficial)**](https://expo.dev/artifacts/eas/usOk6lhDpwbcCCwys0Tg40oPrsxRWiBFv_CSeqCQc8Y.apk)
* **Painel de Compilação do EAS Build:** [Dashboard Expo EAS — Build #da96800b](https://expo.dev/accounts/enzookuizumis-team/projects/pet-guardian/builds/da96800b-9f57-4784-8c04-4db3978a7177)
* **Repositório GitHub Mobile:** [Challenge-Pet-Guardian-4/Mobile-Application-Development](https://github.com/Challenge-Pet-Guardian-4/Mobile-Application-Development)
* **Backend Java (Spring Boot):** [Challenge-Pet-Guardian-4/Java-Advanced](https://github.com/Challenge-Pet-Guardian-4/Java-Advanced)
* **Microsserviço IA (Python / FastAPI):** [Disruptive-Architectures-IOT-IOB-IA](https://github.com/Challenge-Pet-Guardian-4/Disruptive-Architectures-IOT-IOB-IA)

---

## 🔗 Vídeo de Demonstração (Sprint 4)

[Video Mobile - Challenge Pet Guardian Sprint 4](https://youtu.be/1XsIjz_erpQ?si=DOOAeGhiCVlnQj7f)

---

## 📱 1. Visão Geral do Projeto & Arquitetura Pet-Centric

O **PetGuardian** é o aplicativo móvel central do ecossistema Clyvo, desenvolvido em **React Native 0.86 com Expo SDK 57 e TypeScript estrito**, integrado diretamente à **API RESTful corporativa em Spring Boot (Java Advanced)** com banco Oracle e ao **microsserviço de Inteligência Artificial Preventiva em FastAPI (Python / Google Gemini no Render)**.

Concebido a partir das diretrizes estratégicas da **Mentoria Clyvo 2026**, o aplicativo rompe com os modelos tradicionais que tratam animais como meros registros de consultas clínicas ou cadastros individuais isolados. No PetGuardian, estabelece-se a **Arquitetura Pet-Centric**:

```text
       ┌─────────────────────────────────────────────────────────────┐
       │                   ECOSSISTEMA PETGUARDIAN                   │
       └──────────────────────────────┬──────────────────────────────┘
                                      │
         ┌────────────────────────────┼────────────────────────────┐
         ▼                            ▼                            ▼
  ┌──────────────┐             ┌──────────────┐             ┌──────────────┐
  │   O TUTOR    │             │  A FAMÍLIA   │             │    O PET     │
  └──────┬───────┘             └──────┬───────┘             └──────┬───────┘
         │                            │                            │
  • Onboarding & Perfil        • Care Circle (N:N)          • Prontuário Clínico
  • Login JWT (RSA 2048)       • Co-cuidadores convidados   • Score de Bem-estar
  • Hardware Seguro            • Delegação de tarefas       • Trilhas Didáticas
  • Modo Claro / Escuro        • Visão unificada da rede    • Notificações Locais
  • Plano Comum / Premium      • Histórico compartilhado    • Triagem Preventiva IA
```

### Pilares Fundamentais do Aplicativo:
1. **Pontuação e Gamificação Focadas no Pet:** O score de experiência (XP) pertence ao animal. Cada rotina concluída e cada lição de adestramento finalizada alimentam a barra de bem-estar do pet, calculada no banco Oracle via Stored Procedure (`pr_calcular_pontuacao_pet`).
2. **Governança Familiar (Care Circle Colaborativo):** Múltiplos tutores e familiares cuidam dos mesmos animais em uma relação N:N, com papéis definidos (Responsável Principal e Co-cuidadores), transferência de titularidade atômica e sincronização em tempo real.
3. **Prevenção Ativa com IA (Guardian AI):** Chat contextual com Google Gemini que consome idade calculada, raça, porte e histórico clínico do pet para fornecer orientações de cuidados e triagem preliminar de sintomas.
4. **Educação Comportamental (Trilhas Duolingo-style):** Aulas práticas interativas de adestramento armazenadas no MongoDB com renderização rica em Markdown.
5. **Notificações Locais Nativas Confiáveis:** Sistema determinístico de alarmes no aparelho via Expo Notifications, respeitando canais de alta prioridade do Android 13+ e limites do iOS.

---

## ✨ 2. Novidades & Destaques da Sprint 4 (Entrega Final)

Nesta 4ª Sprint, o aplicativo atinge sua maturidade de engenharia e produção com a introdução dos seguintes módulos:

### 🔔 Sistema de Notificações Locais Nativas Determinísticas
- **Agendamento por Tarefa:** Cada rotina pendente gera um alarme no dispositivo com identificador determinístico único (`task_${id}`).
- **Antecedência Global Configurável:** O usuário define nas preferências quando deseja ser alertado: *No horário (0 min)*, *5 min antes*, *15 min antes*, *30 min antes* ou *1 hora antes*.
- **Android 13+ Compliance:** Criação antecipada do `NotificationChannel` (`petguardian-lembretes`) com importância máxima, som, vibração e luz antes de solicitar permissões ao sistema operacional.
- **Tolerância a Falhas no iOS:** Validação estrita de horários futuros com margem de segurança de tempo, evitando exceções no `UNUserNotificationCenter` e limitando agendamentos em lote a 60 alarmes (abaixo do teto de 64 do iOS).
- **Deep Linking:** Tocar na notificação redireciona o usuário diretamente para a rotina do animal através do `navigationRef` exportado em `routes/types.ts`.

### 🌗 Tematização Completa: Modo Claro e Modo Escuro (Light & Dark Mode)
- **`ThemeContext` Reativo:** Provedor central que detecta preferências do usuário, armazena no `AsyncStorage` (`@petguardian:theme`) e reage a alternâncias instantâneas.
- **Tokens de Design Consolidados:** Paleta profissional com fundos profundos em slate dark (`#0B0F19`, `#111827`, `#1E293B`), textos de alto contraste e bordas sutis.
- **StatusBar Dinâmica:** Sincronização automática entre o tema visual e a barra de status do sistema (`light` no dark mode, `dark` no light mode).

### 🏷️ Modal "Sobre o App" & Metadados do Edital FIAP
- **Centralização Técnica (`version.ts`):** Exibe nome da aplicação, versão de lançamento `1.0.0`, número da build `#4`, sprint correspondente, disciplina e challenge.
- **Sincronização Dinâmica com o Git:** Hash de commit curto e mensagem do último commit injetados dinamicamente em tempo de execução via Expo Config (`app.config.js` e `expo-constants`), eliminando arquivos intermediários no repositório.
- **Identificação Acadêmica:** Nome completo e RM de todos os 5 integrantes da equipe, facilitando a validação e avaliação pelos docentes.

### 💎 Modelo Freemium & Blindagem da Role ADMIN
- **Plano `COMUM` vs. `PREMIUM`:** Usuários gratuitos desfrutam das funcionalidades essenciais, enquanto recursos avançados contam com cards ilustrativos e fluxo de upgrade via `PATCH /usuarios/me/upgrade-premium`.
- **Blindagem de Segurança:** O aplicativo mobile é restrito a tutores (`USER` e `PREMIUM`). Telas e seletores administrativos foram completamente eliminados do cliente mobile.

---

## 🖥️ 3. Arquitetura das Telas da Aplicação

O aplicativo é composto por **9 telas principais ricas e declarativas**, organizadas entre rotas públicas (`AuthStack`) e privadas (`AppTabs`):

### 🔓 Telas Públicas (`AuthStack`)

#### 1. `WelcomeScreen` (Boas-Vindas)
* **Objetivo:** Apresentação da proposta de valor, identidade visual e acesso direto ao onboarding.
* **Componentes:** Carrossel institucional, botões de ação estilizados e roteamento seguro.

#### 2. `LoginScreen` (Autenticação JWT Real)
* **Objetivo:** Login corporativo com credenciais do tutor.
* **Recursos:** Validação com Zod (`LoginSchema`), requisição `POST /login`, recebimento de token JWT assinado por RSA de 2048 bits e gravação em hardware seguro (`expo-secure-store`).

#### 3. `RegisterScreen` (Onboarding de Tutor com ViaCEP)
* **Objetivo:** Cadastro de novos tutores no ecossistema.
* **Recursos:** Validação Zod (`RegisterSchema`), consulta automática de endereço via CEP (ViaCEP), validação de senha e transição direta pós-cadastro.

---

### 🔒 Telas Protegidas (`AppTabs`)

#### 4. `HomeScreen` (Dashboard Central do Pet Ativo)
* **Objetivo:** Painel de controle focado nas necessidades do animal selecionado.
* **Recursos:**
  * **Seletor de Pet:** Alternância ágil entre os pets da família.
  * **`PetScoreBar`:** Nível de XP e bem-estar do pet calculado pelo banco Oracle (`GET /pets/{id}/pontos`).
  * **Rotinas do Dia:** Lista de tarefas pendentes e concluídas com badges de horário e pontos.
  * **Conclusão em 1 Toque:** `PATCH /tarefas/{id}/concluir` e `PATCH /tarefas/{id}/desmarcar` com feedback nativo, atualização de XP no Oracle e sincronização automática de alarmes locais.
  * **`StreakCard`:** Ofensiva diária incentivando cuidados contínuos.

#### 5. `FamilyPetScreen` (Gestão Familiar & Care Circle)
* **Objetivo:** Governança colaborativa de múltiplos pets e tarefas compartilhadas.
* **Recursos:**
  * **Listagem Familiar Paginada:** Visualização de todos os animais do cuidador.
  * **Cadastro de Pet (CRUD - Create):** Modal com validação de raça, porte, sexo, castração e data de nascimento (`dataNasc`).
  * **Criação de Tarefa (CRUD - Create):** Cadastro de rotinas com título, descrição, prazo, pontuação e vinculação a um pet existente.
  * **Care Circle:** Envio de convites de co-cuidadores por e-mail (`POST /pets/{id}/cuidadores`).

#### 6. `PetDetailScreen` (Prontuário Clínico & Operações do Pet)
* **Objetivo:** Ficha clínica detalhada e histórico de saúde consolidado.
* **Recursos:**
  * **Ficha Médica:** Idade dinâmica calculada a partir de `dataNasc`, características físicas e lista de cuidadores.
  * **Edição de Dados (CRUD - Update):** Atualização cadastral do pet via `PUT /pets/{id}`.
  * **Exclusão de Pet (CRUD - Delete):** Remoção definitiva com confirmação nativa e cancelamento automático dos alarmes vinculados.
  * **Histórico de Saúde:** Registro e listagem de eventos clínicos (vacinas, consultas, exames e medicações) via `GET/POST /historicos`.

#### 7. `TrainingEducationScreen` (Trilhas Educativas Gamificadas)
* **Objetivo:** Capacitação de tutores com trilhas estilo Duolingo.
* **Recursos:** Trilhas temáticas, módulos didáticos e lições com conteúdo rico NoSQL (Markdown). Conclusão de aulas via `PATCH /aulas/{id}/concluir` credita pontos de adestramento ao pet ativo.

#### 8. `AiAssistantScreen` (Guardian AI — Prevenção e Triagem)
* **Objetivo:** Assistente conversacional preventiva integrada ao Google Gemini.
* **Recursos:** Chat com streaming/respostas contextuais baseadas na idade, raça e histórico do pet, histórico de sessões anteriores e geração de insights preventivos.

#### 9. `UserProfileScreen` (Perfil, Preferências & Notificações)
* **Objetivo:** Gestão da conta do tutor, preferências do aplicativo e suporte.
* **Recursos:**
  * **Card do Usuário:** Dados de contato, status do plano (`COMUM` ou `PREMIUM`) e botão de edição de perfil (`EditProfileModal`).
  * **Estatísticas Agregadas:** Total de pontos da rede de cuidado (`GET /usuarios/me/rede-cuidado`).
  * **Modal de Notificações (`NotificationSettingsModal`):** Toggle de ativação, seleção de antecedência e cancelamento/reagendamento de alarmes.
  * **Alternância de Tema:** Switch de Dark/Light mode com persistência local.
  * **Modais Informativos:** Sobre o App (`SobreAppModal`), Dúvidas Frequentes (`FaqModal`) e Termos de Uso (`TermsModal`).
  * **Exclusão de Conta:** Fluxo seguro em conformidade com a LGPD (`DELETE /usuarios/me`).

---

## 🏛️ 4. Arquitetura de Software & Organização de Diretórios

O projeto adota o padrão **Clean Architecture / Separation of Concerns / Domain Hooks**, garantindo que telas permaneçam puramente visuais e declarativas, enquanto a lógica de negócio, chamadas de rede e cache residem em hooks e serviços dedicados:

```text
src/
├── components/          → Componentes visuais atômicos, modais e formulários compartilhados
│   ├── BaseModal/             → Modal base acessível com animações suaves e backdrop
│   ├── CaregiverCard/         → Card de cuidador da rede familiar com badge de papel
│   ├── EditProfileModal/      → Formulário de edição cadastral do usuário
│   ├── Header/                → Cabeçalho institucional com suporte a tema e subtítulo
│   ├── HistoricoFormModal/    → Formulário de lançamento de eventos de saúde
│   ├── InviteCaregiverModal/  → Formulário de convite de co-cuidador por e-mail
│   ├── PetFormModal/          → Formulário de cadastro/edição de animais
│   ├── PetScoreBar/           → Barra animada de nível e progresso de XP do pet
│   ├── StreakCard/            → Card de ofensiva e consistência de cuidados diários
│   ├── TaskFormModal/         → Formulário de criação e edição de rotinas
│   └── TasksRoutineSection/   → Seção modular de rotinas e tarefas da Home
├── config/              → Configurações de ambiente, URLs e versionamento
│   ├── env.ts                 → Resolução de URLs de API em produção (Azure Web App e Render)
│   └── version.ts             → Metadados FIAP e resolução dinâmica do Git (expo-constants)
├── constants/           → Tokens de design system, tipografia e temas
│   └── theme.ts               → Paletas lightTheme e darkTheme, raios, sombras e cores
├── contexts/            → Gestão global de estado via React Context API
│   ├── AuthContext.tsx        → Estado de sessão, login, registro e hardware seguro
│   └── ThemeContext.tsx       → Provedor de tema claro/escuro com sincronização de storage
├── hooks/               → Domain Hooks que encapsulam regras de negócio e TanStack Query:
│   ├── useActivePet.ts        → Gerenciamento do pet selecionado na sessão
│   ├── useAiAssistant.ts      → Hooks de chat, insights e warmup do microsserviço Python
│   ├── useAiAssistantScreen.ts→ Orquestração do estado do chat e sessões da IA
│   ├── useFamilyCare.ts       → Queries e mutações da governança familiar e pets
│   ├── useFamilyModals.ts     → Controle de abertura e fechamento de modais familiares
│   ├── useHomeData.ts         → Agregação reativa de dados para o dashboard da Home
│   ├── useNotificationSync.ts → Ciclo de vida global de notificações (cold-start e AppState)
│   ├── useNotifications.ts    → Hook de preferências de notificações e persistência
│   ├── usePetDetail.ts        → Ficha médica, histórico clínico e cuidadores do pet
│   ├── usePetDetailActions.ts → Ações de exclusão, edição e cuidados do pet
│   ├── usePets.ts             → Queries e mutações paginadas de pets
│   ├── useTaskActions.ts      → Mutações de conclusão, desmarcação e agendamento de tarefas
│   ├── useTasks.ts            → Queries de tarefas pendentes e paginação de rotinas
│   ├── useTrainings.ts        → Trilhas de adestramento e mutações de conclusão de aulas
│   ├── useUserProfile.ts      → Perfil do tutor, estatísticas da rede e upgrade premium
│   └── useUsers.ts            → Consultas de dados do usuário e rede de cuidado
├── lib/                 → Configurações de infraestrutura
│   ├── queryClient.ts         → Singleton do QueryClient com staleTime e retry calibrados
│   └── queryKeys.ts           → Fábrica de chaves tipadas para invalidação granular de cache
├── routes/              → Roteamento e navegação com React Navigation v7
│   ├── MainStack.tsx          → Roteador raiz condicional (AuthStack vs AppTabs)
│   ├── tabs.tsx               → Barra inferior com 5 abas principais e ícones dinâmicos
│   └── types.ts               → Contratos tipados de rotas, parâmetros e navigationRef global
├── screens/             → Telas da aplicação (puramente declarativas)
│   ├── AiAssistant/           → Chat conversacional com IA Preventiva
│   ├── FamilyPet/             → Governança colaborativa de pets e tarefas
│   ├── Home/                  → Dashboard com rotina diária e pontuação do pet
│   ├── Login/                 → Tela de login com validação Zod
│   ├── PetDetail/             → Ficha clínica, histórico médico e cuidadores
│   ├── Register/              → Cadastro de tutor com busca automática ViaCEP
│   ├── TrainingEducation/     → Trilhas educativas Duolingo-style
│   ├── UserProfile/           → Perfil, estatísticas, modais e preferências
│   └── Welcome/               → Onboarding de boas-vindas
├── services/            → Comunicação HTTP REST e serviços nativos
│   ├── ai.ts                  → Chamadas ao microsserviço Python FastAPI
│   ├── auth.ts                → Login e registro com Spring Boot
│   ├── historico.ts           → Prontuário médico e eventos clínicos
│   ├── http.ts                → Cliente Axios com injeção de Bearer Token e interceptor 401
│   ├── notifications.ts       → Serviço de agendamento local, canais Android e sincronização
│   ├── pets.ts                → CRUD de pets, score Oracle e cuidadores
│   ├── storage.ts             → Hardware seguro com expo-secure-store (Keychain / Keystore)
│   ├── tasks.ts               → Rotinas de tarefas e paginação de pendências
│   ├── trainings.ts           → Trilhas e lições com conteúdo NoSQL MongoDB
│   └── users.ts               → Perfil, rede de cuidado e upgrade premium
├── types/               → Interfaces TypeScript estritas espelhando a API Java (zero any)
└── utils/               → Schemas de validação Zod, formatação de datas e helpers utilitários
```

---

## 🔐 5. Segurança, Hardware Seguro & Ciclo de Sessão JWT

* **Hardware Seguro Nativo (`expo-secure-store`):**
  * O token JWT assinado por RSA de 2048 bits e o e-mail identificador são persistidos exclusivamente nas camadas nativas de hardware seguro: **Keychain (iOS)** e **Keystore (Android)**.
  * O aplicativo **não armazena credenciais em AsyncStorage**, eliminando vetores de ataque contra extração de dados locais.
* **Injeção Automática de Bearer Token:**
  * O interceptor de requisições em [src/services/http.ts](./src/services/http.ts) insere automaticamente o cabeçalho `Authorization: Bearer <token>` em todas as chamadas autenticadas.
* **Tratamento Global de Expiração de Sessão (401 Unauthorized):**
  * Ao receber resposta `401 Unauthorized`, o interceptor de resposta limpa o hardware seguro de forma atômica (`StorageService.clearAuthSession()`).
  * Cancela imediatamente todos os alarmes agendados no aparelho (`NotificationService.cancelarTodasNotificacoesTarefas()`).
  * Reseta o estado global em `AuthContext` e invalida o cache do `QueryClient`, redirecionando o usuário à tela de login sem falhas ou estados órfãos.

---

## 🔔 6. Funcionamento das Notificações Locais

```text
       ┌───────────────────────────────────────────────────────────────────┐
       │         CICLO DE VIDA & SINCRONIZAÇÃO DE NOTIFICAÇÕES LOCAL       │
       └─────────────────────────────────┬─────────────────────────────────┘
                                         │
                                [ USUÁRIO / TUTOR ]
                                         │
                                         │ [1] Altera horário ("30 min antes")
                                         │     e clica em "Salvar"
                                         ▼
       ┌─────────────────────────────────┴─────────────────────────────────┐
       │           NotificationSettingsModal (UI / Modal de Preferências)  │
       │ • Seleção de antecedência: 0 min, 5 min, 15 min, 30 min ou 1 hora │
       └─────────────────────────────────┬─────────────────────────────────┘
                                         │
                                         │ [2] salvarSettings({ ativado: true,
                                         │     minutosAntecedencia: 30 })
                                         ▼
       ┌─────────────────────────────────┴─────────────────────────────────┐
       │                  useNotifications (Domain Hook)                   │
       │ • Orquestra a persistência de preferências e a sincronização local│
       └───────────────┬───────────────────────────────────┬───────────────┘
                       │                                   │
 [3] saveSettings(...) │                                   │ [4] sincronizarTarefas(pendentes, pets)
                       ▼                                   ▼
       ┌───────────────┴───────────────┐   ┌───────────────┴───────────────┐
       │         AsyncStorage          │   │      NotificationService      │
       │  key: notification_settings   │   │ (src/services/notifications)  │
       │                               │   │                               │
       │ • Grava status ativado/inativo│   │ • Filtra tarefas pendentes    │
       │ • Grava minutos antecedência  │   │ • Calcula trigger antecipado  │
       │ • Persiste preferências tutor │   │ • Valida regras e limites iOS │
       └───────────────────────────────┘   └───────────────┬───────────────┘
                                                           │
                                                           │ [5] getAllScheduledNotificationsAsync() (acha órfãos)
                                                           │ [6] cancelScheduledNotificationAsync(orfas)
                                                           │ [7] scheduleNotificationAsync(task_123, trigger, canal)
                                                           ▼
       ┌───────────────────────────────────────────────────┴───────────────┐
       │              SISTEMA OPERACIONAL (Android 13+ / iOS)              │
       │                                                                   │
       │ • Android: Canal prioritário "petguardian-lembretes" (som e luz)  │
       │ • iOS: UNUserNotificationCenter (Trigger tipo DATE; anti-passado) │
       │ • Determinismo: Identificador "task_{id}" para reconciliação local│
       └─────────────────────────────────┬─────────────────────────────────┘
                                         │
                                         │ [8] Promise resolvida: Concluído com sucesso
                                         ▼
       ┌─────────────────────────────────┴─────────────────────────────────┐
       │                  ATUALIZAÇÃO DA INTERFACE VISUAL                  │
       │                                                                   │
       │ • [9] NotificationSettingsModal fecha suavemente com animação     │
       │ • Subtítulo: "Lembretes ativos • 30 min antes" (UserProfile)      │
       │ • Sincronização em background garantida pelo hook global          │
       └───────────────────────────────────────────────────────────────────┘
```

1. **Cálculo Determinístico de Disparo:** O timestamp é calculado como:
   $$\text{Trigger} = \text{Prazo da Tarefa} - (\text{Minutos de Antecedência} \times 60 \times 1000)$$
2. **Proteção contra Agendamentos Retroativos:** Se o horário calculado for menor ou igual ao momento atual (com margem preventiva de 3 segundos), o agendamento é ignorado para evitar que o iOS lance exceções no `UNUserNotificationCenter`.
3. **Reconciliação e Limpeza de Órfãos:** Tarefas concluídas, canceladas ou excluídas têm seus alarmes revogados imediatamente no dispositivo através do identificador padrão `task_${tarefaId}`.
4. **Sincronização em Primeiro Plano (AppState):** Quando o aplicativo retorna do background ou quando o usuário realiza login, o hook [useNotificationSync.ts](./src/hooks/useNotificationSync.ts) sincroniza todas as tarefas pendentes através de todas as páginas da API (`/tarefas/me`), garantindo consistência mesmo após reinicializações.

---

## 🌐 7. Mapa de Integração com APIs

### API Java Spring Boot (`Java-Advanced`)
* **Autenticação:** `POST /login` (Emissão de JWT assinado com RSA).
* **Usuários:** `POST /usuarios`, `GET /usuarios/me`, `PUT /usuarios/me`, `DELETE /usuarios/me`, `PATCH /usuarios/me/upgrade-premium`, `GET /usuarios/me/rede-cuidado`.
* **Pets & Care Circle:** `GET /pets/me`, `POST /pets`, `GET /pets/{id}/pontos`, `PUT /pets/{id}`, `DELETE /pets/{id}`, `GET /pets/{id}/cuidadores`, `POST /pets/{id}/cuidadores`, `DELETE /pets/{id}/cuidadores/me`.
* **Tarefas de Rotina:** `GET /tarefas/me`, `POST /tarefas`, `PUT /tarefas/{id}`, `DELETE /tarefas/{id}`, `PATCH /tarefas/{id}/concluir`, `PATCH /tarefas/{id}/desmarcar`.
* **Histórico de Saúde:** `POST /historicos`, `PUT /historicos/{id}`, `DELETE /historicos/{id}` (com leitura consolidada na ficha clínica via `GET /pets/{id}/detalhe`).
* **Trilhas Didáticas (MongoDB):** `GET /trilhas/me`, `GET /modulos/trilha/{id}`, `GET /aulas/modulo/{id}`, `PATCH /aulas/{id}/concluir`.

### Microsserviço Python FastAPI (`Disruptive-Architectures-IOT-IOB-IA`)
* **Chat Conversacional:** `POST /ai/chat` (Com contexto clínico completo do pet e streaming de resposta).
* **Insights Preventivos:** `POST /ai/insights` (Dicas de alimentação, vacinação e bem-estar por porte e idade).
* **Sessões e Histórico:** `GET /ai/sessions`, `GET /ai/history`, `DELETE /ai/sessions/{id}`.

---

## 📦 8. Stack Tecnológica e Versões Oficiais

| Tecnologia | Versão Oficial | Finalidade no Projeto |
| :--- | :---: | :--- |
| **React Native** | `0.86.3` | Framework mobile de alto desempenho com arquitetura nativa |
| **Expo** | `~57.0.27` | Ecossistema corporativo de desenvolvimento mobile e plugins nativos |
| **TypeScript** | `~6.0.3` | Tipagem estrita de contratos de domínio e navegação (Zero `any`) |
| **expo-notifications** | `~57.0.22` | Módulo oficial para agendamento e canais de notificações locais |
| **expo-secure-store** | `~57.0.4` | Criptografia de hardware seguro no Keychain (iOS) e Keystore (Android) |
| **@tanstack/react-query** | `^5.102.6` | Gerenciamento declarativo de cache assíncrono e invalidações |
| **Axios** | `^1.20.0` | Cliente HTTP com interceptors centralizados para Bearer Token e 401 |
| **React Navigation** | `^7.x` | Navegação nativa declarativa (`native-stack` e `bottom-tabs`) |
| **Zod** | `^4.4.3` | Validação estrita de schemas de formulários e contratos de API |
| **React Hook Form** | `^7.75.0` | Gerenciamento performático de formulários controlados |
| **@react-native-async-storage/async-storage**| `2.2.0` | Armazenamento local de preferências de tema e notificações |
| **@expo/vector-icons** | `^15.0.2` | Conjunto abrangente de ícones vetoriais nativos |

---

## 🚀 9. Instruções de Execução e Validação

### Pré-requisitos
1. **Node.js** (versão 20+ LTS recomendada) e **npm** instalados.
2. Smartphone físico com **Expo Go** instalado ou emulador configurado (Android Studio ou Xcode).
3. Backend Java executando em `http://localhost:8080` ou acessível na rede local.

### Passo a Passo

```bash
# 1. Navegue até o diretório da aplicação mobile
cd Mobile-Application-Development

# 2. Instale as dependências oficiais
npm install

# 3. O arquivo src/config/env.ts já vem pré-configurado com as APIs em produção na nuvem (Azure e Render).
# Caso deseje executar com backend local, configure: apiUrl: 'http://10.0.2.2:8080' (Emulador) ou 'http://192.168.X.X:8080' (Físico)

# 4. Inicie o servidor Metro do Expo
npm start
```

* **No Emulador Android:** Pressione `a` no terminal.
* **No Simulador iOS:** Pressione `i` no terminal.
* **No Aparelho Físico:** Abra o **Expo Go** e escaneie o QR Code exibido no terminal.

### Scripts de Validação de Código

```bash
# Verificação estrita de tipagem TypeScript (Zero erros e Zero any)
npm run type-check

# Execução do linter estrito
npm run lint
```

---

### 📲 Instalação Direta via APK Standalone (Para Avaliação do Docente)

Não é necessário clonar o repositório ou instalar ferramentas de desenvolvimento para avaliar o aplicativo. O binário executável Android já está compilado e distribuído na nuvem:

1. **Download:** Baixe o arquivo diretamente em seu smartphone Android ou computador através do link oficial:  
   👉 [**Download Direto do pet-guardian.apk**](https://expo.dev/artifacts/eas/usOk6lhDpwbcCCwys0Tg40oPrsxRWiBFv_CSeqCQc8Y.apk)
2. **Instalação no Celular:** Abra o arquivo `.apk` baixado e toque em **Instalar** (permita a instalação de fontes desconhecidas caso solicitado pelo Android).
3. **Instalação via Emulador Android Studio (ADB):**
   ```bash
   adb install pet-guardian.apk
   ```
4. **APIs Conectadas na Nuvem:** O app já está pré-configurado com as URLs em produção do backend corporativo (Azure) e do microsserviço de IA (Render), não exigindo subir nenhum servidor local para avaliação das funcionalidades.