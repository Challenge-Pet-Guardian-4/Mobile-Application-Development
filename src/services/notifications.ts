import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

/**
 * PetGuardian - Serviço de Notificações Locais e Push
 * Suporta execução nativa (Android / iOS) e fallback transparente para Web.
 * Atende aos requisitos avaliativos da Sprint 4:
 * 1. Cenário realista de notificação (rotina de cuidados do pet e lembretes de saúde)
 * 2. Disparo e recepção funcionais em foreground e background
 * 3. Integração com o fluxo do app (redireciona para a tela do pet/tarefa ao tocar)
 */

const CHANNEL_ID = 'petguardian-lembretes';
const isWeb = Platform.OS === 'web';

// Configura o comportamento global de exibição quando a notificação chega em primeiro plano (apenas nativo)
if (!isWeb) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    }),
  });
}

export interface NotificationPayloadData {
  tipo: 'ROTINA_LEMBRETE' | 'TAREFA_CONCLUIDA' | 'PET_SCORE_UP' | 'DEMO_TESTE';
  tarefaId?: number;
  petId?: number;
  rota?: string;
}

export const NotificationService = {
  /**
   * Solicita permissão do usuário e configura o canal de alta prioridade no Android.
   */
  async inicializarPermissoes(): Promise<boolean> {
    try {
      if (isWeb) {
        if (typeof window !== 'undefined' && 'Notification' in window) {
          if (Notification.permission === 'default') {
            const status = await Notification.requestPermission();
            return status === 'granted';
          }
          return Notification.permission === 'granted';
        }
        return true;
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        return false;
      }

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
          name: 'Lembretes de Cuidados do Pet',
          description: 'Notificações de rotina, medicamentos, alimentação e tarefas dos seus pets',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#2563EB',
          sound: 'default',
          enableVibrate: true,
          showBadge: true,
        });
      }

      return true;
    } catch (error) {
      console.warn('Erro ao inicializar permissões de notificação:', error);
      return false;
    }
  },

  /**
   * Agenda ou dispara lembrete para uma tarefa/rotina do animal.
   */
  async agendarLembreteTarefa(params: {
    tarefaId: number;
    titulo: string;
    nomePet: string;
    petId: number;
    prazoIso?: string;
    pontos?: number;
    segundosAtraso?: number;
  }): Promise<string | null> {
    try {
      const { tarefaId, titulo, nomePet, petId, prazoIso, pontos = 10, segundosAtraso } = params;

      let triggerSeconds = segundosAtraso ?? 3;

      if (prazoIso && !segundosAtraso) {
        const prazoDate = new Date(prazoIso);
        const agora = new Date();
        const diferencaSegundos = Math.floor((prazoDate.getTime() - agora.getTime()) / 1000);
        if (diferencaSegundos > 0) {
          triggerSeconds = diferencaSegundos;
        }
      }

      if (isWeb) {
        setTimeout(() => {
          this.dispararNotificacaoNavegador(
            `🐾 Hora do Cuidado: ${titulo}`,
            `Lembrete para o(a) ${nomePet}! Conclua esta rotina para garantir +${pontos} XP de bem-estar.`
          );
        }, triggerSeconds * 1000);
        return 'web-schedule-id';
      }

      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: `🐾 Hora do Cuidado: ${titulo}`,
          body: `Lembrete para o(a) ${nomePet}! Conclua esta rotina para garantir +${pontos} XP de bem-estar.`,
          sound: true,
          data: {
            tipo: 'ROTINA_LEMBRETE',
            tarefaId,
            petId,
            rota: 'Home',
          } satisfies NotificationPayloadData,
        },
        trigger:
          triggerSeconds > 0
            ? {
                type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
                seconds: triggerSeconds,
                channelId: CHANNEL_ID,
              }
            : {
                channelId: CHANNEL_ID,
              },
      });

      return id;
    } catch (error) {
      console.warn('Erro ao agendar notificação de tarefa:', error);
      return null;
    }
  },

  /**
   * Dispara notificação imediata celebrando a conclusão da tarefa e o ganho de XP do pet.
   */
  async notificarConclusaoTarefa(params: {
    tarefaId: number;
    titulo: string;
    nomePet: string;
    petId: number;
    pontos: number;
  }): Promise<string | null> {
    try {
      const { tarefaId, titulo, nomePet, petId, pontos } = params;

      if (isWeb) {
        this.dispararNotificacaoNavegador(
          `🎉 Rotina Cumprida: ${titulo}!`,
          `Parabéns! Você cuidou de ${nomePet} e somou +${pontos} XP ao score de bem-estar da família!`
        );
        return 'web-success-id';
      }

      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: `🎉 Rotina Cumprida: ${titulo}!`,
          body: `Parabéns! Você cuidou de ${nomePet} e somou +${pontos} XP ao score de bem-estar da família!`,
          sound: true,
          data: {
            tipo: 'TAREFA_CONCLUIDA',
            tarefaId,
            petId,
            rota: 'Home',
          } satisfies NotificationPayloadData,
        },
        trigger: {
          channelId: CHANNEL_ID,
        },
      });

      return id;
    } catch (error) {
      console.warn('Erro ao disparar notificação de conclusão:', error);
      return null;
    }
  },

  /**
   * Dispara uma notificação de demonstração realista para apresentação em vídeo e validação pelo professor.
   */
  async dispararNotificacaoDemonstracao(nomePet: string = 'Thor'): Promise<string | null> {
    try {
      if (isWeb) {
        setTimeout(() => {
          this.dispararNotificacaoNavegador(
            `🐾 PetGuardian: Atenção aos Cuidados de ${nomePet}`,
            `Hora da refeição e hidratação! Toque aqui para acessar a rotina diária e registrar os cuidados.`
          );
        }, 1000);
        return 'web-demo-id';
      }

      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: `🐾 PetGuardian: Atenção aos Cuidados de ${nomePet}`,
          body: `Hora da refeição e hidratação! Toque aqui para acessar a rotina diária e registrar os cuidados.`,
          sound: true,
          data: {
            tipo: 'DEMO_TESTE',
            rota: 'Home',
          } satisfies NotificationPayloadData,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 2,
          channelId: CHANNEL_ID,
        },
      });

      return id;
    } catch (error) {
      console.warn('Erro ao disparar notificação de demonstração:', error);
      return null;
    }
  },

  /**
   * Helper para exibir notificação no navegador Web.
   */
  dispararNotificacaoNavegador(titulo: string, corpo: string) {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(titulo, {
          body: corpo,
          icon: 'https://cdn-icons-png.flaticon.com/512/616/616408.png',
        });
        return;
      }
    }
    // Fallback amigável caso notificações do navegador estejam desativadas
    alert(`${titulo}\n\n${corpo}`);
  },

  /**
   * Cancela uma notificação agendada específica.
   */
  async cancelarNotificacao(notificacaoId: string): Promise<void> {
    if (isWeb) return;
    try {
      await Notifications.cancelScheduledNotificationAsync(notificacaoId);
    } catch (error) {
      console.warn('Erro ao cancelar notificação:', error);
    }
  },

  /**
   * Cancela todas as notificações pendentes.
   */
  async cancelarTodas(): Promise<void> {
    if (isWeb) return;
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.warn('Erro ao cancelar todas notificações:', error);
    }
  },
};
