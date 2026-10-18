# 🤖 AGENT.md — Guia Arquitetural & Especificação Técnica (Mobile-Application-Development)

Este documento é a referência definitiva para agentes de IA e desenvolvedores sobre a arquitetura, telas, contratos de API, gerenciamento de estado, rotas e fluxos do aplicativo móvel **PetGuardian** (Ecossistema Clyvo).

---

## 🏛️ 1. Stack Tecnológica & Arquitetura Base

- **Framework & Runtime:** React Native 0.86.3 com **Expo SDK 57** (`expo@~57.0.20`, Metro Runtime, Expo Status Bar).
- **Linguagem & Tipagem:** TypeScript ~6.0.3 (**Tipagem Estrita — Zero `any`**, tipagem estrita de rotas, props e payloads).
- **Notificações Locais Nativas:** **Expo Notifications** (`expo-notifications@~57.0.22`) com agendamento determinístico por tarefa, canais prioritários Android e preferências de antecedência.
- **Tematização & Acessibilidade:** **ThemeProvider** (`ThemeContext.tsx`, hook `useTheme`) com suporte nativo a **Modo Claro (Light) e Modo Escuro (Dark)**, tokens em `theme.ts`.
- **Gerenciamento de Estado Assíncrono:** **TanStack Query v5** (`@tanstack/react-query@^5.102.6`) com mutações declarativas (`mutate` com `onSuccess`/`onError`) e invalidação granular de cache.
- **Padrão de Dados:** **Domain Hooks** (camada intermediária que isola queries, mutations e lógica de negócio, mantendo telas puramente declarativas).
- **Cliente HTTP Centralizado:** **Axios** (`^1.20.0`) com interceptores para injeção automática de Bearer Token JWT e captura global de status `401 Unauthorized`.
- **Hardware Seguro & Persistência:** `expo-secure-store` (Keychain iOS / Keystore Android para JWT) + `@react-native-async-storage/async-storage` (cache e preferências de notificação/tema).
- **Navegação Nativa:** React Navigation v7 (`@react-navigation/native`, `native-stack`, `bottom-tabs`, `navigationRef` em `routes/types.ts` para navegação externa via push).
- **Validação de Formulários:** **Zod** (`zod@^4.4.3`) + **React Hook Form** (`^7.75.0`).
- **Design System & Ícones:** `@expo/vector-icons`, tokens em `theme.ts` (Tailwind slate/blue, raios, espaçamentos e paleta Duolingo de trilhas).

---

## 📁 2. Estrutura de Diretórios

```text
src/
├── components/          → Componentes visuais atômicos e modulares (BaseModal, Header, PetScoreBar, RoutineCard, StreakCard, Modais)
├── config/              → Configurações de ambiente (env.ts com Azure Web App e Render) e metadados de versão/equipe (version.ts)
├── constants/           → Tokens de design system, light/dark themes, tipografia e paleta de cores (theme.ts)
├── contexts/            → Gestão global de autenticação (AuthContext.tsx) e alternância de temas (ThemeContext.tsx)
├── hooks/               → Custom hooks e Domain hooks (Clean Architecture / SRP / TanStack Query):
│   ├── useHomeData.ts         → Dashboard do pet ativo, pontuação e rotinas da Home
│   ├── useFamilyCare.ts       → Gestão colaborativa familiar, pets, tarefas e co-cuidadores
│   ├── usePetDetail.ts        → Ficha clínica, prontuário, histórico e cuidadores do pet
│   ├── useTrainings.ts        → Trilhas de adestramento gamificadas com TanStack Query
│   ├── useUserProfile.ts      → Perfil do tutor, estatísticas, pontuação agregada, upgrade e exclusão de conta
│   ├── useAiAssistantScreen.ts→ Orquestrador do chat conversacional com IA preventiva e histórico
│   ├── useNotifications.ts    → Ciclo de vida de notificações nativas e preferências de antecedência
│   ├── useNotificationSync.ts → Sincronização em primeiro plano/background de alarmes locais
│   ├── useTaskActions.ts      → Ações de tarefas (concluir, desmarcar, excluir) com nomes reais do pet
│   ├── usePets.ts / useTasks.ts / useHistoricos.ts → Queries e mutações especializadas por domínio
│   └── useSession.ts / useActivePet.ts → Hooks utilitários de sessão e pet ativo
├── lib/                 → queryClient.ts (singleton) e queryKeys.ts (fábrica tipada de chaves)
├── routes/              → MainStack.tsx (AuthStack vs AppTabs), tabs.tsx e types.ts (com navigationRef global)
├── screens/             → Telas da aplicação (Welcome, Login, Register, Home, FamilyPet, PetDetail, Training, AI, Profile)
│   ├── UserProfile/components/ → Modais de Perfil (NotificationSettingsModal, UpgradePremiumModal, SobreAppModal, FaqModal, TermsModal)
├── services/            → Camada de comunicação HTTP REST e serviços locais (auth, pets, tasks, users, historico, trainings, ai, storage, notifications)
├── types/               → Contratos TypeScript espelhando a API Java (zero any)
└── utils/               → Schemas Zod (schemas.ts), normalização de datas (petUtils.ts), markdownUtils.tsx e trainingUtils.ts
```

---

## 🔐 3. Segurança, Sessão & Blindagem da Role ADMIN

1. **Hardware Seguro:** O token JWT emitido com criptografia assimétrica RSA e o e-mail identificador são persistidos exclusivamente nas camadas nativas de hardware seguro (`expo-secure-store`). O app não utiliza AsyncStorage para tokens.
2. **Ciclo de Vida de Sessão & Expiração 401:**
   - O interceptor em `src/services/http.ts` injeta `Authorization: Bearer <token>` em todas as requisições autenticadas.
   - Ao receber `401 Unauthorized`, a sessão é limpa de forma atômica no hardware seguro (`StorageService.clearAuthSession()`), o estado global do `AuthContext` é resetado para `null`, invalidando o cache do `QueryClient` e redirecionando o usuário à tela de login.
3. **Ciclo de Vida da Role do Tutor:**
   - Todo tutor nasce no perfil gratuito **`COMUM`** (`POST /usuarios`).
   - O upgrade para **`PREMIUM`** pode ser acionado sob demanda no perfil ou nos cards de bloqueio (`PATCH /usuarios/me/upgrade-premium`).
4. **Blindagem Absoluta da Role ADMIN:**
   - O aplicativo móvel **NUNCA** deve conter campos, selectors ou referências à role `ADMIN`. Apenas o backend conhece e autoriza administradores.

---

## 🌐 4. Mapa Canônico de Integração HTTP com a API Java & IA

### Endpoints Java Efetivamente Consumidos pelo App Mobile
- **Autenticação & Sessão:**
  - `POST /login`: Autenticação e obtenção do Bearer Token JWT assinado com RSA.
  - `POST /usuarios`: Onboarding de tutor com validação de CEP via ViaCEP.
  - `GET /usuarios/me`: Restaura perfil e sessão do usuário logado via JWT.
  - `PUT /usuarios/me`: Atualização cadastral do próprio tutor via JWT.
  - `DELETE /usuarios/me`: Exclusão permanente da conta e dados (LGPD).
  - `PATCH /usuarios/me/upgrade-premium`: Upgrade de perfil de `COMUM` para `PREMIUM`.
  - `GET /usuarios/me/rede-cuidado`: Visão agregada completa da rede familiar e pontuação acumulada via Stored Procedure Oracle.
- **Pets & Care Circle:**
  - `GET /pets/me`: Lista pets do usuário (paginação padrão de 20 para seletores e 4 por página no FamilyPet via `usePets(petsPage, PETS_PAGE_SIZE)`).
  - `GET /pets/me/pontos`: Pontuação agregada de todos os pets do tutor via Stored Procedure Oracle (Zero N+1).
  - `GET /pets/{id}/detalhe`: Ficha consolidada do pet com pontuação, cuidadores (`CoCuidadorResponse[]`), tarefas concluídas e prontuário clínico.
  - `POST /pets`: Criação de novo pet, vinculando o criador automaticamente como responsável principal.
  - `PUT /pets/{id}`: Atualização cadastral do pet (restrito ao responsável principal ou `ADMIN`).
  - `DELETE /pets/{id}`: Remoção do pet (restrito ao responsável principal).
  - `POST /pets/{petId}/cuidadores`: Envio de convite de co-cuidador por e-mail.
  - `DELETE /pets/{petId}/cuidadores/me`: Desvinculação do próprio cuidador autenticado do pet via JWT (`sairDoCareCircle`).
  - `DELETE /pets/{petId}/cuidadores?email=...`: Desvinculação de co-cuidador por e-mail.
  - `PATCH /pets/{petId}/responsavel-principal`: Transferência atômica de titularidade principal via Stored Procedure Oracle.
- **Tarefas da Rotina:**
  - `GET /tarefas/me`: Tarefas do cuidador logado com auto-expiração de tarefas atrasadas no banco via Spring Data.
  - `POST /tarefas`: Criação de nova tarefa de cuidado vinculada a um pet.
  - `PUT /tarefas/{id}`: Edição de parâmetros e prazos de uma rotina existente.
  - `PATCH /tarefas/{id}/concluir`: Conclusão em 1 toque, creditando pontos ao score do pet e disparando trigger de auditoria no Oracle.
  - `PATCH /tarefas/{id}/desmarcar`: Estorno de tarefa concluída para `PENDENTE` e reversão dos pontos.
  - `DELETE /tarefas/{id}`: Exclusão de rotina de cuidado.
- **Prontuário Médico:**
  - `GET /historicos/pet/{petId}`: Prontuário médico do pet ordenado por data mais recente.
  - `POST /historicos`: Registro de evento clínico (vacina, consulta, exame, medicação).
  - `PUT /historicos/{id}`: Edição de registro de saúde prévio.
  - `DELETE /historicos/{id}`: Remoção de registro do prontuário médico.
- **Trilhas Didáticas:**
  - `GET /trilhas/me`: Árvore consolidada completa de trilhas, módulos e aulas didáticas dos pets do tutor (Zero Waterfalls).
  - `GET /aulas/{aulaId}/conteudo`: Conteúdo rico NoSQL armazenado no MongoDB Atlas (Markdown pedagógico e links multimídia).
  - `PATCH /aulas/{id}/concluir`: Conclusão de lição educativa e cômputo de pontos gamificados.
  - `PATCH /aulas/{id}/desmarcar`: Estorno de lição e reversão de pontos didáticos.

> **Catálogo de Endpoints de Suporte da API Java (Web/Back-office):**  
> Os endpoints `GET /tarefas/me/pontos`, `GET /historicos/me`, `GET /modulos/trilha/{id}`, `GET /aulas/modulo/{id}` e `GET /pets/{petId}/cuidadores` permanecem implementados e disponíveis na API Java para consumidores web ou granulares, enquanto o aplicativo móvel prioriza as rotas consolidadas em batch (`/pets/me/pontos`, `/trilhas/me`, `/pets/{id}/detalhe`).

---

### 🤖 Microsserviço de IA Preventiva (Python FastAPI no Render)

O app se integra ao microsserviço Python (`deploy_guardianai_render`) especializado em triagem clínica, toxicologia e bem-estar preventivo:

| Método / Rota | Payload de Envio (Request) | Payload de Retorno (Response) | Propósito & Regra de Negócio |
| :--- | :--- | :--- | :--- |
| `POST /ai/chat` | `AiChatRequestPayload` (`pergunta`, `petContext`, `historico`, `sessionId`) | `AiChatResponsePayload` (`resposta`, `categoria`, `urgencia`, `acoes_recomendadas`, `origem_resposta`, `sessionId`) | Chat clínico multi-turnos com guardrails toxicológicos/farmacológicos determinísticos e inferência via Groq/Gemini. |
| `POST /ai/insights` | `AiPetContextPayload` (`id`, `nome`, `raca`, `porte`, `dataNasc`, `idade`, `sexo`, `castrado`) | `{ insights: AiPetInsight[] }` | Recomendações preventivas personalizadas baseadas no porte e faixa etária do pet. |
| `GET /ai/sessions` | Query params: `pet_id`, `limit=30` | `{ total: number, sessoes: AiChatSession[] }` | Lista o histórico de conversas anteriores do pet (estilo ChatGPT/Claude). |
| `GET /ai/history` | Query params: `session_id`, `limit=100` | `{ total: number, mensagens: MensagemBancoRaw[] }` | Restaura todas as mensagens trocadas em uma sessão específica gravadas no SQLite. |
| `DELETE /ai/sessions/{id}` | Path param: `session_id` | `{ status: "ok" \| "error", session_id: string }` | Exclusão definitiva de uma sessão e seus registros de auditoria no SQLite. |
| `GET /` | Nenhum (GET simples) | `{ status: "ok", app: "Guardian AI" }` | Ping leve de warm-up (acorda a instância no Render e reduz latência de cold start). |

> **Contexto do Pet na IA (`formatPetContext`):**  
> A IA recebe dados cadastrais e biológicos essenciais do animal (`id`, `nome`, `raca`, `porte`, `dataNasc`, `idade` calculada em anos, `sexo`, `castrado`), suficientes para os motores de inferência e matrizes clínicas por idade e porte do microsserviço Python.

---

## ⚡ 5. Gerenciamento de Estado & TanStack Query

1. **Mutações Declarativas (Sem `mutateAsync` nas Telas):**
   - Não utilizar `mutateAsync` com blocos imperativos `try / catch` nas telas.
   - Utilizar `mutate` com callbacks nativos `onSuccess` e `onError`.
2. **Invalidação Granular de Cache:**
   - Conclusão de tarefa/aula invalida apenas chaves de tarefas, usuários e pontos do pet afetado.
   - Convites ou remoções de cuidadores invalidam apenas `['pets', 'caregivers']`.
3. **Consumo Agregado Batch via `/me` (Zero Loops N+1):**
   - O app nunca executa loops de consultas por ID individual para carregar listas.
   - Carrega em batch via `/pets/me`, `/pets/me/pontos` e `/usuarios/me/rede-cuidado` e filtra em memória no cliente pelo `activePet.id`.

---

## 🔒 6. Regras Obrigatórias de Código (Clean Code / SOLID)

1. **Strict Typing (Zero `any`):** Proibido o uso de `any` ou `as any`. Utilizar genéricos, inferência Zod ou interfaces de domínio.
2. **Clean Forms (Sem Mocks em Produção):** Formulários iniciam vazios com validação real Zod.
3. **Arquitetura com Domain Hooks (SRP / DRY):** Toda lógica de dados, mutações e sanitizações deve residir em um Domain Hook (`useHomeData`, `useFamilyCare`, `usePetDetail`, `useTrainings`, `useUserProfile`). A tela é estritamente declarativa.
4. **Data de Nascimento nos Pets (`dataNasc`):** O cadastro opera exclusivamente com `dataNasc` (`DD/MM/AAAA` no input, ISO `YYYY-MM-DD` na API). Idade é calculada e formatada dinamicamente via `petUtils.ts`.

---

## 🔔 7. Especificação Técnica da Sprint 4 (Notificações, Tematização & Versão)

1. **Notificações Locais Determinísticas (`NotificationService`):**
   - Agendamento com identificador único determinístico `task_${tarefaId}` para evitar alarmes duplicados.
   - Cancelamento automático quando a tarefa é concluída ou estornada.
   - Suporte a antecedência global configurável pelo usuário (0, 5, 15, 30 ou 60 minutos antes do prazo) via `NotificationSettingsModal`.
   - Preferências salvas de forma resiliente no `AsyncStorage` (`@petguardian:notification_settings`).
   - Sincronização automática em primeiro plano (AppState) e inicialização, cancelando alarmes órfãos e limitando aos ~60 alarmes mais próximos (limite iOS).
   - Redirecionamento nativo e seguro ao tocar na notificação com suporte a deep link para a ficha do pet (`'Family'` -> `'PetDetail'`, com `petId`) ou rotina (`'Tabs'` -> `'Home'`).
   - Sem métodos ou botões de teste/mock em produção (conforme edital FIAP).
2. **Tema Claro / Modo Escuro (`ThemeContext`):**
   - Provedor reativo encapsulado em `ThemeProvider`, expondo `theme`, `isDark`, `themeMode` e `toggleTheme()`.
   - Tokens consolidados em `src/constants/theme.ts` (`lightTheme` e `darkTheme`).
   - Sincronização automática com a `StatusBar` (`light` no escuro, `dark` no claro).
3. **Metadados de Versão & Avaliação FIAP (`SobreAppModal`, `version.ts` & `app.config.js`):**
   - Centralização de metadados obrigatórios do edital: Nome da aplicação, versão `1.0.0`, número da build `#4`, lista de membros com RMs e canal de distribuição (GitHub Release / APK Android).
   - **Sincronização Dinâmica do Commit Git:** Configuração dinâmica no Expo (`app.config.js`) que lê o HEAD do Git em tempo de execução via `expo-constants` (`Constants.expoConfig?.extra?.gitCommit`), garantindo que o hash exibido na aplicação reflita sempre o commit real da entrega sem gerar arquivos no repositório.