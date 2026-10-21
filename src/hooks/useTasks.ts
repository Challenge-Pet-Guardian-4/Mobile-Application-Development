import { useQuery, useMutation, useQueryClient, QueryClient } from '@tanstack/react-query';
import { TaskService } from '../services/tasks';
import { queryKeys } from '../lib/queryKeys';
import { Page } from '../types/api';
import { TarefaRequest, TarefaResponse } from '../types/task';

export const DEFAULT_TASKS_PAGE_SIZE = 100;

function invalidarQueriesTarefas(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
  queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
  queryClient.invalidateQueries({ queryKey: queryKeys.pets.all });
}

interface PreviousTasksContext {
  previousTasksQueries: [readonly unknown[], Page<TarefaResponse> | undefined][];
}

function criarMutacaoStatusOtimista(
  queryClient: QueryClient,
  mutationFn: (id: number) => Promise<TarefaResponse>,
  atualizarTarefa: (task: TarefaResponse) => TarefaResponse
) {
  return {
    mutationFn,
    onMutate: async (id: number): Promise<PreviousTasksContext> => {
      await queryClient.cancelQueries({ queryKey: queryKeys.tasks.all });

      const previousTasksQueries = queryClient.getQueriesData<Page<TarefaResponse>>({
        queryKey: queryKeys.tasks.all,
      });

      queryClient.setQueriesData<Page<TarefaResponse>>(
        { queryKey: queryKeys.tasks.all },
        (old) => {
          if (!old || !old.content) {
            return old;
          }
          return {
            ...old,
            content: old.content.map((task) => (task.id === id ? atualizarTarefa(task) : task)),
          };
        }
      );

      return { previousTasksQueries };
    },
    onError: (_err: unknown, _variables: number, context?: PreviousTasksContext) => {
      if (context?.previousTasksQueries) {
        context.previousTasksQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      invalidarQueriesTarefas(queryClient);
    },
  };
}

export function useUserTasks(page = 0, size = DEFAULT_TASKS_PAGE_SIZE, status = 'ALL') {
  return useQuery({
    queryKey: queryKeys.tasks.myTasks(status, page, size),
    queryFn: () => TaskService.getMyTarefas(page, size, status),
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: TarefaRequest) => TaskService.createTarefa(request),
    onSuccess: () => {
      invalidarQueriesTarefas(queryClient);
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: TarefaRequest }) => TaskService.updateTarefa(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.pets.all });
    },
  });
}

export function useCompleteTask() {
  const queryClient = useQueryClient();

  return useMutation(
    criarMutacaoStatusOtimista(
      queryClient,
      (id) => TaskService.concluirTarefa(id),
      (task) => ({ ...task, status: 'CONCLUIDO' })
    )
  );
}

export function useUncompleteTask() {
  const queryClient = useQueryClient();

  return useMutation(
    criarMutacaoStatusOtimista(
      queryClient,
      (id) => TaskService.desmarcarTarefa(id),
      (task) => ({ ...task, status: 'PENDENTE', conclusao: null })
    )
  );
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => TaskService.deleteTarefa(id),
    onSuccess: () => {
      invalidarQueriesTarefas(queryClient);
    },
  });
}
