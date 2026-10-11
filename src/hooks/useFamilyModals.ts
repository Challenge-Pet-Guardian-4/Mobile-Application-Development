import { useState, useCallback, useMemo } from 'react';
import { PetResponse } from '../types/pet';
import { TarefaResponse, TaskFormData } from '../types/task';
import { CuidadorResumo, UsuarioResponse } from '../types/user';
import { ActionCallbacks, createMutationCallbacks } from '../utils/apiError';
import { useInviteCaregiver, useRemoveCaregiver, useTransferResponsibility } from './usePets';

export type FamilyModalType =
  | 'novoPet'
  | 'novaTarefa'
  | 'editarTarefa'
  | 'convite'
  | 'gerenciarCuidador'
  | null;

interface UseFamilyModalsProps {
  user?: UsuarioResponse | null;
  petsOndeSouPrincipal: PetResponse[];
  cadastrarTarefa: (data: TaskFormData, callbacks?: ActionCallbacks) => void;
  atualizarTarefa: (taskId: number, data: TaskFormData, callbacks?: ActionCallbacks) => void;
}

export function useFamilyModals({
  user,
  petsOndeSouPrincipal,
  cadastrarTarefa,
  atualizarTarefa,
}: UseFamilyModalsProps) {
  const inviteMutation = useInviteCaregiver();
  const removeCaregiverMutation = useRemoveCaregiver();
  const transferResponsibilityMutation = useTransferResponsibility();

  const [modalAtivo, setModalAtivo] = useState<FamilyModalType>(null);
  const [tarefaEmEdicao, setTarefaEmEdicao] = useState<TarefaResponse | undefined>(undefined);
  const [cuidadorEmGestao, setCuidadorEmGestao] = useState<CuidadorResumo | undefined>(undefined);

  const handleAbrirConvite = useCallback(() => {
    if (petsOndeSouPrincipal.length === 0) return;
    setModalAtivo('convite');
  }, [petsOndeSouPrincipal.length]);

  const handleAbrirGerenciamento = useCallback(
    (cuidador: CuidadorResumo) => {
      if (petsOndeSouPrincipal.length === 0) return;
      setCuidadorEmGestao(cuidador);
      setModalAtivo('gerenciarCuidador');
    },
    [petsOndeSouPrincipal.length]
  );

  const handleFecharGerenciamento = useCallback(() => {
    setModalAtivo(null);
    setCuidadorEmGestao(undefined);
  }, []);

  const handleTogglePetVinculo = useCallback(
    (petId: number, isCurrentlyLinked: boolean) => {
      if (!cuidadorEmGestao || !user) return;

      if (isCurrentlyLinked) {
        removeCaregiverMutation.mutate(
          { petId, email: cuidadorEmGestao.email },
          createMutationCallbacks('Erro ao Desvincular', 'Não foi possível desvincular o cuidador deste pet.', {
            onSuccess: () => {
              setCuidadorEmGestao((prev) =>
                prev ? { ...prev, petIds: prev.petIds.filter((id) => id !== petId) } : undefined
              );
            },
          })
        );
      } else {
        inviteMutation.mutate(
          { petId, email: cuidadorEmGestao.email },
          createMutationCallbacks('Erro ao Vincular', 'Não foi possível vincular o cuidador a este pet.', {
            onSuccess: () => {
              setCuidadorEmGestao((prev) =>
                prev ? { ...prev, petIds: [...prev.petIds, petId] } : undefined
              );
            },
          })
        );
      }

    },
    [cuidadorEmGestao, user, removeCaregiverMutation, inviteMutation]
  );

  const handleTransferirTitularidade = useCallback(
    (petId: number, _petNome: string) => {
      if (!cuidadorEmGestao || !user) return;

      transferResponsibilityMutation.mutate(
        { petId, novoResponsavelEmail: cuidadorEmGestao.email },
        createMutationCallbacks('Erro ao Transferir Titularidade', 'Não foi possível transferir a titularidade do pet.', {
          onSuccess: handleFecharGerenciamento,
        })
      );
    },
    [cuidadorEmGestao, user, transferResponsibilityMutation, handleFecharGerenciamento]
  );

  const handleRemoverDeTodosPets = useCallback(() => {
    if (!cuidadorEmGestao || !user) return;

    const petsParaRemover = petsOndeSouPrincipal.filter((p) =>
      cuidadorEmGestao.petIds.includes(p.id)
    );

    if (petsParaRemover.length === 0) {
      handleFecharGerenciamento();
      return;
    }

    const removerSequencial = (index: number) => {
      if (index >= petsParaRemover.length) {
        handleFecharGerenciamento();
        return;
      }

      removeCaregiverMutation.mutate(
        {
          petId: petsParaRemover[index].id,
          email: cuidadorEmGestao.email,
        },
        createMutationCallbacks(
          'Erro ao Remover',
          'Ocorreu um erro ao desvincular o cuidador de alguns pets.',
          {
            onSuccess: () => removerSequencial(index + 1),
          }
        )
      );
    };

    removerSequencial(0);
  }, [cuidadorEmGestao, user, petsOndeSouPrincipal, removeCaregiverMutation, handleFecharGerenciamento]);

  const handleEditTask = useCallback((tarefa: TarefaResponse) => {
    setTarefaEmEdicao(tarefa);
    setModalAtivo('editarTarefa');
  }, []);

  const initialTaskData = useMemo(() => {
    if (!tarefaEmEdicao) return undefined;
    return {
      petId: tarefaEmEdicao.petId,
      titulo: tarefaEmEdicao.titulo,
      descricao: tarefaEmEdicao.descricao,
      pontos: String(tarefaEmEdicao.pontosTarefa),
      prazo: tarefaEmEdicao.prazo,
      status: tarefaEmEdicao.status,
      conclusao: tarefaEmEdicao.conclusao,
    };
  }, [tarefaEmEdicao]);

  const handleCloseTaskModal = useCallback(() => {
    setModalAtivo(null);
    setTarefaEmEdicao(undefined);
  }, []);

  const handleSubmitTaskModal = useCallback(
    (data: TaskFormData) => {
      if (modalAtivo === 'editarTarefa' && tarefaEmEdicao) {
        atualizarTarefa(tarefaEmEdicao.id, data, {
          onSuccess: handleCloseTaskModal,
        });
      } else {
        cadastrarTarefa(data, {
          onSuccess: handleCloseTaskModal,
        });
      }
    },
    [modalAtivo, tarefaEmEdicao, atualizarTarefa, cadastrarTarefa, handleCloseTaskModal]
  );

  return {
    ativo: modalAtivo,
    abrir: setModalAtivo,
    fechar: () => setModalAtivo(null),
    abrirNovoPet: () => setModalAtivo('novoPet'),
    abrirNovaTarefa: () => {
      setTarefaEmEdicao(undefined);
      setModalAtivo('novaTarefa');
    },
    abrirEdicaoTarefa: handleEditTask,
    abrirConvite: handleAbrirConvite,
    tarefaEmEdicao,
    abrirGerenciamento: handleAbrirGerenciamento,
    fecharGerenciamento: handleFecharGerenciamento,
    cuidadorEmGestao,
    togglePetVinculo: handleTogglePetVinculo,
    transferirTitularidade: handleTransferirTitularidade,
    removerDeTodosPets: handleRemoverDeTodosPets,
    initialTaskData,
    fecharModalTarefa: handleCloseTaskModal,
    submeterTarefa: handleSubmitTaskModal,
    isLoadingGerenciamento:
      removeCaregiverMutation.isPending ||
      inviteMutation.isPending ||
      transferResponsibilityMutation.isPending,
  };
}
