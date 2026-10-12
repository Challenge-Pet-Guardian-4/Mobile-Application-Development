export type AntecedenciaMinutos = 0 | 5 | 15 | 30 | 60;

export interface NotificationSettings {
  ativado: boolean;
  minutosAntecedencia: AntecedenciaMinutos;
}

export interface NotificationPayloadData {
  tipo: 'ROTINA_LEMBRETE' | 'TAREFA_CONCLUIDA' | 'PET_SCORE_UP';
  tarefaId?: number;
  petId?: number;
  rota?: string;
}

export interface OpcaoAntecedencia {
  valor: AntecedenciaMinutos;
  rotulo: string;
  descricao: string;
}
