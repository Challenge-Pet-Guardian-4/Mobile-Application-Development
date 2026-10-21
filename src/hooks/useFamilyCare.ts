import { useState, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { useSession } from './useSession';
import { usePets, usePetsPontosMap, useCreatePet, useCaregiverActions, PETS_PAGE_SIZE } from './usePets';
import { useUserTasks, DEFAULT_TASKS_PAGE_SIZE } from './useTasks';
import { useTaskActions } from './useTaskActions';
import { useRedeCuidado } from './useUsers';
import { useFamilyModals } from './useFamilyModals';
import { normalizarDataNascParaIso } from '../utils/petUtils';
import { PetResponse, PetFormData, PetOption } from '../types/pet';
import { TarefaResponse } from '../types/task';
import { RedeCuidadoResponse, InviteCaregiverData, PetResumo } from '../types/user';
import { ActionCallbacks } from '../types/api';
import { PetSchema, InviteCaregiverSchema, formatZodError } from '../utils/schemas';
import { createMutationCallbacks } from '../utils/apiError';
import { formatarDataIsoYmd } from '../utils/streakUtils';
import { filtrarTarefasHoje, ordenarTarefasRotina } from '../utils/taskUtils';
import { mesclarPetsComMetadados, formatarListaCoCuidadores, construirCuidadorUsuarioLogado, construirResumoFamiliar } from '../utils/familyCareUtils';

export function useFamilyCare() {
  const { user } = useSession();

  const [petsPage, setPetsPage] = useState(0);

  // Queries TanStack de dados da família e pets (paginação server-side de 4 por vez)
  const { data: petsData, isLoading: isLoadingPets, isFetching: isFetchingPets, refetch: refetchPets } = usePets(petsPage, PETS_PAGE_SIZE);
  const {
    data: userTasksData,
    isLoading: isLoadingTasks,
    isFetching: isFetchingTasks,
    refetch: refetchTasks,
  } = useUserTasks(0, DEFAULT_TASKS_PAGE_SIZE, 'ALL');
  const { data: redeCuidadoData, isLoading: isLoadingRede, isFetching: isFetchingRede, refetch: refetchRede } = useRedeCuidado();

  const pets: PetResponse[] = petsData?.content || [];
  const allTasks: TarefaResponse[] = userTasksData?.content || [];
  const redeCuidado: RedeCuidadoResponse | undefined = redeCuidadoData;

  // Pontuação individual dos animais calculada pelas procedures Oracle
  const pontosMap = usePetsPontosMap();

  // Mutations e Ações de Domínio
  const createPetMutation = useCreatePet();
  const taskActions = useTaskActions();
  const caregiverActions = useCaregiverActions();

  // Rotina do dia e filtragem
  const hojeYmd = useMemo(() => formatarDataIsoYmd(new Date()), []);
  const tasksHoje = useMemo(() => ordenarTarefasRotina(filtrarTarefasHoje(allTasks, hojeYmd)), [allTasks, hojeYmd]);
  const [filtroRotina, setFiltroRotina] = useState<'HOJE' | 'TODAS'>('HOJE');
  const tasksExibidas = useMemo(
    () => (filtroRotina === 'HOJE' ? tasksHoje : ordenarTarefasRotina(allTasks)),
    [filtroRotina, tasksHoje, allTasks]
  );

  // Mapeamento de titularidade e lista completa de pets da família
  const todosOsPets: PetOption[] = useMemo(
    () => (redeCuidado?.pets || []).map((p) => ({ id: p.id, nome: p.nome })),
    [redeCuidado?.pets]
  );
  const petsOndeSouPrincipal: PetResumo[] = useMemo(
    () => (redeCuidado?.pets || []).filter((p) => p.responsavelPrincipal),
    [redeCuidado?.pets]
  );

  // Ações de formulários e modais
  const cadastrarPet = useCallback(
    (data: PetFormData, callbacks?: ActionCallbacks) => {
      const validacao = PetSchema.safeParse(data);
      if (!validacao.success) {
        Alert.alert('Dados Inválidos', formatZodError(validacao.error));
        return;
      }

      createPetMutation.mutate(
        {
          nome: data.nome.trim(),
          raca: data.raca.trim(),
          dataNasc: normalizarDataNascParaIso(data.dataNasc),
          porte: data.porte,
          sexo: data.sexo,
          castrado: data.castrado,
        },
        createMutationCallbacks('Erro ao Cadastrar Pet', 'Não foi possível cadastrar o pet na API.', callbacks)
      );
    },
    [createPetMutation]
  );

  // Enviar convite de co-cuidador (POST /pets/{id}/cuidadores)
  const convidarCuidador = useCallback(
    (data: InviteCaregiverData, callbacks?: ActionCallbacks) => {
      const validacao = InviteCaregiverSchema.safeParse(data);
      if (!validacao.success) {
        Alert.alert('Dados do Convite', formatZodError(validacao.error));
        return;
      }

      caregiverActions.convidar(validacao.data.petId, data.email, callbacks);
    },
    [caregiverActions]
  );

  const modals = useFamilyModals({
    petsOndeSouPrincipal,
    cadastrarTarefa: taskActions.cadastrar,
    atualizarTarefa: taskActions.atualizar,
  });

  const alternarStatusTarefa = useCallback(
    (taskId: number) => {
      taskActions.alternarStatus(taskId, allTasks, { onEdit: modals.abrirEdicaoTarefa });
    },
    [taskActions, allTasks, modals.abrirEdicaoTarefa]
  );

  const removerTarefa = useCallback(
    (taskId: number, callbacks?: ActionCallbacks) => {
      taskActions.excluirComConfirmacao(taskId, callbacks);
    },
    [taskActions]
  );

  // Processamento e formatação de entidades
  const petsComMetadados = useMemo(
    () => mesclarPetsComMetadados(pets, redeCuidado, pontosMap),
    [pets, redeCuidado, pontosMap]
  );

  const coCuidadoresFormatados = useMemo(
    () => formatarListaCoCuidadores(redeCuidado?.coCuidadores || [], todosOsPets, petsOndeSouPrincipal),
    [redeCuidado?.coCuidadores, todosOsPets, petsOndeSouPrincipal]
  );

  const currentUserCaregiver = useMemo(
    () => construirCuidadorUsuarioLogado(user, todosOsPets, petsOndeSouPrincipal),
    [user, todosOsPets, petsOndeSouPrincipal]
  );

  const isHoje = filtroRotina === 'HOJE';
  const routineData = useMemo(
    () => ({
      title: isHoje ? 'Rotina de Hoje' : 'Rotina & Tarefas',
      subtitle: `${tasksExibidas.length} tarefa${tasksExibidas.length === 1 ? '' : 's'} ${isHoje ? 'hoje' : 'no total'}`,
      filter: filtroRotina,
      onFilterChange: setFiltroRotina,
      countHoje: tasksHoje.length,
      countTodas: allTasks.length,
      tasks: tasksExibidas,
      onToggleTask: alternarStatusTarefa,
      onEditTask: modals.abrirEdicaoTarefa,
      onDeleteTask: removerTarefa,
    }),
    [isHoje, tasksExibidas, filtroRotina, tasksHoje.length, allTasks.length, alternarStatusTarefa, modals.abrirEdicaoTarefa, removerTarefa]
  );

  const familySummary = useMemo(
    () => construirResumoFamiliar(user, petsData?.totalElements ?? pets.length, redeCuidado, allTasks),
    [user, petsData?.totalElements, pets.length, redeCuidado, allTasks]
  );

  return {
    status: {
      isLoading: (isLoadingPets || isLoadingRede) && pets.length === 0,
      isFetching: isFetchingPets || isFetchingTasks || isFetchingRede,
      isLoadingTasks,
      refetchAll: () => {
        refetchPets();
        refetchTasks();
        refetchRede();
      },
    },
    family: {
      user,
      currentUserCaregiver,
      pets,
      petsComMetadados,
      petsExibidos: petsComMetadados,
      petsPagination: {
        currentPage: petsPage,
        totalPages: petsData?.totalPages ?? 1,
        totalElements: petsData?.totalElements ?? pets.length,
        onPageChange: setPetsPage,
      },
      summary: familySummary,
      routineData,
      redeCuidado,
      coCuidadores: coCuidadoresFormatados,
      petsOndeSouPrincipal,
    },
    modals,
    actions: {
      cadastrarPet: (data: PetFormData) => cadastrarPet(data, { onSuccess: modals.fechar }),
      convidarCuidador: (data: InviteCaregiverData) => convidarCuidador(data, { onSuccess: modals.fechar }),
      removerTarefa,
      alternarStatusTarefa,
      isCreatingPet: createPetMutation.isPending,
      isCreatingTask: taskActions.isCreating,
      isUpdatingTask: taskActions.isUpdating,
      isInvitingCaregiver: caregiverActions.isInviting,
      isDeletingTask: taskActions.isDeleting,
    },
  };
}
