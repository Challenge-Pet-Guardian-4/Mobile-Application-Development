export const queryKeys = {
  // Autenticação e Usuário
  auth: {
    me: ['auth', 'me'] as const,
    session: ['auth', 'session'] as const,
  },
  users: {
    all: ['users'] as const,
    me: ['users', 'me'] as const,
    redeCuidado: ['users', 'me', 'rede-cuidado'] as const,
  },

  // Pets
  pets: {
    all: ['pets'] as const,
    myPets: (page = 0, size = 20) => ['pets', 'me', page, size] as const,
    myPontos: ['pets', 'me', 'pontos'] as const,
    detail: (id?: number) => ['pets', 'detail', id ?? 0] as const,
  },

  // Tarefas
  tasks: {
    all: ['tasks'] as const,
    myTasks: (status = 'ALL', page = 0, size = 100) => ['tasks', 'me', status, page, size] as const,
  },

  // Treinamentos
  training: {
    all: ['training'] as const,
    myTracks: ['training', 'me'] as const,
  },

  // Assistente de IA
  ai: {
    insights: (petId?: number) => ['ai', 'insights', petId ?? 0] as const,
    messages: (petId?: number) => ['ai', 'messages', petId ?? 0] as const,
    sessions: (petId?: number) => ['ai', 'sessions', petId ?? 0] as const,
  },

  // Prontuário de Saúde & Eventos Clínicos (Histórico)
  historicos: {
    all: ['historicos'] as const,
  },
};
