import { useQuery, useQueries, useMutation, useQueryClient, skipToken } from '@tanstack/react-query';
import { PetService } from '../services/pets';
import { queryKeys } from '../lib/queryKeys';
import { PetRequest, PetResponse } from '../types/pet';
import { useSession } from './useSession';

export function usePets(page = 0, size = 20) {
  const { token } = useSession();

  return useQuery({
    queryKey: ['pets', 'me', page, size],
    queryFn: () => PetService.getMyPets(page, size),
    enabled: !!token,
  });
}

export function usePet(id?: number) {
  return useQuery({
    queryKey: queryKeys.pets.detail(id),
    queryFn: id ? () => PetService.getPetById(id) : skipToken,
  });
}

export function usePetHistory(id?: number) {
  return useQuery({
    queryKey: queryKeys.pets.history(id),
    queryFn: id ? () => PetService.getPetHistory(id) : skipToken,
  });
}

export function usePetPontos(id?: number) {
  return useQuery({
    queryKey: queryKeys.pets.pontos(id),
    queryFn: id ? () => PetService.getPetPontos(id) : skipToken,
  });
}

export function usePetsPontosMap(pets: PetResponse[]) {
  return useQueries({
    queries: pets.map((p) => ({
      queryKey: queryKeys.pets.pontos(p.id),
      queryFn: () => PetService.getPetPontos(p.id),
      enabled: !!p.id,
      staleTime: 1000 * 60 * 2,
    })),
    combine: (results) => {
      const map = new Map<number, number>();
      results.forEach((q) => {
        if (q.data) {
          map.set(q.data.petId, q.data.pontosTotais);
        }
      });
      return map;
    },
  });
}

export function usePetsPontosTotais(pets: PetResponse[]) {
  return useQueries({
    queries: pets.map((p) => ({
      queryKey: queryKeys.pets.pontos(p.id),
      queryFn: () => PetService.getPetPontos(p.id),
      enabled: !!p.id,
      staleTime: 1000 * 60 * 2,
    })),
    combine: (results) => {
      let total = 0;
      let hasData = false;
      results.forEach((q) => {
        if (q.data?.pontosTotais !== undefined) {
          total += q.data.pontosTotais;
          hasData = true;
        }
      });
      return hasData ? total : undefined;
    },
  });
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
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pets.detail(id) });
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
      queryClient.invalidateQueries({ queryKey: queryKeys.pets.caregivers(petId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.pets.all });
    },
  });
}

export function usePetCaregivers(petId?: number) {
  return useQuery({
    queryKey: queryKeys.pets.caregivers(petId),
    queryFn: () => (petId ? PetService.getCuidadores(petId) : Promise.resolve([])),
    enabled: !!petId,
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
      queryClient.invalidateQueries({ queryKey: queryKeys.pets.caregivers(petId) });
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
      queryClient.invalidateQueries({ queryKey: queryKeys.pets.caregivers(petId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.pets.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });
}

