import { useEffect, useState, useCallback } from 'react';
import * as Notifications from 'expo-notifications';
import { NotificationService, NotificationPayloadData, NotificationSettings, DEFAULT_NOTIFICATION_SETTINGS } from '../services/notifications';
import { navigationRef } from '../routes/navigationRef';

/**
 * Hook de domínio para gerenciamento de notificações do PetGuardian.
 * Garante o ciclo de vida dos listeners nativos, carregamento de preferências e controle global.
 */
export function useNotifications() {
  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_NOTIFICATION_SETTINGS);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);

  useEffect(() => {
    // 1. Inicializa permissões e canais nativos do Android
    NotificationService.inicializarPermissoes();

    // 2. Carrega preferências salvas no AsyncStorage
    NotificationService.getSettings()
      .then((saved) => setSettings(saved))
      .finally(() => setIsLoadingSettings(false));

    // 3. Escuta quando o usuário toca/interage com a notificação
    const responseSubscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data as unknown as NotificationPayloadData;

      if (!data) return;

      if (navigationRef.isReady()) {
        if (data.rota === 'Home' || data.tipo === 'ROTINA_LEMBRETE' || data.tipo === 'TAREFA_CONCLUIDA') {
          // Navega para a aba Home ou passa parâmetros do pet se disponível
          try {
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

  const salvarSettings = useCallback(async (novasSettings: NotificationSettings) => {
    setSettings(novasSettings);
    await NotificationService.saveSettings(novasSettings);
  }, []);

  return {
    settings,
    isLoadingSettings,
    salvarSettings,
  };
}
