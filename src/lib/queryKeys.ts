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
    myHistory: ['pets', 'me', 'historico'] as const,
    history: (id?: number) => ['pets', 'history', id ?? 0] as const,
    pontos: (id?: number) => ['pets', 'pontos', id ?? 0] as const,
    caregivers: (id?: number) => ['pets', 'caregivers', id ?? 0] as const,
  },

  // Tarefas
  tasks: {
    all: ['tasks'] as const,
    myTasks: (status = 'ALL', page = 0, size = 50) => ['tasks', 'me', status, page, size] as const,
    myPoints: ['tasks', 'me', 'pontos'] as const,
  },

  // Treinamentos
  training: {
    all: ['training'] as const,
    tracks: ['training', 'tracks'] as const,
    myTracks: ['training', 'me'] as const,
    byPet: (petId?: number) => ['training', 'pet', petId] as const,
    trackDetail: (id: string) => ['training', 'tracks', id] as const,
    lessonContent: (aulaId: number) => ['training', 'lesson', aulaId, 'content'] as const,
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
    myHistoricos: ['historicos', 'me'] as const,
    byPet: (petId?: number) => ['historicos', 'pet', petId ?? 0] as const,
  },
};
