import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TrainingService } from '../services/trainings';
import { queryKeys } from '../lib/queryKeys';

export function useTrilhas(enabled = true) {
  return useQuery({
    queryKey: queryKeys.training.myTracks,
    queryFn: () => TrainingService.getTrilhas(),
    enabled,
  });
}

function parseAulaId(licaoId?: string): number | null {
  const aulaId = Number(licaoId);
  return Number.isInteger(aulaId) && aulaId > 0 ? aulaId : null;
}

export function useConteudoAula(licaoId?: string, enabled = true) {
  const aulaId = parseAulaId(licaoId);

  return useQuery({
    queryKey: queryKeys.lessons.content(aulaId ?? undefined),
    queryFn: () => TrainingService.getConteudoAula(aulaId as number),
    enabled: enabled && aulaId !== null,
    staleTime: 1000 * 60 * 10, // conteúdo pedagógico é estático
  });
}

export function useConcluirLicao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ licaoId }: { trilhaId?: string; licaoId: string }) =>
      TrainingService.concluirLicao(licaoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.training.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.pets.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}

export function useDesmarcarLicao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ licaoId }: { trilhaId?: string; licaoId: string }) =>
      TrainingService.desmarcarLicao(licaoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.training.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.pets.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}
