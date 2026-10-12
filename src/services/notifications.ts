import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AntecedenciaMinutos, NotificationSettings, NotificationPayloadData, OpcaoAntecedencia, PermissaoNativaStatus, PermissaoNativaResponse, AgendarNotificacaoTarefaParams } from '../types/notification';
import type { TarefaResponse } from '../types/task';
import type { PetOption, PetResponse } from '../types/pet';

/**
 * PetGuardian - Serviço de Notificações Locais e Gerenciamento de Lembretes de Tarefas
 */

const CHANNEL_ID = 'petguardian-lembretes';
const SETTINGS_STORAGE_KEY = '@petguardian:notification_settings';

// Configura o comportamento global de exibição quando a notificação chega em primeiro plano
Notifications.setNotificationHandler({
  handleNotification: async () => ({
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
  async verificarPermissaoNativa(): Promise<PermissaoNativaStatus> {
    try {
      const response = (await Notifications.getPermissionsAsync()) as PermissaoNativaResponse;
      const concedida = Boolean(response.granted || response.status === 'granted');
      return {
        concedida,
        canAskAgain: Boolean(response.canAskAgain),
      };
    } catch (e) {
      console.warn('Erro ao verificar permissão nativa de notificação:', e);
      return { concedida: false, canAskAgain: true };
    }
  },

  /**
   * Solicita permissão de notificação diretamente ao sistema operacional.
   */
  async solicitarPermissaoNativa(): Promise<PermissaoNativaStatus> {
    try {
      if (Platform.OS === 'android') {
        await this.configurarCanalAndroid();
      }
      const response = (await Notifications.requestPermissionsAsync()) as PermissaoNativaResponse;
      const concedida = Boolean(response.granted || response.status === 'granted');
      return {
        concedida,
        canAskAgain: Boolean(response.canAskAgain),
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
   * Obtém as configurações globais de notificação salvas no dispositivo.
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
   * Inicializa o canal nativo no Android no startup e verifica permissão.
   */
  async inicializarPermissoes(): Promise<boolean> {
    try {
      if (Platform.OS === 'android') {
        await this.configurarCanalAndroid();
      }
      const { concedida } = await this.verificarPermissaoNativa();
      return concedida;
    } catch (error) {
      console.warn('Erro ao inicializar permissões de notificação:', error);
      return false;
    }
  },

  /**
   * Agenda notificação para uma tarefa pendente baseada em sua data de prazo e na antecedência global configurada.
   * Não agenda se a tarefa já estiver concluída, expirada ou se o alarme já tiver passado.
   */
  async agendarNotificacaoTarefa(
    params: AgendarNotificacaoTarefaParams,
    settingsOverride?: NotificationSettings
  ): Promise<string | null> {
    try {
      const { tarefaId, titulo, nomePet, petId, prazoIso, pontos = 10, status } = params;

      // Se não for pendente, cancela qualquer agendamento existente
      if (status && status !== 'PENDENTE') {
        await this.cancelarNotificacaoTarefa(tarefaId);
        return null;
      }

      const settings = settingsOverride || (await this.getSettings());
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

      // Se o momento de disparo já passou ou é iminente (margem de 3s), não agenda para evitar erro nativo
      if (triggerTimestamp <= agora + 3000) {
        return null;
      }

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
            rota: 'Family',
          } satisfies NotificationPayloadData,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: triggerTimestamp,
          channelId: CHANNEL_ID,
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
   * Cancela todas as notificações de tarefas agendadas no aparelho (task_*).
   */
  async cancelarTodasNotificacoesTarefas(): Promise<void> {
    try {
      const agendadas = await Notifications.getAllScheduledNotificationsAsync();
      const taskNotifications = agendadas.filter((n) => n.identifier.startsWith('task_'));
      await Promise.all(
        taskNotifications.map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier))
      );
    } catch (error) {
      console.warn('Erro ao cancelar todas as notificações de tarefas:', error);
    }
  },

  /**
   * Cancela todas as notificações agendadas vinculadas a um pet específico.
   * Utilizado quando o cuidador sai do Care Circle do animal ou exclui o pet.
   */
  async cancelarNotificacoesPorPet(petId: number): Promise<void> {
    try {
      const agendadas = await Notifications.getAllScheduledNotificationsAsync();
      const petNotifications = agendadas.filter((n) => {
        const data = n.content.data as NotificationPayloadData | undefined;
        return data?.petId === petId;
      });
      await Promise.all(
        petNotifications.map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier))
      );
    } catch (error) {
      console.warn(`Erro ao cancelar notificações do pet ${petId}:`, error);
    }
  },

  /**
   * Sincroniza em lote as notificações das tarefas do usuário:
   * - Se desativado: cancela todos os alarmes de tarefas
   * - Filtra tarefas pendentes com prazo futuro
   * - Ordena as mais próximas primeiro e limita a ~60 (limite do iOS)
   * - Remove alarmes órfãos no dispositivo via getAllScheduledNotificationsAsync
   * - Agenda os novos alarmes com a antecedência configurada
   */
  async sincronizarTarefas(
    tarefas: TarefaResponse[],
    pets: (PetOption | PetResponse)[]
  ): Promise<void> {
    try {
      const settings = await this.getSettings();
      const { concedida } = await this.verificarPermissaoNativa();

      if (!settings.ativado || !concedida) {
        await this.cancelarTodasNotificacoesTarefas();
        return;
      }

      const agora = Date.now();
      const offsetMs = settings.minutosAntecedencia * 60 * 1000;

      // 1. Filtra tarefas pendentes cujo alarme ainda está no futuro
      const pendentesFuturas = tarefas.filter((t) => {
        if (t.status !== 'PENDENTE' || !t.prazo) return false;
        const prazoMs = new Date(t.prazo).getTime();
        return !Number.isNaN(prazoMs) && prazoMs - offsetMs > agora;
      });

      // 2. Ordena pelas mais próximas primeiro
      pendentesFuturas.sort((a, b) => new Date(a.prazo).getTime() - new Date(b.prazo).getTime());

      // 3. Limita a ~60 agendamentos (limite de 64 no iOS)
      const tarefasParaAgendar = pendentesFuturas.slice(0, 60);
      const identifiersValidos = new Set(tarefasParaAgendar.map((t) => getTaskNotificationIdentifier(t.id)));

      // 4. Cancela alarmes task_* órfãos que não estão na lista válida
      const agendadas = await Notifications.getAllScheduledNotificationsAsync();
      const orfas = agendadas.filter(
        (n) => n.identifier.startsWith('task_') && !identifiersValidos.has(n.identifier)
      );
      await Promise.all(
        orfas.map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier))
      );

      // 5. Agenda as tarefas válidas passando as settings em memória
      const petMap = new Map<number, string>(pets.map((p) => [p.id, p.nome]));
      await Promise.all(
        tarefasParaAgendar.map((tarefa) => {
          const nomePet = petMap.get(tarefa.petId) || 'seu pet';
          return this.agendarNotificacaoTarefa(
            {
              tarefaId: tarefa.id,
              titulo: tarefa.titulo,
              nomePet,
              petId: tarefa.petId,
              prazoIso: tarefa.prazo,
              pontos: tarefa.pontosTarefa,
              status: tarefa.status,
            },
            settings
          );
        })
      );
    } catch (error) {
      console.warn('Erro ao sincronizar notificações de tarefas:', error);
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
};
