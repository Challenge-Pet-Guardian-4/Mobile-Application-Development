import * as SecureStore from 'expo-secure-store';
import { UsuarioResponse } from '../types/user';

const SECURE_TOKEN_KEY = 'petguardian_auth_token';
const SECURE_USER_EMAIL_KEY = 'petguardian_user_email';
const SECURE_USER_PROFILE_KEY = 'petguardian_user_profile';

export const StorageService = {
  async saveAuth(token: string, user: UsuarioResponse): Promise<void> {
    await Promise.all([
      SecureStore.setItemAsync(SECURE_TOKEN_KEY, token),
      SecureStore.setItemAsync(SECURE_USER_EMAIL_KEY, user.email),
      SecureStore.setItemAsync(SECURE_USER_PROFILE_KEY, JSON.stringify(user)),
    ]);
  },

  async saveUser(user: UsuarioResponse): Promise<void> {
    await Promise.all([
      SecureStore.setItemAsync(SECURE_USER_EMAIL_KEY, user.email),
      SecureStore.setItemAsync(SECURE_USER_PROFILE_KEY, JSON.stringify(user)),
    ]);
  },

  async getToken(): Promise<string | null> {
    return await SecureStore.getItemAsync(SECURE_TOKEN_KEY);
  },

  async getEmail(): Promise<string | null> {
    return await SecureStore.getItemAsync(SECURE_USER_EMAIL_KEY);
  },

  async getUser(): Promise<UsuarioResponse | null> {
    const raw = await SecureStore.getItemAsync(SECURE_USER_PROFILE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as UsuarioResponse;
    } catch {
      return null;
    }
  },

  async clearAuthSession(): Promise<void> {
    await Promise.all([
      SecureStore.deleteItemAsync(SECURE_TOKEN_KEY),
      SecureStore.deleteItemAsync(SECURE_USER_EMAIL_KEY),
      SecureStore.deleteItemAsync(SECURE_USER_PROFILE_KEY),
    ]);
  },
};
