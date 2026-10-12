import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AntecedenciaMinutos, NotificationSettings, NotificationPayloadData, OpcaoAntecedencia } from '../types/notification';

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

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  ativado: false,
  minutosAntecedencia: 15,
};

export const OPCOES_ANTECEDENCIA: OpcaoAntecedencia[] = [
  { valor: 0, rotulo: 'No horário', descricao: 'Exatamente no horário de vencimento' },
  { valor: 5, rotulo: '5 min antes', descricao: 'Aviso rápido antes de vencer' },
  { valor: 15, rotulo: '15 min antes', descricao: 'Recomendado para alimentação e cuidados' },
  { valor: 30, rotulo: '30 min antes', descricao: 'Ideal para passeios e medicações' },
  { valor: 60, rotulo: '1 hora antes', descricao: 'Aviso com ampla antecedência' },
];

function getTaskNotificationIdentifier(tarefaId: number): string {
  return `task_${tarefaId}`;
}

export const NotificationService = {
  /**
   * Verifica se a permissão nativa no nível de SO está concedida.
   */
  async verificarPermissaoNativa(): Promise<{ concedida: boolean; canAskAgain: boolean }> {
    try {
      const response = await Notifications.getPermissionsAsync();
      return {
        concedida: response.granted || response.status === 'granted',
        canAskAgain: response.canAskAgain,
      };
    } catch (e) {
      console.warn('Erro ao verificar permissão nativa de notificação:', e);
      return { concedida: false, canAskAgain: true };
    }
  },

  /**
   * Solicita permissão de notificação diretamente ao sistema operacional.
   */
  async solicitarPermissaoNativa(): Promise<{ concedida: boolean; canAskAgain: boolean }> {
    try {
      const response = await Notifications.requestPermissionsAsync();
      const concedida = response.granted || response.status === 'granted';
      if (concedida && Platform.OS === 'android') {
        await this.configurarCanalAndroid();
      }
      return {
        concedida,
        canAskAgain: response.canAskAgain,
      };
    } catch (e) {
      console.warn('Erro ao solicitar permissão nativa:', e);
      return { concedida: false, canAskAgain: false };
    }
  },

  /**
   * Configura o canal de alta prioridade no Android.
   */
  async configurarCanalAndroid(): Promise<void> {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
        name: 'Lembretes de Cuidados do Pet',
        description: 'Notificações de rotina, medicamentos, alimentação e tarefas dos seus pets',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#2563EB',
        enableVibrate: true,
        showBadge: true,
      });
    }
  },

  /**
   * Obtém as configurações globais de notificação do usuário.
   * Se a permissão nativa do SO estiver negada, retorna forçadamente ativado = false.
   */
  async getSettings(): Promise<NotificationSettings> {
    try {
      const { concedida } = await this.verificarPermissaoNativa();
      if (!concedida) {
        return {
          ativado: false,
          minutosAntecedencia: DEFAULT_NOTIFICATION_SETTINGS.minutosAntecedencia,
        };
      }

      const raw = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
      if (!raw) return { ativado: true, minutosAntecedencia: DEFAULT_NOTIFICATION_SETTINGS.minutosAntecedencia };
      const parsed = JSON.parse(raw) as Partial<NotificationSettings>;
      return {
        ativado: typeof parsed.ativado === 'boolean' ? parsed.ativado : true,
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
   * Inicializa permissões no startup e configura o canal nativo no Android caso permitido.
   */
  async inicializarPermissoes(): Promise<boolean> {
    try {
      const { concedida } = await this.verificarPermissaoNativa();
      if (concedida) {
        await this.configurarCanalAndroid();
        return true;
      }
      return false;
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
   * Dispara uma notificação de demonstração imediata para testes e validação visual.
   */
  async dispararNotificacaoExemplo(): Promise<string | null> {
    try {
      const { concedida } = await this.verificarPermissaoNativa();
      if (!concedida) {
        return null;
      }

      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: '🐾 Lembrete: Hora do Passeio!',
          body: 'Lembrete do PetGuardian para seu pet! Esta rotina vence em breve (+10 XP).',
          sound: true,
          data: {
            tipo: 'ROTINA_LEMBRETE',
            tarefaId: 0,
            petId: 0,
            rota: 'Home',
          } satisfies NotificationPayloadData,
        },
        trigger: null,
      });

      return id;
    } catch (error) {
      console.warn('Erro ao disparar notificação de exemplo:', error);
      return null;
    }
  },
};
