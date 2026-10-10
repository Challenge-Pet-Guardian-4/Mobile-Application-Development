import { http } from './http';
import { StorageService } from './storage';
import { Page } from '../types/api';
import {
  CoCuidadorResponse,
  PetDetailResponse,
  PetPontuacaoAgregadaResponse,
  PetRequest,
  PetResponse,
} from '../types/pet';

export const PetService = {
  // Busca a ficha consolidada do pet com pontuação, cuidadores, tarefas e prontuário (GET /pets/{id}/detalhe)
  async getPetDetail(id: number): Promise<PetDetailResponse> {
    const response = await http.get<PetDetailResponse>(`/pets/${id}/detalhe`);
    return response.data;
  },
  // Lista pets vinculados ao usuário autenticado via JWT (/pets/me)
  async getMyPets(page = 0, size = 20): Promise<Page<PetResponse>> {
    const response = await http.get<Page<PetResponse>>('/pets/me', {
      params: { page, size, sort: 'nome,asc' },
    });
    return response.data;
  },

  // Consulta a pontuação total agregada de todos os pets do usuário via JWT (/pets/me/pontos)
  async getMyPetsPontos(): Promise<PetPontuacaoAgregadaResponse> {
    const response = await http.get<PetPontuacaoAgregadaResponse>('/pets/me/pontos');
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

  // Care Circle: Convida co-cuidador por e-mail (POST /pets/{id}/cuidadores)
  async convidarPorEmail(petId: number, email: string): Promise<CoCuidadorResponse> {
    const response = await http.post<CoCuidadorResponse>(`/pets/${petId}/cuidadores`, {
      email: email.trim().toLowerCase(),
    });
    return response.data;
  },

  // Care Circle: Desvincula um cuidador por e-mail (DELETE /pets/{id}/cuidadores?email=...) ou a si próprio via /me
  async desvincularCuidador(petId: number, email?: string): Promise<void> {
    const user = await StorageService.getUser();
    if (!email || (user?.email && email.trim().toLowerCase() === user.email.toLowerCase())) {
      await http.delete(`/pets/${petId}/cuidadores/me`);
      return;
    }
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

