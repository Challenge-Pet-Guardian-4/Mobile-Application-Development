import { http } from './http';
import { RedeCuidadoResponse, UsuarioRequest, UsuarioResponse } from '../types/user';

export const UserService = {
  // Busca perfil do usuário autenticado via JWT (/usuarios/me)
  async getMe(): Promise<UsuarioResponse> {
    const response = await http.get<UsuarioResponse>('/usuarios/me');
    return response.data;
  },

  // Atualiza perfil do usuário autenticado via JWT (/usuarios/me)
  async updateMe(usuarioRequest: UsuarioRequest): Promise<UsuarioResponse> {
    const response = await http.put<UsuarioResponse>('/usuarios/me', usuarioRequest);
    return response.data;
  },

  // Visualiza rede de cuidado do próprio usuário autenticado via JWT (/usuarios/me/rede-cuidado)
  async getMyRedeCuidado(): Promise<RedeCuidadoResponse> {
    const response = await http.get<RedeCuidadoResponse>('/usuarios/me/rede-cuidado');
    return response.data;
  },

  // Realiza upgrade do perfil do usuário autenticado para PREMIUM (/usuarios/me/upgrade-premium)
  async upgradeMyPremium(): Promise<UsuarioResponse> {
    const response = await http.patch<UsuarioResponse>('/usuarios/me/upgrade-premium');
    return response.data;
  },
};
