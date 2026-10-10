import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UserService } from '../services/users';
import { queryKeys } from '../lib/queryKeys';
import { UsuarioRequest } from '../types/user';
import { useSession } from './useSession';
import { useRedeCuidado } from './useRedeCuidado';

export function useUserProfileData() {
  const { data: redeCuidado, isLoading, isFetching, refetch: refetchRede } = useRedeCuidado();

  const pontosTotais = redeCuidado?.pontosAcumulados ?? 0;

  return {
    redeCuidado,
    pontosTotais,
    isLoading,
    isFetching,
    refetchAll: refetchRede,
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
      queryClient.invalidateQueries({ queryKey: queryKeys.users.me });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.redeCuidado });
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
      queryClient.invalidateQueries({ queryKey: queryKeys.users.me });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.redeCuidado });
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


