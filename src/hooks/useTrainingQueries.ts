import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TrainingService } from '../services/trainings';
import { queryKeys } from '../lib/queryKeys';

export function useTrilhas(petId?: number, enabled = true) {
  return useQuery({
    queryKey: petId ? queryKeys.training.byPet(petId) : queryKeys.training.myTracks,
    queryFn: () => TrainingService.getTrilhas(petId),
    enabled,
  });
}

export function useMyTrilhas(enabled = true) {
  return useQuery({
    queryKey: queryKeys.training.myTracks,
    queryFn: () => TrainingService.getTrilhasMe(),
    enabled,
  });
}

export function useConcluirLicao() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ trilhaId, licaoId }: { trilhaId: string; licaoId: string }) =>
      TrainingService.concluirLicao(trilhaId, licaoId),
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
    mutationFn: ({ trilhaId, licaoId }: { trilhaId: string; licaoId: string }) =>
      TrainingService.desmarcarLicao(trilhaId, licaoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.training.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.pets.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}
