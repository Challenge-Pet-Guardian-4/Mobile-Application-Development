import { useState, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { useSession } from './useSession';
import { usePets, usePetsPontosMap, useCreatePet, useInviteCaregiver } from './usePets';
import { useUserTasks, useCreateTask } from './useTasks';
import { useTaskActions } from './useTaskActions';
import { useRedeCuidado } from './useRedeCuidado';
import { useFamilyModals } from './useFamilyModals';
import { normalizarDataNascParaIso, normalizarPrazoParaIso } from '../utils/petUtils';
import { PetResponse, PetFormData } from '../types/pet';
import { TarefaResponse, TaskFormData } from '../types/task';
import { RedeCuidadoResponse, InviteCaregiverData } from '../types/user';
import { PetSchema, TaskSchema, InviteCaregiverSchema, formatZodError } from '../utils/schemas';
import { createMutationCallbacks, ActionCallbacks } from '../utils/apiError';
import { formatarDataIsoYmd } from '../utils/streakUtils';
import { filtrarTarefasHoje, ordenarTarefasRotina } from '../utils/taskUtils';
import {
  mesclarPetsComMetadados,
  formatarListaCoCuidadores,
  construirCuidadorUsuarioLogado,
  construirResumoFamiliar,
} from '../utils/familyCareUtils';

export type { ActionCallbacks };

export function useFamilyCare() {
  const { user } = useSession();

  // Queries TanStack de dados da família e pets
  const { data: petsData, isLoading: isLoadingPets, isFetching: isFetchingPets, refetch: refetchPets } = usePets();
  const {
    data: userTasksData,
    isLoading: isLoadingTasks,
    isFetching: isFetchingTasks,
    refetch: refetchTasks,
  } = useUserTasks(0, 100, 'ALL');
  const { data: redeCuidadoData, isLoading: isLoadingRede, isFetching: isFetchingRede, refetch: refetchRede } = useRedeCuidado();

  const pets: PetResponse[] = petsData?.content || [];
  const allTasks: TarefaResponse[] = userTasksData?.content || [];
  const redeCuidado: RedeCuidadoResponse | undefined = redeCuidadoData;

  // Pontuação individual dos animais calculada pelas procedures Oracle
  const pontosMap = usePetsPontosMap(pets);

  // Mutations
  const createPetMutation = useCreatePet();
  const createTaskMutation = useCreateTask();
  const inviteMutation = useInviteCaregiver();
  const taskActions = useTaskActions();

  // Rotina do dia e filtragem
  const hojeYmd = useMemo(() => formatarDataIsoYmd(new Date()), []);
  const tasksHoje = useMemo(() => ordenarTarefasRotina(filtrarTarefasHoje(allTasks, hojeYmd)), [allTasks, hojeYmd]);
  const [filtroRotina, setFiltroRotina] = useState<'HOJE' | 'TODAS'>('HOJE');
  const tasksExibidas = useMemo(
    () => (filtroRotina === 'HOJE' ? tasksHoje : ordenarTarefasRotina(allTasks)),
    [filtroRotina, tasksHoje, allTasks]
  );

  // Mapeamento de titularidade
  const petsResumoMap = useMemo(
    () => new Map((redeCuidado?.pets || []).map((p) => [p.id, p])),
    [redeCuidado?.pets]
  );
  const petsOndeSouPrincipal = useMemo(
    () => pets.filter((p) => petsResumoMap.get(p.id)?.responsavelPrincipal ?? true),
    [pets, petsResumoMap]
  );

  // Ações de formulários e modais
  const cadastrarPet = useCallback(
    (data: PetFormData, callbacks?: ActionCallbacks) => {
      if (!user) return Alert.alert('Sessão expirada', 'Faça login novamente para cadastrar um pet.');
      const validacao = PetSchema.safeParse(data);
      if (!validacao.success) return Alert.alert('Dados Inválidos', formatZodError(validacao.error));

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
    [user, createPetMutation]
  );

  // Cadastrar nova rotina/tarefa para um pet (POST /tarefas)
  const cadastrarTarefa = useCallback(
    (data: TaskFormData, callbacks?: ActionCallbacks) => {
      if (!user) return Alert.alert('Sessão expirada', 'Faça login novamente para criar uma tarefa.');
      const validacao = TaskSchema.safeParse(data);
      if (!validacao.success) return Alert.alert('Dados da Tarefa', formatZodError(validacao.error));

      createTaskMutation.mutate(
        {
          titulo: data.titulo.trim(),
          descricao: data.descricao.trim(),
          pontosTarefa: Number(data.pontos),
          prazo: normalizarPrazoParaIso(data.prazo),
          petId: data.petId,
          status: data.status || 'PENDENTE',
        },
        createMutationCallbacks('Erro ao Cadastrar Tarefa', 'Não foi possível cadastrar a tarefa na API.', callbacks)
      );
    },
    [user, createTaskMutation]
  );

  // Enviar convite de co-cuidador (POST /pets/{id}/cuidadores)
  const convidarCuidador = useCallback(
    (data: InviteCaregiverData, callbacks?: ActionCallbacks) => {
      if (!user) return Alert.alert('Sessão expirada', 'Faça login novamente para enviar convite.');
      const validacao = InviteCaregiverSchema.safeParse(data);
      if (!validacao.success) return Alert.alert('Dados do Convite', formatZodError(validacao.error));

      inviteMutation.mutate(
        {
          petId: validacao.data.petId,
          email: data.email.trim().toLowerCase(),
        },
        createMutationCallbacks('Erro ao Convidar Cuidador', 'Não foi possível enviar o convite.', callbacks)
      );
    },
    [user, inviteMutation]
  );

  const modals = useFamilyModals({
    user,
    petsOndeSouPrincipal,
    cadastrarTarefa,
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

  // Paginação dos animais da família (4 pets por página)
  const PETS_PAGE_SIZE = 4;
  const [petsPage, setPetsPage] = useState(0);
  const petsTotalPages = Math.max(1, Math.ceil(petsComMetadados.length / PETS_PAGE_SIZE));
  const safePetsPage = Math.min(petsPage, Math.max(0, petsTotalPages - 1));
  const petsExibidos = useMemo(
    () => petsComMetadados.slice(safePetsPage * PETS_PAGE_SIZE, (safePetsPage + 1) * PETS_PAGE_SIZE),
    [petsComMetadados, safePetsPage]
  );

  const coCuidadoresFormatados = useMemo(
    () => formatarListaCoCuidadores(redeCuidado?.coCuidadores || [], pets, petsOndeSouPrincipal),
    [redeCuidado?.coCuidadores, pets, petsOndeSouPrincipal]
  );

  const currentUserCaregiver = useMemo(
    () => construirCuidadorUsuarioLogado(user, pets, petsOndeSouPrincipal),
    [user, pets, petsOndeSouPrincipal]
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
    () => construirResumoFamiliar(user, pets.length, redeCuidado, allTasks),
    [user, pets.length, redeCuidado, allTasks]
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
      petsExibidos,
      petsPagination: {
        currentPage: safePetsPage,
        totalPages: petsTotalPages,
        totalElements: petsComMetadados.length,
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
      isCreatingTask: createTaskMutation.isPending,
      isUpdatingTask: taskActions.isUpdating,
      isInvitingCaregiver: inviteMutation.isPending,
      isDeletingTask: taskActions.isDeleting,
    },
  };
}
