import { useState, useCallback, useMemo } from 'react';
import { FamilyModalType } from '../types/pet';
import { TarefaResponse, TaskFormData } from '../types/task';
import { CuidadorResumo, PetResumo } from '../types/user';
import { ActionCallbacks } from '../types/api';
import { useCaregiverActions } from './usePets';

interface UseFamilyModalsProps {
  petsOndeSouPrincipal: PetResumo[];
  cadastrarTarefa: (data: TaskFormData, callbacks?: ActionCallbacks<TarefaResponse>) => void;
  atualizarTarefa: (taskId: number, data: TaskFormData, callbacks?: ActionCallbacks) => void;
}

export function useFamilyModals({
  petsOndeSouPrincipal,
  cadastrarTarefa,
  atualizarTarefa,
}: UseFamilyModalsProps) {
  const caregiverActions = useCaregiverActions();

  const [modalAtivo, setModalAtivo] = useState<FamilyModalType>(null);
  const [tarefaEmEdicao, setTarefaEmEdicao] = useState<TarefaResponse | undefined>(undefined);
  const [cuidadorEmGestao, setCuidadorEmGestao] = useState<CuidadorResumo | undefined>(undefined);

  const handleAbrirConvite = useCallback(() => {
    if (petsOndeSouPrincipal.length === 0) {
      return;
    }
    setModalAtivo('convite');
  }, [petsOndeSouPrincipal.length]);

  const handleAbrirGerenciamento = useCallback(
    (cuidador: CuidadorResumo) => {
      if (petsOndeSouPrincipal.length === 0) {
        return;
      }
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
      if (!cuidadorEmGestao) {
        return;
      }

      const onSuccess = () => {
        setCuidadorEmGestao((prev) =>
          prev
            ? {
                ...prev,
                petIds: isCurrentlyLinked
                  ? prev.petIds.filter((id) => id !== petId)
                  : [...prev.petIds, petId],
              }
            : undefined
        );
      };

      if (isCurrentlyLinked) {
        caregiverActions.remover(petId, cuidadorEmGestao.email, { onSuccess });
      } else {
        caregiverActions.convidar(petId, cuidadorEmGestao.email, { onSuccess });
      }
    },
    [cuidadorEmGestao, caregiverActions]
  );

  const handleTransferirTitularidade = useCallback(
    (petId: number, _petNome?: string) => {
      if (!cuidadorEmGestao) {
        return;
      }
      caregiverActions.transferir(petId, cuidadorEmGestao.email, {
        onSuccess: handleFecharGerenciamento,
      });
    },
    [cuidadorEmGestao, caregiverActions, handleFecharGerenciamento]
  );

  const handleRemoverDeTodosPets = useCallback(() => {
    if (!cuidadorEmGestao) {
      return;
    }

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

      caregiverActions.remover(petsParaRemover[index].id, cuidadorEmGestao.email, {
        onSuccess: () => removerSequencial(index + 1),
      });
    };

    removerSequencial(0);
  }, [cuidadorEmGestao, petsOndeSouPrincipal, caregiverActions, handleFecharGerenciamento]);

  const handleEditTask = useCallback((tarefa: TarefaResponse) => {
    setTarefaEmEdicao(tarefa);
    setModalAtivo('editarTarefa');
  }, []);

  const initialTaskData = useMemo(() => {
    if (!tarefaEmEdicao) {
      return undefined;
    }
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
    isLoadingGerenciamento: caregiverActions.isPending,
  };
}
