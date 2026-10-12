import { useEffect, useState, useCallback } from 'react';
import { NotificationService, DEFAULT_NOTIFICATION_SETTINGS } from '../services/notifications';
import { NotificationSettings } from '../types/notification';
import { TaskService } from '../services/tasks';
import { PetService } from '../services/pets';

/**
 * Hook de domínio para gerenciamento de preferências de notificações do PetGuardian.
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
  }, [carregarEstado]);

  const solicitarPermissao = useCallback(async () => {
    const perm = await NotificationService.solicitarPermissaoNativa();
    setPermissaoConcedida(perm.concedida);
    setCanAskAgain(perm.canAskAgain);
    return perm;
  }, []);

  const salvarSettings = useCallback(
    async (novasSettings: NotificationSettings) => {
      setSettings(novasSettings);
      await NotificationService.saveSettings(novasSettings);

      if (!novasSettings.ativado) {
        await NotificationService.cancelarTodasNotificacoesTarefas();
      } else {
        try {
          const [tarefas, petsPage] = await Promise.all([
            TaskService.getTodasTarefasPendentes(),
            PetService.getMyPets(0, 100),
          ]);
          await NotificationService.sincronizarTarefas(tarefas, petsPage.content || []);
        } catch (e) {
          console.warn('Erro ao ressincronizar tarefas com novas configurações:', e);
        }
      }
    },
    []
  );

  return {
    settings,
    permissaoConcedida,
    canAskAgain,
    isLoadingSettings,
    recarregar: carregarEstado,
    recarregarPermissoes: carregarEstado,
    solicitarPermissao,
    salvarSettings,
  };
}
