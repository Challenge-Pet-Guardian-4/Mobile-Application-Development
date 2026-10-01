import { http } from './http';
import { Page } from '../types/api';
import { TarefaRequest, TarefaResponse } from '../types/task';

export const TaskService = {
  // Lista tarefas do usuário autenticado via JWT (/tarefas/me)
  async getMyTarefas(page = 0, size = 50, status?: string): Promise<Page<TarefaResponse>> {
    const params: Record<string, unknown> = { page, size, sort: 'prazo,asc' };
    if (status) {
      params.status = status;
    }
    const response = await http.get<Page<TarefaResponse>>('/tarefas/me', { params });
    return response.data;
  },

  // Consulta o total de pontos acumulados pelo usuário autenticado via JWT (/tarefas/me/pontos)
  async getMyPontos(): Promise<number> {
    const response = await http.get<number>('/tarefas/me/pontos');
    return response.data;
  },

  // Lista tarefas de um pet específico (/tarefas/by-pet/{petId})
  async getTarefasPorPet(petId: number, page = 0, size = 50): Promise<Page<TarefaResponse>> {
    const response = await http.get<Page<TarefaResponse>>(`/tarefas/by-pet/${petId}`, {
      params: { page, size, sort: 'prazo,asc' },
    });
    return response.data;
  },

  // Busca tarefa por ID
  async getTarefaById(id: number): Promise<TarefaResponse> {
    const response = await http.get<TarefaResponse>(`/tarefas/${id}`);
    return response.data;
  },

  // Cria uma nova tarefa na API Java
  async createTarefa(tarefaRequest: TarefaRequest): Promise<TarefaResponse> {
    const response = await http.post<TarefaResponse>('/tarefas', tarefaRequest);
    return response.data;
  },

  // Atualiza uma tarefa existente
  async updateTarefa(id: number, tarefaRequest: TarefaRequest): Promise<TarefaResponse> {
    const response = await http.put<TarefaResponse>(`/tarefas/${id}`, tarefaRequest);
    return response.data;
  },

  // Conclui uma tarefa somando pontos ao cuidador e ao pet via JWT
  async concluirTarefa(id: number): Promise<TarefaResponse> {
    const response = await http.patch<TarefaResponse>(`/tarefas/${id}/concluir`);
    return response.data;
  },

  // Desmarca uma tarefa concluída retornando seu status para PENDENTE via JWT
  async desmarcarTarefa(id: number): Promise<TarefaResponse> {
    const response = await http.patch<TarefaResponse>(`/tarefas/${id}/desmarcar`);
    return response.data;
  },

  // Remove uma tarefa
  async deleteTarefa(id: number): Promise<void> {
    await http.delete(`/tarefas/${id}`);
  },
};
