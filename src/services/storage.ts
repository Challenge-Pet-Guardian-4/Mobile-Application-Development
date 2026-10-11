import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { UsuarioResponse } from '../types/user';

const SECURE_TOKEN_KEY = 'petguardian_auth_token';
const SECURE_USER_EMAIL_KEY = 'petguardian_user_email';
const SECURE_USER_PROFILE_KEY = 'petguardian_user_profile';

const isWeb = Platform.OS === 'web';

async function setItem(key: string, value: string): Promise<void> {
  if (isWeb) {
    await AsyncStorage.setItem(key, value);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
}

async function getItem(key: string): Promise<string | null> {
  if (isWeb) {
    return await AsyncStorage.getItem(key);
  } else {
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  }
}

async function deleteItem(key: string): Promise<void> {
  if (isWeb) {
    await AsyncStorage.removeItem(key);
  } else {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch {
      // Ignora falha de deleção silenciosa
    }
  }
}

export const StorageService = {
  async saveAuth(token: string, user: UsuarioResponse): Promise<void> {
    await Promise.all([
      setItem(SECURE_TOKEN_KEY, token),
      setItem(SECURE_USER_EMAIL_KEY, user.email),
      setItem(SECURE_USER_PROFILE_KEY, JSON.stringify(user)),
    ]);
  },

  async saveUser(user: UsuarioResponse): Promise<void> {
    await Promise.all([
      setItem(SECURE_USER_EMAIL_KEY, user.email),
      setItem(SECURE_USER_PROFILE_KEY, JSON.stringify(user)),
    ]);
  },

  async getToken(): Promise<string | null> {
    return await getItem(SECURE_TOKEN_KEY);
  },

  async getEmail(): Promise<string | null> {
    return await getItem(SECURE_USER_EMAIL_KEY);
  },

  async getUser(): Promise<UsuarioResponse | null> {
    const raw = await getItem(SECURE_USER_PROFILE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as UsuarioResponse;
    } catch {
      return null;
    }
  },

  async clearAuthSession(): Promise<void> {
    await Promise.all([
      deleteItem(SECURE_TOKEN_KEY),
      deleteItem(SECURE_USER_EMAIL_KEY),
      deleteItem(SECURE_USER_PROFILE_KEY),
    ]);
  },
};
