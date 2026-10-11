import { http } from './http';
import { TrainingTrack, AulaCompletaResponse, ConteudoAulaApiResponse, TrilhaCompletaResponse, } from '../types/training';
import { mapearAulaParaLicao, mapearTrilhaParaTrack } from '../utils/trainingUtils';

/**
 * Serviço responsável pela comunicação HTTP com os endpoints de Treinamento/Trilhas do backend Java.
 */
export const TrainingService = {

  /**
   * Busca a árvore completa de trilhas, módulos e aulas dos pets do tutor (GET /trilhas/me)
   * em 1 única requisição HTTP consolidada, transformando os DTOs nos ViewModels da UI (TrainingTrack[]).
   */
  async getTrilhas(): Promise<TrainingTrack[]> {
    const response = await http.get<TrilhaCompletaResponse[]>('/trilhas/me');
    const trilhas = response.data || [];
    if (!trilhas.length) return [];

    return trilhas.map((trilha, index) => {
      const licoes = (trilha.modulos || []).flatMap((modulo) =>
        (modulo.aulas || []).map((aula) => mapearAulaParaLicao(aula, modulo.tempoConclusao))
      );
      return mapearTrilhaParaTrack(trilha, licoes, index);
    });
  },

  /**
   * Busca o conteúdo rico NoSQL da aula armazenado no MongoDB (GET /aulas/{aulaId}/conteudo).
   */
  async getConteudoAula(aulaId: number): Promise<ConteudoAulaApiResponse> {
    const response = await http.get<ConteudoAulaApiResponse>(`/aulas/${aulaId}/conteudo`);
    return response.data;
  },

  /**
   * Conclui uma aula específica atribuindo seus pontos ao pet (PATCH /aulas/{id}/concluir).
   */
  async concluirAula(aulaId: number): Promise<AulaCompletaResponse> {
    const response = await http.patch<AulaCompletaResponse>(`/aulas/${aulaId}/concluir`);
    return response.data;
  },

  /**
   * Desmarca a conclusão de uma aula (PATCH /aulas/{id}/desmarcar).
   */
  async desmarcarAula(aulaId: number): Promise<AulaCompletaResponse> {
    const response = await http.patch<AulaCompletaResponse>(`/aulas/${aulaId}/desmarcar`);
    return response.data;
  },

  /**
   * Conclui a lição e retorna a quantidade de pontos obtidos.
   */
  async concluirLicao(licaoId: string): Promise<{ pontosGanhos: number }> {
    const numId = Number(licaoId);
    if (Number.isNaN(numId) || numId <= 0) {
      throw new Error(`ID de lição inválido: ${licaoId}`);
    }
    const data = await this.concluirAula(numId);
    return { pontosGanhos: data.pontosAula };
  },

  /**
   * Desmarca a conclusão da lição.
   */
  async desmarcarLicao(licaoId: string): Promise<void> {
    const numId = Number(licaoId);
    if (Number.isNaN(numId) || numId <= 0) {
      throw new Error(`ID de lição inválido: ${licaoId}`);
    }
    await this.desmarcarAula(numId);
  },
};
