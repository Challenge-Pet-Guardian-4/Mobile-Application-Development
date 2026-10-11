import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * PetGuardian - Serviço de Notificações Locais e Gerenciamento de Lembretes de Tarefas
 */

const CHANNEL_ID = 'petguardian-lembretes';
const SETTINGS_STORAGE_KEY = '@petguardian:notification_settings';

// Configura o comportamento global de exibição quando a notificação chega em primeiro plano
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

export type AntecedenciaMinutos = 0 | 5 | 15 | 30 | 60;

export interface NotificationSettings {
  ativado: boolean;
  minutosAntecedencia: AntecedenciaMinutos;
}

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  ativado: true,
  minutosAntecedencia: 15,
};

export const OPCOES_ANTECEDENCIA: { valor: AntecedenciaMinutos; rotulo: string; descricao: string }[] = [
  { valor: 0, rotulo: 'No horário', descricao: 'Exatamente no horário de vencimento' },
  { valor: 5, rotulo: '5 min antes', descricao: 'Aviso rápido antes de vencer' },
  { valor: 15, rotulo: '15 min antes', descricao: 'Recomendado para alimentação e cuidados' },
  { valor: 30, rotulo: '30 min antes', descricao: 'Ideal para passeios e medicações' },
  { valor: 60, rotulo: '1 hora antes', descricao: 'Aviso com ampla antecedência' },
];

export interface NotificationPayloadData {
  tipo: 'ROTINA_LEMBRETE' | 'TAREFA_CONCLUIDA' | 'PET_SCORE_UP';
  tarefaId?: number;
  petId?: number;
  rota?: string;
}

function getTaskNotificationIdentifier(tarefaId: number): string {
  return `task_${tarefaId}`;
}

export const NotificationService = {
  /**
   * Obtém as configurações globais de notificação do usuário.
   */
  async getSettings(): Promise<NotificationSettings> {
    try {
      const raw = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
      if (!raw) return DEFAULT_NOTIFICATION_SETTINGS;
      const parsed = JSON.parse(raw) as Partial<NotificationSettings>;
      return {
        ativado: typeof parsed.ativado === 'boolean' ? parsed.ativado : DEFAULT_NOTIFICATION_SETTINGS.ativado,
        minutosAntecedencia:
          typeof parsed.minutosAntecedencia === 'number'
            ? (parsed.minutosAntecedencia as AntecedenciaMinutos)
            : DEFAULT_NOTIFICATION_SETTINGS.minutosAntecedencia,
      };
    } catch {
      return DEFAULT_NOTIFICATION_SETTINGS;
    }
  },

  /**
   * Salva as configurações globais de notificação.
   */
  async saveSettings(settings: NotificationSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.warn('Erro ao salvar preferências de notificação:', error);
    }
  },

  /**
   * Solicita permissão do usuário e configura o canal de alta prioridade no Android.
   */
  async inicializarPermissoes(): Promise<boolean> {
    try {
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
   * Agenda notificação para uma tarefa pendente baseada em sua data de prazo e na antecedência global configurada.
   * Não agenda se a tarefa já estiver concluída, expirada ou se o alarme já tiver passado.
   */
  async agendarNotificacaoTarefa(params: {
    tarefaId: number;
    titulo: string;
    nomePet: string;
    petId: number;
    prazoIso?: string;
    pontos?: number;
    status?: string;
  }): Promise<string | null> {
    try {
      const { tarefaId, titulo, nomePet, petId, prazoIso, pontos = 10, status } = params;

      // Se não for pendente, cancela qualquer agendamento existente
      if (status && status !== 'PENDENTE') {
        await this.cancelarNotificacaoTarefa(tarefaId);
        return null;
      }

      const settings = await this.getSettings();
      if (!settings.ativado || !prazoIso) {
        return null;
      }

      const prazoDate = new Date(prazoIso);
      if (Number.isNaN(prazoDate.getTime())) {
        return null;
      }

      // Calcula o momento exato do disparo considerando a antecedência configurada
      const triggerTimestamp = prazoDate.getTime() - settings.minutosAntecedencia * 60 * 1000;
      const agora = Date.now();

      // Se o momento de disparo já passou, não agenda notificação retroativa
      if (triggerTimestamp <= agora) {
        return null;
      }

      const triggerSeconds = Math.max(1, Math.floor((triggerTimestamp - agora) / 1000));
      const identifier = getTaskNotificationIdentifier(tarefaId);

      const corpoMensagem =
        settings.minutosAntecedencia > 0
          ? `Lembrete para ${nomePet}! Esta rotina vence em ${settings.minutosAntecedencia} minutos (+${pontos} XP).`
          : `Lembrete para ${nomePet}! Hora de realizar esta rotina agora (+${pontos} XP).`;

      await Notifications.scheduleNotificationAsync({
        identifier,
        content: {
          title: `🐾 Lembrete: ${titulo}`,
          body: corpoMensagem,
          sound: true,
          data: {
            tipo: 'ROTINA_LEMBRETE',
            tarefaId,
            petId,
            rota: 'Home',
          } satisfies NotificationPayloadData,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: triggerSeconds,
        },
      });

      return identifier;
    } catch (error) {
      console.warn('Erro ao agendar notificação de tarefa:', error);
      return null;
    }
  },

  /**
   * Cancela a notificação agendada de uma tarefa (ex: quando concluída ou excluída).
   */
  async cancelarNotificacaoTarefa(tarefaId: number): Promise<void> {
    try {
      const identifier = getTaskNotificationIdentifier(tarefaId);
      await Notifications.cancelScheduledNotificationAsync(identifier);
    } catch (error) {
      console.warn('Erro ao cancelar notificação da tarefa:', error);
    }
  },

  /**
   * Sincroniza em lote as notificações das tarefas do usuário:
   * - Cancela as tarefas concluídas/expiradas
   * - Agenda as tarefas pendentes futuras
   */
  async sincronizarTarefas(
    tarefas: { id: number; titulo: string; prazo: string; status: string; petId: number; pontosTarefa?: number }[],
    pets: { id: number; nome: string }[]
  ): Promise<void> {
    try {
      const settings = await this.getSettings();

      if (!settings.ativado) {
        // Se as notificações foram desativadas globalmente, limpa agendamentos de tarefas
        await Promise.all(tarefas.map((t) => this.cancelarNotificacaoTarefa(t.id)));
        return;
      }

      const petMap = new Map<number, string>(pets.map((p) => [p.id, p.nome]));

      await Promise.all(
        tarefas.map(async (tarefa) => {
          if (tarefa.status !== 'PENDENTE') {
            await this.cancelarNotificacaoTarefa(tarefa.id);
          } else {
            const nomePet = petMap.get(tarefa.petId) || 'seu pet';
            await this.agendarNotificacaoTarefa({
              tarefaId: tarefa.id,
              titulo: tarefa.titulo,
              nomePet,
              petId: tarefa.petId,
              prazoIso: tarefa.prazo,
              pontos: tarefa.pontosTarefa,
              status: tarefa.status,
            });
          }
        })
      );
    } catch (error) {
      console.warn('Erro ao sincronizar notificações de tarefas:', error);
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
        trigger: null, // Disparo imediato em tempo real
      });

      return id;
    } catch (error) {
      console.warn('Erro ao disparar notificação de conclusão:', error);
      return null;
    }
  },

  /**
   * Cancela uma notificação agendada específica.
   */
  async cancelarNotificacao(notificacaoId: string): Promise<void> {
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
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.warn('Erro ao cancelar todas notificações:', error);
    }
  },
};
