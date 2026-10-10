import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useUpdatePet, useDeletePet, useInviteCaregiver, useRemoveCaregiver, useTransferResponsibility } from './usePets';
import { useCreateHistorico, useUpdateHistorico, useDeleteHistorico } from './useHistoricos';
import { PetResponse, PetFormData } from '../types/pet';
import { UsuarioResponse } from '../types/user';
import { normalizarDataNascParaIso } from '../utils/petUtils';
import { PetSchema, formatZodError } from '../utils/schemas';
import { createMutationCallbacks, ActionCallbacks } from '../utils/apiError';
import { confirmarAcao } from '../utils/dialogUtils';

interface UsePetDetailActionsProps {
  activePet?: PetResponse;
  user: UsuarioResponse | null;
  isResponsavelPrincipal: boolean;
  onPetDeleted?: () => void;
}

export function usePetDetailActions({
  activePet,
  user,
  isResponsavelPrincipal,
  onPetDeleted,
}: UsePetDetailActionsProps) {
  // Mutações de Pet e Co-cuidadores
  const updatePetMutation = useUpdatePet();
  const deletePetMutation = useDeletePet();
  const inviteCaregiverMutation = useInviteCaregiver();
  const removeCaregiverMutation = useRemoveCaregiver();
  const transferResponsibilityMutation = useTransferResponsibility();

  // Mutações de Histórico Clínico (/historicos)
  const createHistoricoMutation = useCreateHistorico();
  const updateHistoricoMutation = useUpdateHistorico();
  const deleteHistoricoMutation = useDeleteHistorico();

  const salvarEdicaoPet = useCallback(
    (formData: PetFormData, callbacks?: ActionCallbacks) => {
      if (!activePet || !user) {
        Alert.alert('Erro', 'Sessão inválida ou nenhum pet selecionado.');
        return;
      }
      if (!isResponsavelPrincipal) {
        Alert.alert('Acesso Negado', 'Somente o tutor principal pode editar as informações cadastrais deste pet.');
        return;
      }

      const validacao = PetSchema.safeParse(formData);
      if (!validacao.success) {
        Alert.alert('Dados do Pet', formatZodError(validacao.error));
        return;
      }

      updatePetMutation.mutate(
        {
          id: activePet.id,
          data: {
            nome: formData.nome.trim(),
            dataNasc: normalizarDataNascParaIso(formData.dataNasc),
            raca: formData.raca.trim(),
            porte: formData.porte,
            sexo: formData.sexo,
            castrado: formData.castrado,
          },
        },
        createMutationCallbacks('Erro ao Atualizar Pet', 'Não foi possível atualizar o pet na API.', callbacks)
      );
    },
    [activePet, user, isResponsavelPrincipal, updatePetMutation]
  );

  const excluirPet = useCallback(
    (callbacks?: ActionCallbacks) => {
      if (!activePet) return;
      if (!isResponsavelPrincipal) {
        Alert.alert('Acesso Negado', 'Somente o tutor principal tem permissão para excluir a ficha deste pet.');
        return;
      }

      confirmarAcao(
        'Remover Pet',
        `Deseja realmente excluir a ficha de ${activePet.nome}?`,
        () => {
          deletePetMutation.mutate(
            activePet.id,
            createMutationCallbacks('Erro ao Excluir Pet', 'Não foi possível excluir o pet.', {
              onSuccess: () => {
                onPetDeleted?.();
                callbacks?.onSuccess?.();
              },
              onError: callbacks?.onError,
            })
          );
        },
        { textoConfirmar: 'Excluir', destrutivo: true }
      );
    },
    [activePet, isResponsavelPrincipal, deletePetMutation, onPetDeleted]
  );

  const convidarCuidador = useCallback(
    (email: string, callbacks?: ActionCallbacks) => {
      if (!activePet || !user) return;
      if (!isResponsavelPrincipal) {
        Alert.alert('Acesso Negado', 'Somente o tutor principal tem permissão para convidar novos cuidadores para este pet.');
        return;
      }

      inviteCaregiverMutation.mutate(
        {
          petId: activePet.id,
          email: email.trim().toLowerCase(),
        },
        createMutationCallbacks('Erro ao Convidar Cuidador', 'Não foi possível enviar o convite. Verifique se o e-mail está cadastrado.', callbacks)
      );
    },
    [activePet, user, isResponsavelPrincipal, inviteCaregiverMutation]
  );

  const removerCuidador = useCallback(
    (cuidadorEmail: string, nomeCuidador: string, callbacks?: ActionCallbacks) => {
      if (!activePet || !user) return;

      const isSelf = cuidadorEmail.toLowerCase() === user.email.toLowerCase();
      const title = isSelf ? 'Sair do Cuidado' : 'Remover Cuidador';
      const msg = isSelf
        ? `Deseja deixar de cuidar de ${activePet.nome}?`
        : `Deseja desvincular ${nomeCuidador} dos cuidados de ${activePet.nome}?`;

      confirmarAcao(
        title,
        msg,
        () => {
          removeCaregiverMutation.mutate(
            { petId: activePet.id, email: cuidadorEmail },
            createMutationCallbacks('Erro ao Desvincular Cuidador', 'Não foi possível desvincular o cuidador.', callbacks)
          );
        },
        { textoConfirmar: isSelf ? 'Sair' : 'Remover', destrutivo: true }
      );
    },
    [activePet, user, removeCaregiverMutation]
  );

  const transferirResponsabilidade = useCallback(
    (novoResponsavelEmail: string, nomeNovoResponsavel: string, callbacks?: ActionCallbacks) => {
      if (!activePet || !user) return;

      confirmarAcao(
        'Transferir Titularidade',
        `Deseja transferir a responsabilidade principal de ${activePet.nome} para ${nomeNovoResponsavel}? Você passará a ser um co-cuidador.`,
        () => {
          transferResponsibilityMutation.mutate(
            { petId: activePet.id, novoResponsavelEmail },
            createMutationCallbacks('Erro na Transferência', 'Não foi possível transferir a responsabilidade principal.', callbacks)
          );
        },
        { textoConfirmar: 'Transferir', destrutivo: false }
      );
    },
    [activePet, user, transferResponsibilityMutation]
  );

  const criarHistorico = useCallback(
    (data: { tipoHist: string; dataHist: string }, callbacks?: ActionCallbacks) => {
      if (!activePet) return;

      createHistoricoMutation.mutate(
        {
          tipoHist: data.tipoHist,
          dataHist: data.dataHist,
          petId: activePet.id,
        },
        createMutationCallbacks('Erro no Prontuário', 'Não foi possível registrar o histórico de saúde.', callbacks)
      );
    },
    [activePet, createHistoricoMutation]
  );

  const atualizarHistorico = useCallback(
    (id: number, data: { tipoHist: string; dataHist: string }, callbacks?: ActionCallbacks) => {
      if (!activePet) return;

      updateHistoricoMutation.mutate(
        {
          id,
          data: {
            tipoHist: data.tipoHist,
            dataHist: data.dataHist,
            petId: activePet.id,
          },
        },
        createMutationCallbacks('Erro no Prontuário', 'Não foi possível atualizar o registro.', callbacks)
      );
    },
    [activePet, updateHistoricoMutation]
  );

  const excluirHistorico = useCallback(
    (id: number, tipoHist: string, callbacks?: ActionCallbacks) => {
      if (!activePet) return;

      confirmarAcao(
        'Excluir Registro',
        `Deseja realmente remover o registro "${tipoHist}" do prontuário?`,
        () => {
          deleteHistoricoMutation.mutate(
            { id, petId: activePet.id },
            createMutationCallbacks('Erro ao Excluir Registro', 'Não foi possível excluir o registro.', callbacks)
          );
        },
        { textoConfirmar: 'Excluir', destrutivo: true }
      );
    },
    [activePet, deleteHistoricoMutation]
  );

  return {
    salvarEdicaoPet,
    excluirPet,
    convidarCuidador,
    removerCuidador,
    transferirResponsabilidade,
    criarHistorico,
    atualizarHistorico,
    excluirHistorico,
    isUpdatingPet: updatePetMutation.isPending,
    isDeletingPet: deletePetMutation.isPending,
    isInvitingCaregiver: inviteCaregiverMutation.isPending,
    isRemovingCaregiver: removeCaregiverMutation.isPending,
    isTransferringResponsibility: transferResponsibilityMutation.isPending,
    isSavingHistorico: createHistoricoMutation.isPending || updateHistoricoMutation.isPending,
  };
}
