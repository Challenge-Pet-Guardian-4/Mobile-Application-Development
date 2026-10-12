import { useEffect, useCallback, useRef } from 'react';
import { AppState } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useSession } from './useSession';
import { navigationRef } from '../routes/navigationRef';
import { NotificationService } from '../services/notifications';
import { TaskService } from '../services/tasks';
import { PetService } from '../services/pets';
import { NotificationPayloadData } from '../types/notification';

/**
 * Hook de domínio para gerenciamento do ciclo de vida das notificações:
 * 1. Sincronização de alarmes de tarefas ao autenticar e ao retornar do background (AppState active).
 * 2. Deep linking ao tocar na notificação (cold start e tempo de execução).
 */
export function useNotificationSync() {
  const { isAuthenticated } = useSession();
  const pendingResponseRef = useRef<Notifications.NotificationResponse | null>(null);

  // Sincronização centralizada de todas as tarefas pendentes através de todas as páginas da API
  const sincronizarAlarmes = useCallback(async () => {
    try {
      const [tarefas, petsPage] = await Promise.all([
        TaskService.getTodasTarefasPendentes(),
        PetService.getMyPets(0, 100),
      ]);
      await NotificationService.sincronizarTarefas(tarefas, petsPage.content || []);
    } catch (e) {
      console.warn('Erro ao sincronizar tarefas no app:', e);
    }
  }, []);

  // Trata interação ao tocar na notificação e navega para a tela apropriada
  const processarRespostaNotificacao = useCallback((response: Notifications.NotificationResponse) => {
    const data = response.notification.request.content.data as NotificationPayloadData | undefined;
    if (!data) return;

    if (!navigationRef.isReady()) {
      pendingResponseRef.current = response;
      return;
    }

    pendingResponseRef.current = null;

    // Se for notificação direcionada explicitamente para a ficha médica do pet
    if (data.rota === 'PetDetail' && data.petId) {
      try {
        navigationRef.navigate('Tabs', {
          screen: 'Family',
          params: {
            screen: 'PetDetail',
            params: { petId: data.petId },
          },
        });
        return;
      } catch (e) {
        console.warn('Erro ao navegar para PetDetail via notificação:', e);
      }
    }

    // Se for notificação de rotina/tarefa da família, navega diretamente para FamilyPet
    try {
      navigationRef.navigate('Tabs', { screen: 'Family' });
    } catch (e) {
      console.warn('Erro ao redirecionar via notificação:', e);
    }
  }, []);

  const onNavigationReady = useCallback(() => {
    if (pendingResponseRef.current) {
      const pending = pendingResponseRef.current;
      pendingResponseRef.current = null;
      processarRespostaNotificacao(pending);
    } else {
      const lastResponse = Notifications.getLastNotificationResponse();
      if (lastResponse) {
        processarRespostaNotificacao(lastResponse);
      }
    }
  }, [processarRespostaNotificacao]);

  // Listener único de toque em notificação e tratamento de cold start
  useEffect(() => {
    if (!isAuthenticated) return;

    const lastResponse = Notifications.getLastNotificationResponse();
    if (lastResponse) {
      processarRespostaNotificacao(lastResponse);
    }

    const subscription = Notifications.addNotificationResponseReceivedListener(processarRespostaNotificacao);

    return () => {
      subscription.remove();
    };
  }, [isAuthenticated, processarRespostaNotificacao]);

  // Sincroniza alarmes ao logar/iniciar e ao voltar para primeiro plano (AppState)
  useEffect(() => {
    if (!isAuthenticated) return;

    sincronizarAlarmes();

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        sincronizarAlarmes();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [isAuthenticated, sincronizarAlarmes]);

  return { onNavigationReady, sincronizarAlarmes };
}
