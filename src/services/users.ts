import { AxiosResponse } from 'axios';
import { http } from './http';
import { StorageService } from './storage';
import { RedeCuidadoResponse, UsuarioRequest, UsuarioResponse } from '../types/user';

async function saveAuthIfRefreshed(response: AxiosResponse<UsuarioResponse>): Promise<UsuarioResponse> {
  const novoToken = response.headers['x-novo-token'];
  if (typeof novoToken === 'string') {
    await StorageService.saveAuth(novoToken, response.data);
  }
  return response.data;
}

export const UserService = {
  // Busca perfil do usuário autenticado via JWT (/usuarios/me)
  async getMe(): Promise<UsuarioResponse> {
    const response = await http.get<UsuarioResponse>('/usuarios/me');
    return response.data;
  },

  // Atualiza perfil do usuário autenticado via JWT (/usuarios/me)
  async updateMe(usuarioRequest: UsuarioRequest): Promise<UsuarioResponse> {
    const response = await http.put<UsuarioResponse>('/usuarios/me', usuarioRequest);
    return saveAuthIfRefreshed(response);
  },

  // Visualiza rede de cuidado do próprio usuário autenticado via JWT (/usuarios/me/rede-cuidado)
  async getMyRedeCuidado(): Promise<RedeCuidadoResponse> {
    const response = await http.get<RedeCuidadoResponse>('/usuarios/me/rede-cuidado');
    return response.data;
  },

  // Realiza upgrade do perfil do usuário autenticado para PREMIUM (/usuarios/me/upgrade-premium)
  async upgradeMyPremium(): Promise<UsuarioResponse> {
    const response = await http.patch<UsuarioResponse>('/usuarios/me/upgrade-premium');
    return saveAuthIfRefreshed(response);
  },

  // Remove a conta do usuário autenticado do sistema (/usuarios/me)
  async deleteMe(): Promise<void> {
    await http.delete('/usuarios/me');
  },
};
