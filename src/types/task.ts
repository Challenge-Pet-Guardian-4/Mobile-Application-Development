import { PetResponse } from './pet';
import { ActionCallbacks } from './api';

export interface AlternarStatusOptions extends ActionCallbacks {
  onExpired?: (tarefa: TarefaResponse) => void;
  onEdit?: (tarefa: TarefaResponse) => void;
}

export type EnumStatus = 'PENDENTE' | 'CONCLUIDO' | 'EXPIRADO';

export interface TarefaRequest {
  titulo: string;
  pontosTarefa: number;
  descricao: string;
  prazo: string; // ISO 8601 LocalDateTime
  petId: number;
  status: EnumStatus;
  conclusao?: string | null;
}

export interface TarefaResponse {
  id: number;
  titulo: string;
  pontosTarefa: number;
  descricao: string;
  criacao: string;
  prazo: string;
  conclusao: string | null;
  status: EnumStatus;
  usuarioEmail: string | null;
  usuarioNome: string | null;
  petId: number;
}

export interface TaskFormData {
  petId: number;
  titulo: string;
  descricao: string;
  pontos: string;
  prazo?: string;
  status?: EnumStatus;
  conclusao?: string | null;
}

export interface RotinaHomeView {
  tarefas: TarefaResponse[];
  concluidas: number;
  ativas: number;
  expiradas: number;
  total: number;
  title: string;
  subtitle: string;
  emptyTitle: string;
  emptyDesc: string;
}

export interface MetricasTarefas {
  concluidas: TarefaResponse[];
  pendentes: TarefaResponse[];
  expiradas: TarefaResponse[];
  ativas: TarefaResponse[];
  total: number;
}

export interface StatusScoreBar {
  percentage: number;
  statusTexto: string;
  statusCor: string;
  statusBg: string;
  progressColor: string;
}

export interface HomeScoreBarProps {
  pets?: {
    active?: PetResponse;
    [key: string]: unknown;
  };
  routine?: {
    score?: number;
    completedToday?: TarefaResponse[];
    expiredToday?: TarefaResponse[];
    todayTasks?: TarefaResponse[];
    [key: string]: unknown;
  };
  onPress: () => void;
}

