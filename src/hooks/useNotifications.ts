import { useEffect, useState, useCallback } from 'react';
import * as Notifications from 'expo-notifications';
import { NotificationService, DEFAULT_NOTIFICATION_SETTINGS } from '../services/notifications';
import { NotificationPayloadData, NotificationSettings } from '../types/notification';
import { navigationRef } from '../routes/navigationRef';

/**
 * Hook de domínio para gerenciamento de notificações do PetGuardian.
 * Garante o ciclo de vida dos listeners nativos, carregamento de preferências e controle global.
 */
export function useNotifications() {
  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_NOTIFICATION_SETTINGS);
  const [permissaoConcedida, setPermissaoConcedida] = useState(false);
  const [canAskAgain, setCanAskAgain] = useState(true);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);

  const carregarEstado = useCallback(async () => {
    try {
      const perm = await NotificationService.verificarPermissaoNativa();
      setPermissaoConcedida(perm.concedida);
      setCanAskAgain(perm.canAskAgain);

      const saved = await NotificationService.getSettings();
      setSettings(saved);
    } finally {
      setIsLoadingSettings(false);
    }
  }, []);

  useEffect(() => {
    NotificationService.inicializarPermissoes().then(() => carregarEstado());

    // Escuta quando o usuário toca/interage com a notificação
    const responseSubscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data as unknown as NotificationPayloadData;

      if (!data) return;

      if (navigationRef.isReady()) {
        if (data.rota === 'Home' || data.tipo === 'ROTINA_LEMBRETE' || data.tipo === 'TAREFA_CONCLUIDA') {
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
  }, [carregarEstado]);

  const solicitarPermissao = useCallback(async () => {
    const perm = await NotificationService.solicitarPermissaoNativa();
    setPermissaoConcedida(perm.concedida);
    setCanAskAgain(perm.canAskAgain);
    return perm;
  }, []);

  const salvarSettings = useCallback(async (novasSettings: NotificationSettings) => {
    setSettings(novasSettings);
    await NotificationService.saveSettings(novasSettings);
  }, []);

  const testarNotificacao = useCallback(async () => {
    return await NotificationService.dispararNotificacaoExemplo();
  }, []);

  return {
    settings,
    permissaoConcedida,
    canAskAgain,
    isLoadingSettings,
    recarregarPermissoes: carregarEstado,
    solicitarPermissao,
    salvarSettings,
    testarNotificacao,
  };
}
