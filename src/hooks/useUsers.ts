import { useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UserService } from '../services/users';
import { queryKeys } from '../lib/queryKeys';
import { UsuarioRequest } from '../types/user';
import { PetResponse } from '../types/pet';
import { useSession } from './useSession';
import { usePets, useMyPetsPontos } from './usePets';
import { useUserPoints } from './useTasks';
import { useRedeCuidado } from './useRedeCuidado';

export function useUserProfileData() {
  const { data: petsData, isLoading: isLoadingPets, isFetching: isFetchingPets, refetch: refetchPets } = usePets();
  const { data: pontosTarefas, refetch: refetchPoints } = useUserPoints();
  const { data: redeCuidado, isLoading: isLoadingRede, isFetching: isFetchingRede, refetch: refetchRede } = useRedeCuidado();
  const { data: myPetsPontos, refetch: refetchMyPetsPontos } = useMyPetsPontos();

  const pets: PetResponse[] = petsData?.content || [];

  const pontosTotais = useMemo(() => {
    if (redeCuidado?.pontosAcumulados !== undefined) return redeCuidado.pontosAcumulados;
    if (myPetsPontos?.pontosTotais !== undefined) return myPetsPontos.pontosTotais;
    return pontosTarefas ?? 0;
  }, [redeCuidado?.pontosAcumulados, myPetsPontos?.pontosTotais, pontosTarefas]);

  const refetchAll = async () => {
    await Promise.all([refetchPets(), refetchPoints(), refetchRede(), refetchMyPetsPontos()]);
  };

  return {
    pets,
    redeCuidado,
    pontosTotais,
    isLoading: isLoadingPets || isLoadingRede,
    isFetching: isFetchingPets || isFetchingRede,
    refetchAll,
  };
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { setUser } = useSession();

  return useMutation({
    mutationFn: async (data: UsuarioRequest) => {
      const updatedUser = await UserService.updateMe(data);
      setUser(updatedUser);
      return updatedUser;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['users', 'me', 'rede-cuidado'] });
    },
  });
}

export function useUpgradePremium() {
  const queryClient = useQueryClient();
  const { setUser } = useSession();

  return useMutation({
    mutationFn: async () => {
      const updatedUser = await UserService.upgradeMyPremium();
      setUser(updatedUser);
      return updatedUser;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({ queryKey: ['users', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['users', 'me', 'rede-cuidado'] });
    },
  });
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();
  const { logout } = useSession();

  return useMutation({
    mutationFn: async () => {
      await UserService.deleteMe();
      await logout();
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });
}


