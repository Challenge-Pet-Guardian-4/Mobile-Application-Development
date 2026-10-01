import { http } from './http';
import { Page } from '../types/api';
import { CoCuidadorResponse, PetHistoryResponse, PetPontuacaoResponse, PetRequest, PetResponse } from '../types/pet';


export const PetService = {
  // Lista pets vinculados ao usuário autenticado via JWT (/pets/me)
  async getMyPets(page = 0, size = 20): Promise<Page<PetResponse>> {
    const response = await http.get<Page<PetResponse>>('/pets/me', {
      params: { page, size, sort: 'nome,asc' },
    });
    return response.data;
  },

  // Busca detalhes de um pet específico por ID
  async getPetById(id: number): Promise<PetResponse> {
    const response = await http.get<PetResponse>(`/pets/${id}`);
    return response.data;
  },

  // Busca histórico consolidado de cuidados do pet
  async getPetHistory(id: number): Promise<PetHistoryResponse> {
    const response = await http.get<PetHistoryResponse>(`/pets/${id}/historico`);
    return response.data;
  },

  // Consulta a pontuação total acumulada pelo pet (tarefas + aulas)
  async getPetPontos(id: number): Promise<PetPontuacaoResponse> {
    const response = await http.get<PetPontuacaoResponse>(`/pets/${id}/pontos`);
    return response.data;
  },

  // Cria um novo pet vinculado ao usuário
  async createPet(petRequest: PetRequest): Promise<PetResponse> {
    const response = await http.post<PetResponse>('/pets', petRequest);
    return response.data;
  },

  // Atualiza os dados de um pet existente
  async updatePet(id: number, petRequest: PetRequest): Promise<PetResponse> {
    const response = await http.put<PetResponse>(`/pets/${id}`, petRequest);
    return response.data;
  },

  // Exclui um pet do sistema (somente responsável principal via JWT)
  async deletePet(id: number): Promise<void> {
    await http.delete(`/pets/${id}`);
  },

  // Care Circle: Lista cuidadores vinculados ao pet (GET /pets/{id}/cuidadores)
  async getCuidadores(petId: number): Promise<CoCuidadorResponse[]> {
    const response = await http.get<CoCuidadorResponse[]>(`/pets/${petId}/cuidadores`);
    return response.data;
  },

  // Care Circle: Convida co-cuidador por e-mail (POST /pets/{id}/cuidadores)
  async convidarPorEmail(petId: number, email: string): Promise<CoCuidadorResponse> {
    const response = await http.post<CoCuidadorResponse>(`/pets/${petId}/cuidadores`, {
      email: email.trim().toLowerCase(),
    });
    return response.data;
  },

  // Care Circle: Desvincula um cuidador por e-mail (DELETE /pets/{id}/cuidadores?email=...)
  async desvincularCuidador(petId: number, email: string): Promise<void> {
    await http.delete(`/pets/${petId}/cuidadores`, {
      params: { email: email.trim().toLowerCase() },
    });
  },

  // Care Circle: Transfere responsabilidade principal por e-mail (PATCH /pets/{id}/responsavel-principal)
  async transferirResponsabilidade(petId: number, novoResponsavelEmail: string): Promise<void> {
    await http.patch(`/pets/${petId}/responsavel-principal`, {
      novoResponsavelEmail: novoResponsavelEmail.trim().toLowerCase(),
    });
  },
};

