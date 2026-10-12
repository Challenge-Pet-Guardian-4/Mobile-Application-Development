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

export interface PermissaoNativaStatus {
  concedida: boolean;
  canAskAgain: boolean;
}

export interface PermissaoNativaResponse {
  granted?: boolean;
  status?: string;
  canAskAgain?: boolean;
}

export interface AgendarNotificacaoTarefaParams {
  tarefaId: number;
  titulo: string;
  nomePet: string;
  petId: number;
  prazoIso?: string;
  pontos?: number;
  status?: string;
}
