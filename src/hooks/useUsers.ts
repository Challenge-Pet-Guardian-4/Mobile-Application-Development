import { useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UserService } from '../services/users';
import { queryKeys } from '../lib/queryKeys';
import { UsuarioRequest } from '../types/user';
import { PetResponse } from '../types/pet';
import { useSession } from './useSession';
import { usePets, usePetsPontosTotais } from './usePets';
import { useUserPoints } from './useTasks';
import { useRedeCuidado } from './useRedeCuidado';

export function useUserProfileData() {
  const { data: petsData, isLoading: isLoadingPets, isFetching: isFetchingPets, refetch: refetchPets } = usePets();
  const { data: pontosTarefas, refetch: refetchPoints } = useUserPoints();
  const { data: redeCuidado, isLoading: isLoadingRede, isFetching: isFetchingRede, refetch: refetchRede } = useRedeCuidado();

  const pets: PetResponse[] = petsData?.content || [];

  const pontosTotaisPets = usePetsPontosTotais(pets);

  const pontosTotais = useMemo(() => {
    if (pontosTotaisPets !== undefined) return pontosTotaisPets;
    if (pontosTarefas !== undefined) return pontosTarefas;
    return redeCuidado?.pontosAcumulados ?? 0;
  }, [pontosTotaisPets, pontosTarefas, redeCuidado?.pontosAcumulados]);

  const refetchAll = async () => {
    await Promise.all([refetchPets(), refetchPoints(), refetchRede()]);
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

