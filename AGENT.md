# 🤖 AGENT.md — Guia Arquitetural & Especificação Técnica (Mobile-Application-Development)

Este documento é a referência definitiva para agentes de IA e desenvolvedores sobre a arquitetura, telas, contratos de API, gerenciamento de estado, rotas e fluxos do aplicativo móvel **PetGuardian** (Ecossistema Clyvo).

---

## 🏛️ 1. Stack Tecnológica & Arquitetura Base

- **Framework & Runtime:** React Native 0.86.3 com **Expo SDK 57** (`expo@~57.0.20`, Metro Runtime, Expo Status Bar).
- **Linguagem & Tipagem:** TypeScript ~6.0.3 (**Tipagem Estrita — Zero `any`**, tipagem estrita de rotas, props e payloads).
- **Gerenciamento de Estado Assíncrono:** **TanStack Query v5** (`@tanstack/react-query@^5.102.6`) com mutações declarativas (`mutate` com `onSuccess`/`onError`) e invalidação granular de cache.
- **Padrão de Dados:** **Domain Hooks** (camada intermediária que isola queries, mutations e lógica de negócio, mantendo telas puramente declarativas).
- **Cliente HTTP Centralizado:** **Axios** (`^1.20.0`) com interceptores para injeção automática de Bearer Token JWT e captura global de status `401 Unauthorized`.
- **Hardware Seguro & Persistência:** `expo-secure-store` (Keychain iOS / Keystore Android para JWT) + `@react-native-async-storage/async-storage` (cache e preferências).
- **Navegação Nativa:** React Navigation v7 (`@react-navigation/native`, `native-stack`, `bottom-tabs`).
- **Validação de Formulários:** **Zod** (`zod@^4.4.3`) + **React Hook Form** (`^7.75.0`).
- **Design System & Ícones:** `@expo/vector-icons`, tokens em `theme.ts` (Tailwind slate/blue, raios e tipografia).

---

## 📁 2. Estrutura de Diretórios

```text
src/
├── components/          → Componentes visuais atômicos e modulares (PetScoreBar, RoutineCard, StreakCard, Header, Modais)
├── config/              → Configurações de ambiente (env.ts com Railway e Render)
├── constants/           → Tokens de design system, tipografia e paleta de cores (theme.ts)
├── contexts/            → Gestão global de autenticação e sessão segura (AuthContext.tsx)
├── hooks/               → Custom hooks e Domain hooks (Clean Architecture / SRP / TanStack Query):
│   ├── useHomeData.ts         → Dashboard do pet ativo, pontuação e rotinas da Home
│   ├── useFamilyCare.ts       → Gestão colaborativa familiar, pets, tarefas e co-cuidadores
│   ├── usePetDetail.ts        → Ficha clínica, prontuário, histórico e cuidadores do pet
│   ├── useTrainings.ts        → Trilhas de adestramento gamificadas com TanStack Query
│   ├── useUserProfile.ts      → Perfil do tutor, estatísticas, pontuação agregada e exclusão de conta
│   ├── useAiAssistantScreen.ts→ Orquestrador do chat conversacional com IA preventiva e histórico
│   ├── usePets.ts / useTasks.ts / useHistoricos.ts → Queries e mutações especializadas por domínio
│   └── useSession.ts / useActivePet.ts → Hooks utilitários de sessão e pet ativo
├── lib/                 → queryClient.ts (singleton) e queryKeys.ts (fábrica tipada de chaves)
├── routes/              → MainStack.tsx (AuthStack vs AppTabs), tabs.tsx e types.ts (rotas tipadas)
├── screens/             → Telas da aplicação (Welcome, Login, Register, Home, FamilyPet, PetDetail, Training, AI, Profile)
├── services/            → Camada de comunicação HTTP REST (auth, pets, tasks, users, historico, trainings, ai, storage)
├── types/               → Contratos TypeScript espelhando a API Java (zero any)
└── utils/               → Schemas Zod (schemas.ts), normalização de datas (petUtils.ts) e helpers
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

## 🌐 4. Mapa Canônico de Integração HTTP com a API Java

### Autenticação & Usuários (`/login`, `/usuarios`)
- `POST /login`: Autenticação e obtenção do Bearer Token JWT assinado com RSA.
- `POST /usuarios`: Onboarding de tutor com validação de CEP via ViaCEP.
- `GET /usuarios/me`: Restaura perfil e sessão do usuário logado via JWT.
- `PUT /usuarios/me`: Atualização cadastral do próprio tutor via JWT.
- `DELETE /usuarios/me`: Exclusão permanente da conta e dados (LGPD).
- `PATCH /usuarios/me/upgrade-premium`: Upgrade de perfil de `COMUM` para `PREMIUM`.
- `GET /usuarios/me/rede-cuidado`: Visão agregada completa da rede familiar e pontuação acumulada via Stored Procedure Oracle.

### Pets & Care Circle (`/pets`)
- `GET /pets/me`: Lista todos os pets sob tutela do usuário (como titular ou co-cuidador).
- `GET /pets/me/pontos`: Pontuação agregada de todos os pets do tutor via Stored Procedure Oracle (Zero N+1).
- `GET /pets/me/historico`: Tarefas concluídas de todos os pets do usuário logado.
- `POST /pets`: Criação de novo pet, vinculando o criador automaticamente como responsável principal.
- `GET /pets/{id}/pontos`: Pontuação total do pet (tarefas + aulas) via Stored Procedure Oracle `pr_calcular_pontuacao_pet`.
- `GET /pets/{id}/historico`: Histórico consolidado de rotina de cuidados do pet individual.
- `PUT /pets/{id}`: Atualização cadastral do pet (porte, sexo, data de nascimento, castração).
- `DELETE /pets/{id}`: Remoção do pet (restrito ao responsável principal).
- `GET /pets/{petId}/cuidadores`: Lista todos os co-cuidadores vinculados ao animal com seus papéis.
- `POST /pets/{petId}/cuidadores`: Envio de convite de co-cuidador por e-mail.
- `DELETE /pets/{petId}/cuidadores/me`: Desvinculação do próprio cuidador autenticado do pet via JWT (`sairDoCareCircle`).
- `DELETE /pets/{petId}/cuidadores?email=...`: Desvinculação de co-cuidador por e-mail (responsável principal ou o próprio cuidador).
- `PATCH /pets/{petId}/responsavel-principal`: Transferência atômica de titularidade principal via Stored Procedure Oracle.

### Tarefas da Rotina (`/tarefas`)
- `GET /tarefas/me`: Tarefas do cuidador logado com auto-expiração dinâmica de vencidas.
- `POST /tarefas`: Criação de nova tarefa de cuidado vinculada a um pet.
- `PUT /tarefas/{id}`: Edição de parâmetros e prazos de uma rotina existente.
- `PATCH /tarefas/{id}/concluir`: Conclusão em 1 toque, creditando pontos ao score do pet e disparando trigger de auditoria no Oracle.
- `PATCH /tarefas/{id}/desmarcar`: Estorno de tarefa concluída para `PENDENTE` e reversão dos pontos.
- `DELETE /tarefas/{id}`: Exclusão de rotina de cuidado.
- `GET /tarefas/me/pontos`: Consulta de pontos totais de tarefas do tutor.

### Prontuário Clínico & Histórico de Saúde (`/historicos`)
- `GET /historicos/me`: Prontuário médico consolidado de todos os pets do tutor via JWT (batch).
- `GET /historicos/pet/{petId}`: Prontuário médico do pet ordenado por data mais recente.
- `POST /historicos`: Registro de evento clínico (vacina, consulta, exame, cirurgia).
- `PUT /historicos/{id}`: Edição de registro de saúde prévio.
- `DELETE /historicos/{id}`: Remoção de registro do prontuário médico.

### Trilhas Educativas & Conteúdo NoSQL (`/trilhas`, `/modulos`, `/aulas`)
- `GET /trilhas/me`: Lista todas as trilhas cadastradas para o usuário logado via JWT.
- `GET /trilhas/pet/{petId}`: Trilhas de treinamento ativas associadas ao perfil do pet.
- `GET /modulos/trilha/{trilhaId}`: Módulos didáticos da trilha selecionada.
- `GET /aulas/modulo/{moduloId}`: Lições práticas de adestramento do módulo.
- `GET /aulas/{aulaId}/conteudo`: Conteúdo rico NoSQL armazenado no MongoDB (Markdown e links).
- `PATCH /aulas/{id}/concluir`: Conclusão de lição educativa, creditando pontos ao score do pet.
- `PATCH /aulas/{id}/desmarcar`: Estorno de lição e reversão de pontos didáticos.

### Microsserviço de IA Preventiva (Python FastAPI no Render)
- `POST /ai/chat`: Chat conversacional com Google Gemini recebendo o contexto clínico do pet.
- `POST /ai/insights`: Recomendações preventivas de saúde e bem-estar por porte e idade.
- `GET /ai/sessions`: Sessões de conversa anteriores do pet no formato ChatGPT/Claude.
- `GET /ai/history`: Mensagens completas de uma sessão selecionada.
- `DELETE /ai/sessions/{id}`: Remoção permanente de uma conversa do histórico.
- `GET /`: Ping/warm-up para redução de cold-start na nuvem.

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
   - Carrega em batch via `/pets/me`, `/pets/me/pontos`, `/pets/me/historico`, `/historicos/me` e filtra em memória no cliente pelo `activePet.id`.

---

## 🔒 6. Regras Obrigatórias de Código (Clean Code / SOLID)

1. **Strict Typing (Zero `any`):** Proibido o uso de `any` ou `as any`. Utilizar genéricos, inferência Zod ou interfaces de domínio.
2. **Clean Forms (Sem Mocks em Produção):** Formulários iniciam vazios com validação real Zod.
3. **Arquitetura com Domain Hooks (SRP / DRY):** Toda lógica de dados, mutações e sanitizações deve residir em um Domain Hook (`useHomeData`, `useFamilyCare`, `usePetDetail`, `useTrainings`, `useUserProfile`). A tela é estritamente declarativa.
4. **Data de Nascimento nos Pets (`dataNasc`):** O cadastro opera exclusivamente com `dataNasc` (`DD/MM/AAAA` no input, ISO `YYYY-MM-DD` na API). Idade é calculada e formatada dinamicamente via `petUtils.ts`.
