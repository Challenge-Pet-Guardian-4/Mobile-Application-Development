import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient, QueryClient } from '@tanstack/react-query';
import { createMutationCallbacks } from '../utils/apiError';
import { TrainingLesson, TrainingTrack } from '../types/training';
import { usePets, usePetPontos } from './usePets';
import { useSession } from './useSession';
import { PetResponse } from '../types/pet';
import { TrainingService } from '../services/trainings';
import { queryKeys } from '../lib/queryKeys';

function useTrilhas(enabled = true) {
  return useQuery({
    queryKey: queryKeys.training.myTracks,
    queryFn: () => TrainingService.getTrilhas(),
    enabled,
  });
}

export function useConteudoAula(licaoId?: string, enabled = true) {
  const aulaId = Number(licaoId);
  const isValid = Number.isInteger(aulaId) && aulaId > 0;

  return useQuery({
    queryKey: queryKeys.lessons.content(isValid ? aulaId : undefined),
    queryFn: () => TrainingService.getConteudoAula(aulaId),
    enabled: enabled && isValid,
    staleTime: 1000 * 60 * 10,
  });
}

const invalidarQueriesTreinamento = (qc: QueryClient) => {
  [queryKeys.training.all, queryKeys.pets.all, queryKeys.tasks.all, queryKeys.users.all].forEach((queryKey) =>
    qc.invalidateQueries({ queryKey })
  );
};

export function useTrainings() {
  const { user } = useSession();
  const queryClient = useQueryClient();
  const { data: petsData } = usePets();
  const pets: PetResponse[] = petsData?.content || [];

  const [selectedPetIndex, setSelectedPetIndex] = useState(0);
  const petAtivo: PetResponse | undefined = pets[selectedPetIndex] ?? pets[0];
  const isUserComum = user?.role === 'COMUM';

  const {
    data: trilhasData,
    isLoading: isLoadingTrilhas,
    isFetching: isFetchingTrilhas,
    refetch: refetchTrilhas,
  } = useTrilhas(!isUserComum);

  const todasTrilhas: TrainingTrack[] = trilhasData || [];
  const trilhas = petAtivo ? todasTrilhas.filter((t) => t.petId === petAtivo.id) : todasTrilhas;

  const { data: pontosPetData, refetch: refetchPontos } = usePetPontos(petAtivo?.id);
  const totalXpGanho = pontosPetData?.pontosTotais ?? 0;

  const refetch = useCallback(() => Promise.all([refetchTrilhas(), refetchPontos()]), [refetchTrilhas, refetchPontos]);

  const [trilhaAtivaIndex, setTrilhaAtivaIndex] = useState(0);
  const [licaoSelecionada, setLicaoSelecionada] = useState<{ trilhaId: string; licao: TrainingLesson } | undefined>(undefined);

  const toggleLicaoMutation = useMutation({
    mutationFn: async ({ id, concluido }: { id: string; concluido: boolean }) => {
      if (concluido) {
        await TrainingService.desmarcarLicao(id);
      } else {
        await TrainingService.concluirLicao(id);
      }
    },
    onSuccess: () => invalidarQueriesTreinamento(queryClient),
  });

  const handleConcluirLicao = useCallback(() => {
    if (!licaoSelecionada || !petAtivo?.id) return;
    const { licao } = licaoSelecionada;

    toggleLicaoMutation.mutate(
      { id: licao.id, concluido: licao.concluido },
      createMutationCallbacks(
        'Erro',
        `Não foi possível ${licao.concluido ? 'desmarcar' : 'registrar'} a lição na API.`,
        { onSuccess: () => setLicaoSelecionada(undefined) }
      )
    );
  }, [licaoSelecionada, petAtivo?.id, toggleLicaoMutation]);

  const trilhaAtual = trilhas[trilhaAtivaIndex] || trilhas[0];
  const totalLicoes = trilhaAtual?.licoes?.length || 1;
  const licoesConcluidas = trilhaAtual?.licoes?.filter((l) => l.concluido).length || 0;
  const progressoPercent = Math.round((licoesConcluidas / totalLicoes) * 100);

  return {
    status: {
      isUserComum,
      isLoadingTrilhas,
      isFetchingTrilhas,
      isFetching: isFetchingTrilhas,
      isConcluindo: toggleLicaoMutation.isPending,
    },
    pet: {
      pets,
      selectedPetIndex,
      setSelectedPetIndex,
      petAtivo,
      totalXpGanho,
    },
    trail: {
      trilhas,
      trilhaAtivaIndex,
      setTrilhaAtivaIndex,
      trilhaAtual,
      totalLicoes,
      licoesConcluidas,
      progressoPercent,
      licaoSelecionada,
      setLicaoSelecionada,
    },
    actions: {
      refetch,
      concluirLicao: handleConcluirLicao,
    },
  };
}
