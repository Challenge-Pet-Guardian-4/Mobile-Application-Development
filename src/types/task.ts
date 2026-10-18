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

export interface LembreteParams {
  id: number;
  titulo: string;
  petId: number;
  prazo: string;
  pontosTarefa?: number;
}

export interface HeaderActionButton {
  label: string;
  icon?: 'add' | 'chevron-forward';
  variant?: 'primary' | 'link';
  onPress: () => void;
}

export interface TasksRoutineData {
  title?: string;
  subtitle?: string;
  filter: 'HOJE' | 'TODAS';
  onFilterChange: (filter: 'HOJE' | 'TODAS') => void;
  countHoje: number;
  countTodas: number;
  tasks: TarefaResponse[];
  onToggleTask?: (taskId: number) => void;
  onEditTask?: (task: TarefaResponse) => void;
  onDeleteTask?: (taskId: number) => void;
}

export interface TasksRoutineSectionProps extends Partial<TasksRoutineData> {
  routineData?: TasksRoutineData;
  pets?: PetResponse[];
  headerButton?: HeaderActionButton;
  emptyTitle?: string;
  emptyDesc?: string;
  pageSize?: number;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalElements?: number;
    onPageChange: (newPage: number) => void;
    isLoading?: boolean;
  };
}

export interface DiaOfensiva {
  id: string;
  dayLabel: string;
  dayNumber: string;
  done: boolean;
  isToday?: boolean;
  missed?: boolean;
}

export interface StreakCardProps {
  streakDays?: DiaOfensiva[];
  totalStreak?: number;
  tasks?: TarefaResponse[];
}

