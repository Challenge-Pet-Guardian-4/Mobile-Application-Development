import { useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { NotificationService, NotificationPayloadData } from '../services/notifications';
import { navigationRef } from '../routes/navigationRef';

/**
 * Hook de domínio para gerenciamento de notificações do PetGuardian.
 * Garante o ciclo de vida dos listeners nativos e o redirecionamento ao interagir com a notificação.
 */
export function useNotifications() {
  useEffect(() => {
    // 1. Inicializa permissões e canais nativos do Android
    NotificationService.inicializarPermissoes();

    if (Platform.OS === 'web') return;

    // 2. Escuta quando o usuário toca/interage com a notificação
    const responseSubscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data as unknown as NotificationPayloadData;

      if (!data) return;

      if (navigationRef.isReady()) {
        if (data.rota === 'Home' || data.tipo === 'ROTINA_LEMBRETE' || data.tipo === 'TAREFA_CONCLUIDA') {
          // Navega para a aba Home ou passa parâmetros do pet se disponível
          try {
            // @ts-expect-error - Tratamento polimórfico de navegação por tabs
            navigationRef.navigate('Tabs', { screen: 'Home' });
          } catch (e) {
            console.warn('Erro ao redirecionar via notificação:', e);
          }
        }
      }
    });

    return () => {
      responseSubscription.remove();
    };
  }, []);

  const agendarLembrete = useCallback(
    async (params: {
      tarefaId: number;
      titulo: string;
      nomePet: string;
      petId: number;
      prazoIso?: string;
      pontos?: number;
      segundosAtraso?: number;
    }) => {
      return await NotificationService.agendarLembreteTarefa(params);
    },
    []
  );

  const notificarConclusao = useCallback(
    async (params: {
      tarefaId: number;
      titulo: string;
      nomePet: string;
      petId: number;
      pontos: number;
    }) => {
      return await NotificationService.notificarConclusaoTarefa(params);
    },
    []
  );

  const testarNotificacao = useCallback(async (nomePet: string = 'Thor') => {
    return await NotificationService.dispararNotificacaoDemonstracao(nomePet);
  }, []);

  return {
    agendarLembrete,
    notificarConclusao,
    testarNotificacao,
  };
}
