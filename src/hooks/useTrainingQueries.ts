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
