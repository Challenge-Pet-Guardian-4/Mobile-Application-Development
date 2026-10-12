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

  // Busca todas as tarefas pendentes através de todas as páginas da API (/tarefas/me)
  async getTodasTarefasPendentes(): Promise<TarefaResponse[]> {
    let page = 0;
    const size = 50;
    let todas: TarefaResponse[] = [];
    while (true) {
      const data = await this.getMyTarefas(page, size, 'PENDENTE');
      todas = todas.concat(data.content || []);
      if (data.last || (data.totalPages !== undefined && page + 1 >= data.totalPages) || !data.content?.length) {
        break;
      }
      page++;
    }
    return todas;
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
