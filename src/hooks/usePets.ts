import { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient, skipToken } from '@tanstack/react-query';
import { PetService } from '../services/pets';
import { queryKeys } from '../lib/queryKeys';
import { PetPontuacaoResponse, PetRequest } from '../types/pet';
import { useSession } from './useSession';

export const PETS_PAGE_SIZE = 4;
export const DEFAULT_PETS_LIST_SIZE = 20;

export function usePets(page = 0, size = DEFAULT_PETS_LIST_SIZE) {
  const { token } = useSession();

  return useQuery({
    queryKey: queryKeys.pets.myPets(page, size),
    queryFn: () => PetService.getMyPets(page, size),
    enabled: !!token,
  });
}

export function usePetDetailData(id?: number) {
  return useQuery({
    queryKey: queryKeys.pets.detail(id),
    queryFn: id ? () => PetService.getPetDetail(id) : skipToken,
  });
}

export function usePetPontos(id?: number) {
  const { data: myPetsPontos, isLoading, isError, refetch } = useMyPetsPontos();

  const data = useMemo<PetPontuacaoResponse | undefined>(() => {
    if (!id || !myPetsPontos?.detalhePets) return undefined;
    return myPetsPontos.detalhePets.find((p) => p.petId === id);
  }, [id, myPetsPontos]);

  return {
    data,
    isLoading,
    isError,
    refetch,
  };
}

export function useMyPetsPontos() {
  const { token } = useSession();

  return useQuery({
    queryKey: queryKeys.pets.myPontos,
    queryFn: () => PetService.getMyPetsPontos(),
    enabled: !!token,
  });
}

export function usePetsPontosMap() {
  const { data } = useMyPetsPontos();

  return useMemo(() => {
    const map = new Map<number, number>();
    data?.detalhePets.forEach((p) => {
      map.set(p.petId, p.pontosTotais);
    });
    return map;
  }, [data]);
}

export function useCreatePet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (petRequest: PetRequest) => PetService.createPet(petRequest),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pets.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}

export function useUpdatePet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: PetRequest }) => PetService.updatePet(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pets.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}

export function useDeletePet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => PetService.deletePet(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pets.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all });
    },
  });
}

export function useInviteCaregiver() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      petId,
      email,
    }: {
      petId: number;
      email: string;
    }) => PetService.convidarPorEmail(petId, email),
    onSuccess: (_, { petId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pets.detail(petId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.pets.all });
    },
  });
}

export function useRemoveCaregiver() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      petId,
      email,
    }: {
      petId: number;
      email: string;
    }) => PetService.desvincularCuidador(petId, email),
    onSuccess: (_, { petId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pets.detail(petId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.pets.all });
    },
  });
}

export function useTransferResponsibility() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      petId,
      novoResponsavelEmail,
    }: {
      petId: number;
      novoResponsavelEmail: string;
    }) => PetService.transferirResponsabilidade(petId, novoResponsavelEmail),
    onSuccess: (_, { petId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pets.detail(petId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.pets.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}

