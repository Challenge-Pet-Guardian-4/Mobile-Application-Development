import { useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { useCreateTask, useCompleteTask, useUncompleteTask, useUpdateTask, useDeleteTask } from './useTasks';
import { usePets } from './usePets';
import { TarefaResponse, TaskFormData, AlternarStatusOptions } from '../types/task';
import { ActionCallbacks } from '../types/api';
import { TaskSchema, formatZodError } from '../utils/schemas';
import { normalizarPrazoParaIso } from '../utils/petUtils';
import { createMutationCallbacks } from '../utils/apiError';
import { NotificationService } from '../services/notifications';

interface LembreteParams {
  id: number;
  titulo: string;
  petId: number;
  prazo: string;
  pontosTarefa?: number;
}

/**
 * Hook de domínio reutilizável para centralizar o ciclo de vida e mutações de tarefas,
 * integrando validações com Zod, feedback nativo e notificações locais.
 */
export function useTaskActions() {
  const { data: petsData } = usePets();

  const petMap = useMemo(() => {
    const list = petsData?.content || [];
    return new Map(list.map((p) => [p.id, p.nome]));
  }, [petsData?.content]);

  const obterNomeDoPet = useCallback(
    (petId: number) => petMap.get(petId) || 'seu pet',
    [petMap]
  );

  const createTaskMutation = useCreateTask();
  const completeTaskMutation = useCompleteTask();
  const uncompleteTaskMutation = useUncompleteTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  // Helper DRY para agendar lembrete com nome real do pet
  const agendarLembrete = useCallback(
    (t: LembreteParams) => {
      NotificationService.agendarNotificacaoTarefa({
        tarefaId: t.id,
        titulo: t.titulo,
        nomePet: obterNomeDoPet(t.petId),
        petId: t.petId,
        prazoIso: t.prazo,
        pontos: t.pontosTarefa,
        status: 'PENDENTE',
      });
    },
    [obterNomeDoPet]
  );

  // Helper DRY para celebrar conclusão e limpar lembrete pendente
  const notificarConclusao = useCallback(
    (t: TarefaResponse) => {
      NotificationService.cancelarNotificacaoTarefa(t.id);
      NotificationService.notificarConclusaoTarefa({
        tarefaId: t.id,
        titulo: t.titulo,
        nomePet: obterNomeDoPet(t.petId),
        petId: t.petId,
        pontos: t.pontosTarefa,
      });
    },
    [obterNomeDoPet]
  );

  // Helper para exibir opções ou alerta de tarefa expirada
  const tratarTarefaExpirada = useCallback(
    (tarefa: TarefaResponse, options?: AlternarStatusOptions) => {
      if (options?.onExpired) {
        options.onExpired(tarefa);
        return;
      }

      if (options?.onEdit) {
        Alert.alert(
          'Tarefa Expirada',
          'Esta tarefa expirou e não pode ser concluída diretamente. Deseja definir um novo horário futuro para reativá-la?',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Editar Tarefa', onPress: () => options.onEdit!(tarefa) },
          ]
        );
        return;
      }

      Alert.alert(
        'Tarefa Expirada',
        'Esta tarefa já expirou e não pode ser concluída diretamente. Para reativá-la como pendente, clique no lápis de edição e defina uma nova data e horário futuro.',
        [{ text: 'Entendi' }]
      );
    },
    []
  );

  const alternarStatus = useCallback(
    (taskId: number, tarefas: TarefaResponse[], options?: AlternarStatusOptions) => {
      const tarefa = tarefas.find((t) => t.id === taskId);
      if (!tarefa) return;

      if (tarefa.status === 'CONCLUIDO') {
        uncompleteTaskMutation.mutate(
          taskId,
          createMutationCallbacks('Erro ao Desmarcar', 'Não foi possível desmarcar a tarefa.', {
            ...options,
            onSuccess: () => {
              agendarLembrete(tarefa);
              options?.onSuccess?.();
            },
          })
        );
      } else if (tarefa.status === 'EXPIRADO') {
        tratarTarefaExpirada(tarefa, options);
      } else {
        completeTaskMutation.mutate(
          taskId,
          createMutationCallbacks('Erro ao Concluir', 'Não foi possível concluir a tarefa.', {
            ...options,
            onSuccess: () => {
              notificarConclusao(tarefa);
              options?.onSuccess?.();
            },
          })
        );
      }
    },
    [completeTaskMutation, uncompleteTaskMutation, agendarLembrete, notificarConclusao, tratarTarefaExpirada]
  );

  const excluirComConfirmacao = useCallback(
    (taskId: number, callbacks?: ActionCallbacks) => {
      Alert.alert('Remover Tarefa', 'Deseja realmente remover esta rotina?', [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            deleteTaskMutation.mutate(
              taskId,
              createMutationCallbacks('Erro ao Excluir', 'Não foi possível excluir a tarefa.', {
                ...callbacks,
                onSuccess: () => {
                  NotificationService.cancelarNotificacaoTarefa(taskId);
                  callbacks?.onSuccess?.();
                },
              })
            );
          },
        },
      ]);
    },
    [deleteTaskMutation]
  );

  const atualizar = useCallback(
    (taskId: number, data: TaskFormData, callbacks?: ActionCallbacks) => {
      const validacao = TaskSchema.safeParse(data);
      if (!validacao.success) {
        Alert.alert('Dados da Tarefa', formatZodError(validacao.error));
        return;
      }

      const statusFinal = data.status || 'PENDENTE';
      const prazoIso = normalizarPrazoParaIso(data.prazo);
      const conclusaoIso =
        statusFinal === 'CONCLUIDO'
          ? (data.conclusao ? normalizarPrazoParaIso(data.conclusao, '12:00:00') : new Date().toISOString().slice(0, 19))
          : null;

      updateTaskMutation.mutate(
        {
          id: taskId,
          data: {
            titulo: data.titulo.trim(),
            descricao: data.descricao.trim(),
            pontosTarefa: Number(data.pontos),
            prazo: prazoIso,
            petId: data.petId,
            status: statusFinal,
            conclusao: conclusaoIso,
          },
        },
        createMutationCallbacks('Erro ao Atualizar', 'Não foi possível atualizar a tarefa.', {
          ...callbacks,
          onSuccess: () => {
            if (statusFinal === 'PENDENTE') {
              agendarLembrete({
                id: taskId,
                titulo: data.titulo.trim(),
                petId: data.petId,
                prazo: prazoIso,
                pontosTarefa: Number(data.pontos),
              });
            } else {
              NotificationService.cancelarNotificacaoTarefa(taskId);
            }
            callbacks?.onSuccess?.();
          },
        })
      );
    },
    [updateTaskMutation, agendarLembrete]
  );

  const cadastrar = useCallback(
    (data: TaskFormData, callbacks?: ActionCallbacks) => {
      const validacao = TaskSchema.safeParse(data);
      if (!validacao.success) {
        Alert.alert('Dados da Tarefa', formatZodError(validacao.error));
        return;
      }

      const statusFinal = data.status || 'PENDENTE';
      const prazoIso = normalizarPrazoParaIso(data.prazo);

      createTaskMutation.mutate(
        {
          titulo: data.titulo.trim(),
          descricao: data.descricao.trim(),
          pontosTarefa: Number(data.pontos),
          prazo: prazoIso,
          petId: data.petId,
          status: statusFinal,
        },
        createMutationCallbacks('Erro ao Cadastrar Tarefa', 'Não foi possível cadastrar a tarefa na API.', {
          ...callbacks,
          onSuccess: () => {
            if (statusFinal === 'PENDENTE') {
              agendarLembrete({
                id: Date.now(),
                titulo: data.titulo.trim(),
                petId: data.petId,
                prazo: prazoIso,
                pontosTarefa: Number(data.pontos),
              });
            }
            callbacks?.onSuccess?.();
          },
        })
      );
    },
    [createTaskMutation, agendarLembrete]
  );

  return {
    cadastrar,
    alternarStatus,
    excluirComConfirmacao,
    atualizar,
    isCreating: createTaskMutation.isPending,
    isUpdating: updateTaskMutation.isPending,
    isDeleting: deleteTaskMutation.isPending,
    isCompleting: completeTaskMutation.isPending,
    isUncompleting: uncompleteTaskMutation.isPending,
    isPending:
      createTaskMutation.isPending ||
      completeTaskMutation.isPending ||
      uncompleteTaskMutation.isPending ||
      updateTaskMutation.isPending ||
      deleteTaskMutation.isPending,
  };
}
