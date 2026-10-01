import { http } from './http';
import { StorageService } from './storage';
import { UsuarioResponse } from '../types/user';
import { LoginCredentials, LoginResponse, RegisterCredentials } from '../types/auth';

export const AuthService = {
  async register(data: RegisterCredentials): Promise<UsuarioResponse> {
    const { data: usuario } = await http.post<UsuarioResponse>('/usuarios', {
      nome: data.nome.trim(),
      email: data.email.trim().toLowerCase(),
      senha: data.senha,
      ddd: data.ddd.replace(/\D/g, ''),
      numeroTelefone: data.numeroTelefone.replace(/\D/g, ''),
      endereco: {
        cep: data.cep.replace(/\D/g, ''),
        numero: data.numero.trim(),
      },
    });
    return usuario;
  },

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const email = credentials.email.trim().toLowerCase();
    const { data } = await http.post<LoginResponse>('/login', {
      email,
      senha: credentials.senha,
    });

    await StorageService.saveAuth(data.token, data.user);
    return data;
  },

  async getStoredSession(): Promise<{ user: UsuarioResponse | null; token: string | null }> {
    const [token, user] = await Promise.all([
      StorageService.getToken(),
      StorageService.getUser(),
    ]);

    if (!token || !user) return { user: null, token: null };

    try {
      const { data: freshUser } = await http.get<UsuarioResponse>('/usuarios/me');
      await StorageService.saveUser(freshUser);
      return { user: freshUser, token };
    } catch {
      // Mantém a sessão local com os dados persistidos no SecureStore em caso de cold start
      return { user, token };
    }
  },

  async logout(): Promise<void> {
    await StorageService.clearAuthSession();
  },
};

