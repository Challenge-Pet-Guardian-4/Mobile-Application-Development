import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { StorageService } from './storage';
import { env } from '../config/env';
import { ApiErrorResponse } from '../types/api';
import { normalizeHttpError } from '../utils/apiError';

export function createThrottledPing(
  action: () => Promise<unknown>,
  cooldownMs = 10 * 60 * 1000
): () => Promise<boolean> {
  let inFlight: Promise<boolean> | null = null;
  let lastTimestamp = 0;

  return async (): Promise<boolean> => {
    const now = Date.now();

    if (now - lastTimestamp < cooldownMs) {
      return true;
    }

    if (inFlight) {
      return inFlight;
    }

    inFlight = (async () => {
      try {
        await action();
        lastTimestamp = Date.now();
        return true;
      } catch {
        return false;
      } finally {
        inFlight = null;
      }
    })();

    return inFlight;
  };
}

// Instância centralizada do Axios configurada para ambientes em nuvem (Azure Web App / Render)
export const http = axios.create({
  baseURL: env.apiUrl,
  timeout: 40000, // 40 segundos para tolerar cold starts do container e pool de banco
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Interceptor de Request: Injeção de Bearer Token JWT do Storage Seguro
http.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await StorageService.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // Falha silenciosa ao recuperar token do storage
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Callback para notificar expiração de sessão
let onUnauthorizedCallback: (() => void) | null = null;

export const setOnUnauthorizedCallback = (callback: () => void) => {
  onUnauthorizedCallback = callback;
};

// Interceptor de Response: Orquestra limpeza de sessão em 401 e delega normalização a normalizeHttpError (SRP)
http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const status = error.response?.status ?? 0;

    // 401: Notificação e limpeza de credenciais
    if (status === 401) {
      try {
        await StorageService.clearAuthSession();
      } catch {
        // ignore
      }
      onUnauthorizedCallback?.();
    } else if (status === 0) {
      console.warn(
        `[HTTP] Falha de conexão: ${error.config?.method?.toUpperCase()} ${error.config?.baseURL || ''}${error.config?.url || ''} | Código: ${error.code || 'DESCONHECIDO'} | Detalhes: ${error.message}`
      );
    }

    return Promise.reject(normalizeHttpError(error));
  }
);

export const HttpService = {
  /**
   * Dispara um ping assíncrono para o endpoint de saúde do Spring Boot (/actuator/health)
   * para acordar preventivamente o container do Azure Web App e aquecer o pool de conexões.
   * Possui deduplicação estrita de promessa em voo e cooldown de 10 minutos para evitar requisições redundantes.
   */
  warmup: createThrottledPing(() =>
    http.get('/actuator/health', {
      timeout: 20000,
      headers: { 'X-Warmup-Ping': 'true' },
    })
  ),
};
