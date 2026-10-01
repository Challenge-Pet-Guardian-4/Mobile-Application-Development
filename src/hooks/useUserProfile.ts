import { useState, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { useSession } from './useSession';
import { useUpdateUser, useUserProfileData, useUpgradePremium } from './useUsers';
import { EditProfileFormData } from '../types/user';
import { ProfileEditSchema, formatZodError } from '../utils/schemas';
import { ActionCallbacks, createMutationCallbacks } from '../utils/apiError';

export type UserProfileModal = 'editar' | 'faq' | 'termos' | null;

export function useUserProfile() {
  const { user, logout } = useSession();

  const { redeCuidado, pontosTotais, isLoading, isFetching, refetchAll } = useUserProfileData();

  const updateUserMutation = useUpdateUser();
  const upgradePremiumMutation = useUpgradePremium();

  const [modalAtivo, setModalAtivo] = useState<UserProfileModal>(null);

  const abrirModal = useCallback((tipo: 'editar' | 'faq' | 'termos') => {
    setModalAtivo(tipo);
  }, []);

  const fecharModal = useCallback(() => {
    setModalAtivo(null);
  }, []);

  const initials = useMemo(() => user?.nome.substring(0, 2).toUpperCase() ?? '', [user?.nome]);

  const enderecoPrincipal = user?.endereco ?? null;

  const initialFormData: EditProfileFormData = useMemo(
    () => ({
      nome: user?.nome ?? '',
      email: user?.email ?? '',
      senha: '',
      ddd: user?.ddd ?? '',
      numeroTelefone: user?.numeroTelefone ?? '',
      cep: user?.endereco?.cep ?? '',
      numero: user?.endereco?.numero ?? '',
    }),
    [user]
  );

  const salvarPerfil = useCallback(
    (formEdit: EditProfileFormData, callbacks?: ActionCallbacks) => {
      if (!user) return;

      const validacao = ProfileEditSchema.safeParse({
        ...formEdit,
        ddd: formEdit.ddd.replace(/\D/g, ''),
        numeroTelefone: formEdit.numeroTelefone.replace(/\D/g, ''),
        cep: formEdit.cep.replace(/\D/g, ''),
      });

      if (!validacao.success) {
        Alert.alert('Dados do Perfil', formatZodError(validacao.error));
        return;
      }

      updateUserMutation.mutate(
        {
          nome: formEdit.nome.trim(),
          email: formEdit.email.trim().toLowerCase(),
          senha: formEdit.senha.trim(),
          ddd: formEdit.ddd.replace(/\D/g, ''),
          numeroTelefone: formEdit.numeroTelefone.replace(/\D/g, ''),
          endereco: {
            cep: formEdit.cep.replace(/\D/g, ''),
            numero: formEdit.numero.trim(),
          },
        },
        createMutationCallbacks('Erro ao Atualizar Perfil', 'Não foi possível atualizar seus dados na API.', {
          onSuccess: () => {
            callbacks?.onSuccess?.();
            fecharModal();
          },
          onError: callbacks?.onError,
        })
      );
    },
    [user, updateUserMutation, fecharModal]
  );

  const realizarUpgradePremium = useCallback(() => {
    if (!user) return;
    Alert.alert(
      'Tornar-se Premium ⭐',
      'Deseja ativar o plano PetGuardian Premium para ter acesso ilimitado a trilhas, aulas de adestramento e assistente IA?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Ativar Premium',
          onPress: () => {
            upgradePremiumMutation.mutate(
              undefined,
              createMutationCallbacks('Sucesso!', 'Seu perfil foi atualizado para Premium com sucesso!')
            );
          },
        },
      ]
    );
  }, [user, upgradePremiumMutation]);

  const logoutComConfirmacao = useCallback(() => {
    Alert.alert('Sair da Conta', 'Deseja realmente encerrar sua sessão no PetGuardian?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          await logout();
        },
      },
    ]);
  }, [logout]);

  const familySummary = useMemo(() => {
    const petsCount = redeCuidado?.pets?.length ?? 0;
    const cuidadoresCount = (redeCuidado?.coCuidadores?.length ?? 0) + 1;
    return {
      petsTexto: `${petsCount} ${petsCount === 1 ? 'animal cadastrado' : 'animais cadastrados'}`,
      cuidadoresTexto: `${cuidadoresCount} ${cuidadoresCount === 1 ? 'cuidador ativo' : 'cuidadores ativos'}`,
    };
  }, [redeCuidado]);

  return {
    status: {
      isLoading,
      isFetching,
    },
    profile: {
      user,
      initials,
      enderecoPrincipal,
      pontosTotais,
      redeCuidado,
      familySummary,
    },
    modals: {
      ativo: modalAtivo,
      abrir: abrirModal,
      fechar: fecharModal,
      initialFormData,
    },
    actions: {
      salvarPerfil,
      realizarUpgradePremium,
      logout: logoutComConfirmacao,
      isUpdating: updateUserMutation.isPending,
      isUpgradingPremium: upgradePremiumMutation.isPending,
      refetch: refetchAll,
    },
  };
}

