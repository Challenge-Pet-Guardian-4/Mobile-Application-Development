import { useMutation, useQueryClient } from '@tanstack/react-query';
import { HistoricoService } from '../services/historico';
import { queryKeys } from '../lib/queryKeys';
import { HistoricoRequest } from '../types/historico';

export function useCreateHistorico() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: HistoricoRequest) => HistoricoService.createHistorico(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pets.detail(variables.petId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.historicos.all });
    },
  });
}

export function useUpdateHistorico() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: HistoricoRequest }) =>
      HistoricoService.updateHistorico(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pets.detail(variables.data.petId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.historicos.all });
    },
  });
}

export function useDeleteHistorico() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: number; petId: number }) => HistoricoService.deleteHistorico(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pets.detail(variables.petId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.historicos.all });
    },
  });
}
