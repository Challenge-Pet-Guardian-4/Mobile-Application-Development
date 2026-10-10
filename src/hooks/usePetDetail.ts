import { useMemo } from 'react';
import { useSession } from './useSession';
import { useActivePet } from './useActivePet';
import { usePets, usePetDetailData } from './usePets';
import { usePetDetailModals } from './usePetDetailModals';
import { usePetDetailActions } from './usePetDetailActions';
import { CoCuidadorResponse, PetResponse } from '../types/pet';
import { formatarIsoParaBr } from '../utils/petUtils';
import { ActionCallbacks } from '../utils/apiError';

export type { ActionCallbacks };

export function usePetDetail(routePetId?: number, onGoBack?: () => void) {
  const { user } = useSession();

  // Lista de animais para o seletor da tela
  const { data: petsData, isLoading: isLoadingPets, refetch: refetchPets } = usePets();
  const pets: PetResponse[] = petsData?.content || [];
  const { activePet, selectedPetId, selectPet, setSelectedPetId } = useActivePet(pets, routePetId);

  // Consulta atômica única consolidada pelo Java (GET /pets/{id}/detalhe)
  const { data: detailData, isLoading: isLoadingDetail, refetch: refetchDetail } = usePetDetailData(activePet?.id);

  const caregivers = detailData?.cuidadores || [];
  const historicos = detailData?.historicos || [];

  // Verificação de titularidade do usuário no pet ativo
  const isResponsavelPrincipal = useMemo(() => {
    if (!user) return false;
    if (caregivers.length > 0) {
      const meuVinculo = caregivers.find((c: CoCuidadorResponse) => c.email.toLowerCase() === user.email.toLowerCase());
      return meuVinculo ? Boolean(meuVinculo.responsavelPrincipal) : false;
    }
    return true;
  }, [user, caregivers]);

  // Hook isolado para todas as mutações e confirmações
  const actions = usePetDetailActions({
    activePet,
    user,
    isResponsavelPrincipal,
    onPetDeleted: () => setSelectedPetId(undefined),
  });

  const initialPetData = useMemo(() => {
    if (!activePet) return undefined;
    return {
      nome: activePet.nome,
      raca: activePet.raca,
      dataNasc: formatarIsoParaBr(activePet.dataNasc),
      porte: activePet.porte,
      sexo: activePet.sexo,
      castrado: activePet.castrado,
    };
  }, [activePet]);

  const editTitle = activePet ? `Editar Ficha de ${activePet.nome}` : 'Editar Ficha do Pet';

  const caregiversWithActions = useMemo(
    () =>
      caregivers.map((c: CoCuidadorResponse) => {
        const isMe = c.email.toLowerCase() === user?.email?.toLowerCase();
        return {
          ...c,
          isCurrentUser: isMe,
          onTransfer: isResponsavelPrincipal && !isMe ? () => actions.transferirResponsabilidade(c.email, c.nome) : undefined,
          onRemove: isResponsavelPrincipal || isMe ? () => actions.removerCuidador(c.email, c.nome) : undefined,
        };
      }),
    [caregivers, user?.email, isResponsavelPrincipal, actions]
  );

  const modals = usePetDetailModals({
    activePet,
    isResponsavelPrincipal,
    salvarEdicaoPet: actions.salvarEdicaoPet,
    excluirPet: actions.excluirPet,
    convidarCuidador: actions.convidarCuidador,
    criarHistorico: actions.criarHistorico,
    atualizarHistorico: actions.atualizarHistorico,
    excluirHistorico: actions.excluirHistorico,
    onGoBack,
  });

  return {
    status: {
      isLoading: (isLoadingPets && pets.length === 0) || (isLoadingDetail && !detailData),
      isLoadingHistory: isLoadingDetail,
      isLoadingHistoricos: isLoadingDetail,
      isLoadingCaregivers: isLoadingDetail,
      isLoadingPontos: isLoadingDetail,
      refetchAll: () => {
        refetchPets();
        refetchDetail();
      },
    },
    pet: {
      list: pets,
      active: activePet,
      selectedId: selectedPetId,
      select: selectPet,
      isPrincipal: isResponsavelPrincipal,
      initialData: initialPetData,
      editTitle,
      caregivers: caregiversWithActions,
      caregiversCount: caregivers.length,
      historicos,
      tarefasConcluidas: detailData?.tarefasConcluidas ?? [],
      pontos: detailData?.pontos,
    },
    modals,
    actions: {
      excluirPet: modals.excluirPet,
      removerCuidador: actions.removerCuidador,
      transferirResponsabilidade: actions.transferirResponsabilidade,
      isUpdatingPet: actions.isUpdatingPet,
      isDeletingPet: actions.isDeletingPet,
      isInvitingCaregiver: actions.isInvitingCaregiver,
      isRemovingCaregiver: actions.isRemovingCaregiver,
      isTransferringResponsibility: actions.isTransferringResponsibility,
      isSavingHistorico: actions.isSavingHistorico,
    },
  };
}
