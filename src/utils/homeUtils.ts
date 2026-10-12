import { TarefaResponse, TaskFormData, RotinaHomeView, StatusScoreBar, MetricasTarefas } from '../types/task';
import { ordenarTarefasRotina } from './taskUtils';
import { AppTheme, colors } from '../constants/theme';

/**
 * Calcula os estados visuais e métricas da barra de progresso diária da Home.
 */
export function obterStatusScoreBar(
  concluidas: number,
  expiradas: number,
  total: number,
  theme: AppTheme
): StatusScoreBar {
  const hasTasks = total > 0;
  const percentage = hasTasks ? Math.round((concluidas / total) * 100) : 0;

  if (concluidas === total && hasTasks) {
    return {
      percentage,
      statusTexto: 'Tudo em Dia ✨',
      statusCor: colors.success.default,
      statusBg: theme.badgeSuccessBg,
      progressColor: colors.success.default,
    };
  }

  if (expiradas > 0) {
    return {
      percentage,
      statusTexto: expiradas === 1 ? '1 Tarefa Expirada ⚠️' : `${expiradas} Tarefas Expiradas ⚠️`,
      statusCor: colors.danger[600],
      statusBg: theme.badgeDangerBg,
      progressColor: percentage > 0 ? colors.warning[500] : colors.danger[500],
    };
  }

  if (percentage >= 50) {
    return {
      percentage,
      statusTexto: 'Em Andamento 👍',
      statusCor: colors.warning[600],
      statusBg: theme.badgeWarningBg,
      progressColor: colors.warning[500],
    };
  }

  if (hasTasks) {
    return {
      percentage,
      statusTexto: 'Tarefas Pendentes 📋',
      statusCor: theme.primary,
      statusBg: theme.badgePrimaryBg,
      progressColor: theme.primary,
    };
  }

  return {
    percentage: 0,
    statusTexto: 'Sem Tarefas Hoje 🐾',
    statusCor: theme.textSecondary,
    statusBg: theme.surfaceMuted,
    progressColor: theme.border,
  };
}

/**
 * Converte uma entidade de tarefa retornada pela API para a estrutura
 * de dados de formulário esperada pelo modal de edição.
 */
export function formatarDadosIniciaisTarefa(tarefa?: TarefaResponse): TaskFormData | undefined {
  if (!tarefa) return undefined;
  return {
    petId: tarefa.petId,
    titulo: tarefa.titulo,
    descricao: tarefa.descricao,
    pontos: String(tarefa.pontosTarefa),
    prazo: tarefa.prazo,
    status: tarefa.status,
    conclusao: tarefa.conclusao,
  };
}

/**
 * Constrói o estado consolidado da seção de rotina da tela Home (Hoje vs Todas),
 * incluindo títulos, subtítulos dinâmicos e contadores.
 */
export function construirRotinaHome(
  filtroRotina: 'HOJE' | 'TODAS',
  tarefasHoje: TarefaResponse[],
  tarefasGerais: TarefaResponse[],
  metricasHoje: MetricasTarefas,
  metricasGerais: MetricasTarefas
): RotinaHomeView {
  const isHoje = filtroRotina === 'HOJE';
  const tarefasFiltradas = isHoje ? tarefasHoje : ordenarTarefasRotina(tarefasGerais);
  const m = isHoje ? metricasHoje : metricasGerais;
  const c = m.concluidas.length;
  const e = m.expiradas.length;
  const total = tarefasFiltradas.length;

  return {
    tarefas: tarefasFiltradas,
    concluidas: c,
    ativas: m.ativas.length,
    expiradas: e,
    total,
    title: isHoje ? 'Rotina de Hoje' : 'Todas as Tarefas',
    subtitle: `${c} de ${total} concluídas ${isHoje ? 'hoje' : 'no total'}${e > 0 ? ` • ${e} expirada${e > 1 ? 's' : ''}` : ''}`,
    emptyTitle: isHoje ? 'Nenhuma tarefa agendada para hoje' : 'Nenhuma tarefa cadastrada',
    emptyDesc: 'Crie novas tarefas para seu pet na aba Family Pet.',
  };
}
