import { useState, useCallback, useMemo } from 'react';
import { usePets, usePetPontos } from './usePets';
import { useUserTasks, DEFAULT_TASKS_PAGE_SIZE } from './useTasks';
import { useActivePet } from './useActivePet';
import { useTaskActions } from './useTaskActions';
import { PetResponse } from '../types/pet';
import { TarefaResponse, TaskFormData } from '../types/task';
import { categorizarTarefas, filtrarTarefasHoje, ordenarTarefasRotina } from '../utils/taskUtils';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../routes/types';
import { calcularDiasSemanaAtual, calcularTotalOfensiva, formatarDataIsoYmd } from '../utils/streakUtils';
import { formatarDadosIniciaisTarefa, construirRotinaHome } from '../utils/homeUtils';

export function useHomeData(navigation?: NativeStackNavigationProp<RootStackParamList>) {
  const taskActions = useTaskActions();

  // Consultas de Pets e Tarefas
  const {
    data: petsData,
    isLoading: isLoadingPets,
    isFetching: isFetchingPets,
    isError: isErrorPets,
    error: petsError,
    refetch: refetchPets,
  } = usePets();

  const pets: PetResponse[] = petsData?.content || [];
  const { activePet, selectedPetId, selectPet } = useActivePet(pets);

  const [filtroRotina, setFiltroRotina] = useState<'HOJE' | 'TODAS'>('HOJE');
  const hojeYmd = useMemo(() => formatarDataIsoYmd(new Date()) || undefined, []);

  const {
    data: userTasksData,
    isLoading: isLoadingTasks,
    isFetching: isFetchingTasks,
    isError: isErrorTasks,
    error: tasksError,
    refetch: refetchUserTasks,
  } = useUserTasks(0, DEFAULT_TASKS_PAGE_SIZE, 'ALL');

  const tarefasDoPet: TarefaResponse[] = useMemo(() => {
    const list = userTasksData?.content || [];
    return activePet ? list.filter((t) => t.petId === activePet.id) : [];
  }, [userTasksData, activePet]);
  const { data: pontosPetData, refetch: refetchPontos } = usePetPontos(activePet?.id);

  // Derivações da Rotina do Pet Ativo
  const metricasPet = useMemo(() => categorizarTarefas(tarefasDoPet), [tarefasDoPet]);

  const tarefasDoPetHoje = useMemo(
    () => (activePet ? ordenarTarefasRotina(filtrarTarefasHoje(tarefasDoPet, hojeYmd || '')) : []),
    [tarefasDoPet, activePet, hojeYmd]
  );
  const metricasPetHoje = useMemo(() => categorizarTarefas(tarefasDoPetHoje), [tarefasDoPetHoje]);

  // Pontuação do Pet (prioriza Stored Procedure Oracle)
  const petScore = useMemo(() => {
    if (pontosPetData?.pontosTotais !== undefined) return pontosPetData.pontosTotais;
    return metricasPet.concluidas.reduce((acc, t) => acc + t.pontosTarefa, 0);
  }, [pontosPetData, metricasPet.concluidas]);

  const ofensivaFamiliar = useMemo(
    () => ({
      streakDays: calcularDiasSemanaAtual(tarefasDoPet),
      totalStreak: calcularTotalOfensiva(tarefasDoPet),
    }),
    [tarefasDoPet]
  );

  const refetch = useCallback(async () => {
    await Promise.all([refetchPets(), refetchUserTasks(), refetchPontos()]);
  }, [refetchPets, refetchUserTasks, refetchPontos]);

  // Controle de Edição da Rotina
  const [tarefaEmEdicao, setTarefaEmEdicao] = useState<TarefaResponse | undefined>(undefined);

  const handleToggleTarefa = useCallback(
    (taskId: number) => {
      taskActions.alternarStatus(taskId, tarefasDoPet, { onEdit: setTarefaEmEdicao });
    },
    [taskActions, tarefasDoPet]
  );

  const initialTaskData = useMemo(() => formatarDadosIniciaisTarefa(tarefaEmEdicao), [tarefaEmEdicao]);

  const rotinaAtual = useMemo(
    () => construirRotinaHome(filtroRotina, tarefasDoPetHoje, tarefasDoPet, metricasPetHoje, metricasPet),
    [filtroRotina, tarefasDoPetHoje, tarefasDoPet, metricasPetHoje, metricasPet]
  );

  const sectionData = useMemo(
    () => ({
      title: rotinaAtual.title,
      subtitle: rotinaAtual.subtitle,
      filter: filtroRotina,
      onFilterChange: setFiltroRotina,
      countHoje: tarefasDoPetHoje.length,
      countTodas: tarefasDoPet.length,
      tasks: rotinaAtual.tarefas,
      onToggleTask: handleToggleTarefa,
      onEditTask: setTarefaEmEdicao,
      onDeleteTask: taskActions.excluirComConfirmacao,
    }),
    [rotinaAtual.title, rotinaAtual.subtitle, rotinaAtual.tarefas, filtroRotina, tarefasDoPetHoje.length, tarefasDoPet.length, handleToggleTarefa, taskActions.excluirComConfirmacao]
  );

  const handleCloseEditModal = useCallback(() => setTarefaEmEdicao(undefined), []);

  const handleSubmitEditModal = useCallback(
    (data: TaskFormData) => {
      if (tarefaEmEdicao) {
        taskActions.atualizar(tarefaEmEdicao.id, data, { onSuccess: handleCloseEditModal });
      }
    },
    [tarefaEmEdicao, taskActions, handleCloseEditModal]
  );

  return {
    status: {
      isLoading: isLoadingPets,
      isLoadingTasks,
      isFetching: isFetchingPets || isFetchingTasks,
      isError: isErrorPets || isErrorTasks,
      error: petsError || tasksError,
      refetch,
    },
    pets: {
      list: pets,
      active: activePet,
      selectedId: selectedPetId,
      select: selectPet,
    },
    routine: {
      sectionData,
      current: rotinaAtual,
      filter: filtroRotina,
      setFilter: setFiltroRotina,
      score: petScore,
      streak: ofensivaFamiliar,
      allPetTasks: tarefasDoPet,
      todayTasks: tarefasDoPetHoje,
      completedToday: metricasPetHoje.concluidas,
      activeToday: metricasPetHoje.ativas,
      expiredToday: metricasPetHoje.expiradas,
      metricsToday: metricasPetHoje,
      toggleTask: handleToggleTarefa,
    },
    taskModal: {
      editingTask: tarefaEmEdicao,
      initialData: initialTaskData,
      isUpdating: taskActions.isUpdating,
      openEdit: setTarefaEmEdicao,
      close: handleCloseEditModal,
      submit: handleSubmitEditModal,
      remove: taskActions.excluirComConfirmacao,
    },
    navigation: {
      toFamily: useCallback(() => navigation?.navigate('Family'), [navigation]),
      toPetDetail: useCallback(() => navigation?.navigate('Family', { screen: 'PetDetail', params: { petId: activePet?.id } }), [navigation, activePet]),
      toAi: useCallback(() => navigation?.navigate('IA'), [navigation]),
      toEducation: useCallback(() => navigation?.navigate('Tabs', { screen: 'Treino' }), [navigation]),
    },
  };
}
