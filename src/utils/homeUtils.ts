import { TarefaResponse, TaskFormData, RotinaHomeView } from '../types/task';
import { MetricasTarefas, ordenarTarefasRotina } from './taskUtils';

export type { RotinaHomeView };

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
