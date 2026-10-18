import { useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient, skipToken, QueryClient } from '@tanstack/react-query';
import { PetService } from '../services/pets';
import { queryKeys } from '../lib/queryKeys';
import { PetRequest } from '../types/pet';
import { ActionCallbacks } from '../types/api';
import { createMutationCallbacks } from '../utils/apiError';

export const PETS_PAGE_SIZE = 4;
const DEFAULT_PETS_LIST_SIZE = 20;

export function usePets(page = 0, size = DEFAULT_PETS_LIST_SIZE) {
  return useQuery({
    queryKey: queryKeys.pets.myPets(page, size),
    queryFn: () => PetService.getMyPets(page, size),
  });
}

export function usePetDetailData(id?: number) {
  return useQuery({
    queryKey: queryKeys.pets.detail(id),
    queryFn: id ? () => PetService.getPetDetail(id) : skipToken,
  });
}

function useMyPetsPontos() {
  return useQuery({
    queryKey: queryKeys.pets.myPontos,
    queryFn: () => PetService.getMyPetsPontos(),
  });
}

export function usePetPontos(id?: number) {
  const query = useMyPetsPontos();
  const data = useMemo(() => query.data?.detalhePets.find((p) => p.petId === id), [id, query.data]);
  return { ...query, data };
}

export function usePetsPontosMap() {
  const { data } = useMyPetsPontos();
  return useMemo(() => new Map(data?.detalhePets.map((p) => [p.petId, p.pontosTotais])), [data]);
}

const invalidarPets = (qc: QueryClient, petId?: number) => {
  if (petId) qc.invalidateQueries({ queryKey: queryKeys.pets.detail(petId) });
  qc.invalidateQueries({ queryKey: queryKeys.pets.all });
  qc.invalidateQueries({ queryKey: queryKeys.users.all });
};

export function useCreatePet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (petRequest: PetRequest) => PetService.createPet(petRequest),
    onSuccess: () => invalidarPets(qc),
  });
}

export function useUpdatePet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: PetRequest }) => PetService.updatePet(id, data),
    onSuccess: () => invalidarPets(qc),
  });
}

export function useDeletePet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => PetService.deletePet(id),
    onSuccess: () => {
      invalidarPets(qc);
      qc.invalidateQueries({ queryKey: queryKeys.tasks.all });
    },
  });
}

export function useCaregiverActions() {
  const qc = useQueryClient();
  const invalidar = useCallback((petId: number) => invalidarPets(qc, petId), [qc]);

  const inviteMutation = useMutation({
    mutationFn: ({ petId, email }: { petId: number; email: string }) => PetService.convidarPorEmail(petId, email),
    onSuccess: (_, { petId }) => invalidar(petId),
  });

  const removeMutation = useMutation({
    mutationFn: ({ petId, email }: { petId: number; email: string }) => PetService.desvincularCuidador(petId, email),
    onSuccess: (_, { petId }) => invalidar(petId),
  });

  const transferMutation = useMutation({
    mutationFn: ({ petId, email }: { petId: number; email: string }) => PetService.transferirResponsabilidade(petId, email),
    onSuccess: (_, { petId }) => invalidar(petId),
  });

  const convidar = useCallback(
    (petId: number, email: string, cb?: ActionCallbacks) => {
      inviteMutation.mutate(
        { petId, email: email.trim().toLowerCase() },
        createMutationCallbacks('Erro ao Convidar Cuidador', 'Não foi possível enviar o convite. Verifique se o e-mail está cadastrado.', cb)
      );
    },
    [inviteMutation]
  );

  const remover = useCallback(
    (petId: number, email: string, cb?: ActionCallbacks) => {
      removeMutation.mutate(
        { petId, email: email.trim().toLowerCase() },
        createMutationCallbacks('Erro ao Desvincular Cuidador', 'Não foi possível desvincular o cuidador.', cb)
      );
    },
    [removeMutation]
  );

  const transferir = useCallback(
    (petId: number, email: string, cb?: ActionCallbacks) => {
      transferMutation.mutate(
        { petId, email: email.trim().toLowerCase() },
        createMutationCallbacks('Erro na Transferência', 'Não foi possível transferir a responsabilidade principal.', cb)
      );
    },
    [transferMutation]
  );

  return {
    convidar,
    remover,
    transferir,
    isInviting: inviteMutation.isPending,
    isRemoving: removeMutation.isPending,
    isTransferring: transferMutation.isPending,
    isPending: inviteMutation.isPending || removeMutation.isPending || transferMutation.isPending,
  };
}
