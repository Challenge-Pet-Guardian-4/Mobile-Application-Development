export const queryKeys = {
  // Autenticação e Usuário
  auth: {
    me: ['auth', 'me'] as const,
    session: ['auth', 'session'] as const,
  },
  users: {
    all: ['users'] as const,
    me: ['users', 'me'] as const,
    detail: (id?: number) => ['users', 'detail', id ?? 0] as const,
    byEmail: (email: string) => ['users', 'email', email] as const,
    redeCuidado: ['users', 'me', 'rede-cuidado'] as const,
  },

  // Pets
  pets: {
    all: ['pets'] as const,
    list: (page = 0, size = 20) => ['pets', 'list', { page, size }] as const,
    myPets: (page = 0, size = 20) => ['pets', 'me', page, size] as const,
    detail: (id?: number) => ['pets', 'detail', id ?? 0] as const,
    history: (id?: number) => ['pets', 'history', id ?? 0] as const,
    pontos: (id?: number) => ['pets', 'pontos', id ?? 0] as const,
    caregivers: (id?: number) => ['pets', 'caregivers', id ?? 0] as const,
  },

  // Tarefas
  tasks: {
    all: ['tasks'] as const,
    list: (page = 0, size = 50) => ['tasks', 'list', { page, size }] as const,
    myTasks: (status = 'ALL', page = 0, size = 50) => ['tasks', 'me', status, page, size] as const,
    detail: (id?: number) => ['tasks', 'detail', id ?? 0] as const,
    myPoints: ['tasks', 'me', 'pontos'] as const,
  },

  // Treinamentos
  training: {
    all: ['training'] as const,
    tracks: ['training', 'tracks'] as const,
    byPet: (petId?: number) => ['training', 'pet', petId] as const,
    trackDetail: (id: string) => ['training', 'tracks', id] as const,
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
    byPet: (petId?: number) => ['historicos', 'pet', petId ?? 0] as const,
    detail: (id?: number) => ['historicos', 'detail', id ?? 0] as const,
  },
};
