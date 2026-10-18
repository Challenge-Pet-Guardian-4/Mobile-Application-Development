import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useUpdatePet, useDeletePet, useCaregiverActions } from './usePets';
import { useCreateHistorico, useUpdateHistorico, useDeleteHistorico } from './useHistoricos';
import { PetResponse, PetFormData } from '../types/pet';
import { UsuarioResponse } from '../types/user';
import { normalizarDataNascParaIso } from '../utils/petUtils';
import { PetSchema, formatZodError } from '../utils/schemas';
import { ActionCallbacks } from '../types/api';
import { createMutationCallbacks } from '../utils/apiError';
import { NotificationService } from '../services/notifications';

interface ConfirmarAcaoOptions {
  textoConfirmar?: string;
  textoCancelar?: string;
  destrutivo?: boolean;
}

function confirmarAcao(
  titulo: string,
  mensagem: string,
  onConfirmar: () => void,
  opcoes?: ConfirmarAcaoOptions
): void {
  const {
    textoConfirmar = 'Confirmar',
    textoCancelar = 'Cancelar',
    destrutivo = true,
  } = opcoes ?? {};

  Alert.alert(titulo, mensagem, [
    { text: textoCancelar, style: 'cancel' },
    {
      text: textoConfirmar,
      style: destrutivo ? 'destructive' : 'default',
      onPress: onConfirmar,
    },
  ]);
}

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
  const caregiverActions = useCaregiverActions();

  // Mutações de Histórico Clínico (/historicos)
  const createHistoricoMutation = useCreateHistorico();
  const updateHistoricoMutation = useUpdateHistorico();
  const deleteHistoricoMutation = useDeleteHistorico();

  const salvarEdicaoPet = useCallback(
    (formData: PetFormData, callbacks?: ActionCallbacks) => {
      if (!activePet) return;
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
    [activePet, isResponsavelPrincipal, updatePetMutation]
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
                  NotificationService.cancelarNotificacoesPorPet(activePet.id);
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
      if (!activePet) return;
      if (!isResponsavelPrincipal) {
        Alert.alert('Acesso Negado', 'Somente o tutor principal tem permissão para convidar novos cuidadores para este pet.');
        return;
      }

      caregiverActions.convidar(activePet.id, email, callbacks);
    },
    [activePet, isResponsavelPrincipal, caregiverActions]
  );

  const removerCuidador = useCallback(
    (cuidadorEmail: string, nomeCuidador: string, callbacks?: ActionCallbacks) => {
      if (!activePet) return;

      const isSelf = Boolean(user?.email && cuidadorEmail.toLowerCase() === user.email.toLowerCase());
      const title = isSelf ? 'Sair do Cuidado' : 'Remover Cuidador';
      const msg = isSelf
        ? `Deseja deixar de cuidar de ${activePet.nome}?`
        : `Deseja desvincular ${nomeCuidador} dos cuidados de ${activePet.nome}?`;

      confirmarAcao(
        title,
        msg,
        () =>
          caregiverActions.remover(activePet.id, cuidadorEmail, {
            ...callbacks,
            onSuccess: () => {
              if (isSelf) {
                NotificationService.cancelarNotificacoesPorPet(activePet.id);
              }
              callbacks?.onSuccess?.();
            },
          }),
        { textoConfirmar: isSelf ? 'Sair' : 'Remover', destrutivo: true }
      );
    },
    [activePet, user?.email, caregiverActions]
  );

  const transferirResponsabilidade = useCallback(
    (novoResponsavelEmail: string, nomeNovoResponsavel: string, callbacks?: ActionCallbacks) => {
      if (!activePet) return;

      confirmarAcao(
        'Transferir Titularidade',
        `Deseja transferir a responsabilidade principal de ${activePet.nome} para ${nomeNovoResponsavel}? Você passará a ser um co-cuidador.`,
        () => caregiverActions.transferir(activePet.id, novoResponsavelEmail, callbacks),
        { textoConfirmar: 'Transferir', destrutivo: false }
      );
    },
    [activePet, caregiverActions]
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
    isInvitingCaregiver: caregiverActions.isInviting,
    isRemovingCaregiver: caregiverActions.isRemoving,
    isTransferringResponsibility: caregiverActions.isTransferring,
    isSavingHistorico: createHistoricoMutation.isPending || updateHistoricoMutation.isPending,
  };
}
