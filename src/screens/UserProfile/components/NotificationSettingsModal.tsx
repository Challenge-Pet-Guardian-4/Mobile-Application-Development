import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ActivityIndicator, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BaseModal } from '../../../components/BaseModal';
import { OPCOES_ANTECEDENCIA, DEFAULT_NOTIFICATION_SETTINGS } from '../../../services/notifications';
import { NotificationSettings, AntecedenciaMinutos } from '../../../types/notification';
import { useNotifications } from '../../../hooks/useNotifications';
import { AppTheme, borderRadius, spacing } from '../../../constants/theme';
import { useTheme, useThemedStyles } from '../../../contexts/ThemeContext';

interface NotificationSettingsModalProps {
  visible: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export function NotificationSettingsModal({
  visible,
  onClose,
  onSaved,
}: NotificationSettingsModalProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { settings, salvarSettings, isLoadingSettings, permissaoConcedida, solicitarPermissao, recarregarPermissoes } = useNotifications();
  const [localSettings, setLocalSettings] = useState<NotificationSettings>(DEFAULT_NOTIFICATION_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      recarregarPermissoes();
    }
  }, [visible, recarregarPermissoes]);

  useEffect(() => {
    if (visible) {
      setLocalSettings(settings);
    }
  }, [visible, settings]);

  const handleToggleAtivado = async (novoValor: boolean) => {
    if (novoValor && !permissaoConcedida) {
      const perm = await solicitarPermissao();
      if (!perm.concedida) {
        if (!perm.canAskAgain) {
          Alert.alert(
            'Notificações Bloqueadas',
            'A permissão de notificações está desativada no seu aparelho. Para receber lembretes de rotinas dos pets, ative as notificações nas configurações do sistema.',
            [
              { text: 'Cancelar', style: 'cancel' },
              { text: 'Abrir Configurações', onPress: () => Linking.openSettings() },
            ]
          );
        } else {
          Alert.alert('Permissão Necessária', 'É preciso autorizar as notificações para ativar os lembretes.');
        }
        setLocalSettings((prev) => ({ ...prev, ativado: false }));
        return;
      }
    }
    setLocalSettings((prev) => ({ ...prev, ativado: novoValor }));
  };

  const handleSelecionarAntecedencia = (minutos: AntecedenciaMinutos) => {
    setLocalSettings((prev) => ({ ...prev, minutosAntecedencia: minutos }));
  };

  const handleSalvar = async () => {
    setIsSaving(true);
    try {
      if (localSettings.ativado && !permissaoConcedida) {
        const perm = await solicitarPermissao();
        if (!perm.concedida) {
          Alert.alert('Permissão Necessária', 'Não foi possível ativar os lembretes sem permissão do sistema.');
          return;
        }
      }
      await salvarSettings(localSettings);
      onSaved?.();
      onClose();
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar as preferências.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <BaseModal
      visible={visible}
      onClose={onClose}
      title="Lembretes & Notificações"
      subtitle="Configure quando receber alertas de cuidados e tarefas"
      size="md"
      footer={
        !isLoadingSettings ? (
          <View style={styles.footerRow}>
            <TouchableOpacity
              style={styles.btnCancelar}
              onPress={onClose}
              disabled={isSaving}
              activeOpacity={0.7}
            >
              <Text style={styles.btnCancelarText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btnSalvar, isSaving && styles.btnDisabled]}
              onPress={handleSalvar}
              disabled={isSaving}
              activeOpacity={0.8}
            >
              {isSaving ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.btnSalvarText}>Salvar Preferências</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : null
      }
    >
      {isLoadingSettings ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={theme.primary} />
          <Text style={styles.loadingText}>Carregando preferências...</Text>
        </View>
      ) : (
        <View style={styles.content}>
          {/* Banner de Aviso caso o sistema tenha negado permissão */}
          {!permissaoConcedida ? (
            <View style={styles.permissionWarningBox}>
              <Ionicons name="warning-outline" size={20} color="#D97706" />
              <View style={{ flex: 1 }}>
                <Text style={styles.permissionWarningTitle}>Notificações Desativadas no Celular</Text>
                <Text style={styles.permissionWarningText}>
                  A permissão nativa foi negada nas configurações do sistema. Para receber lembretes, habilite as notificações do PetGuardian.
                </Text>
                <TouchableOpacity
                  style={styles.btnOpenSettings}
                  onPress={() => Linking.openSettings()}
                  activeOpacity={0.8}
                >
                  <Ionicons name="settings-outline" size={14} color="#D97706" />
                  <Text style={styles.btnOpenSettingsText}>Abrir Configurações do Celular</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}

          {/* Toggle Principal de Ativação */}
          <View style={styles.toggleCard}>
            <View style={styles.toggleIconWrap}>
              <Ionicons
                name={localSettings.ativado ? 'notifications' : 'notifications-off-outline'}
                size={22}
                color={localSettings.ativado ? theme.primary : theme.textMuted}
              />
            </View>
            <View style={styles.toggleTextCol}>
              <Text style={styles.toggleTitle}>Lembretes de Tarefas</Text>
              <Text style={styles.toggleDesc}>
                {localSettings.ativado
                  ? 'Ativo: avisos serão agendados antes do prazo'
                  : 'Desativado: nenhum alerta será disparado'}
              </Text>
            </View>
            <Switch
              value={localSettings.ativado}
              onValueChange={handleToggleAtivado}
              trackColor={{ false: theme.border, true: theme.badgePrimaryBorder }}
              thumbColor={localSettings.ativado ? theme.primary : theme.textMuted}
            />
          </View>

          {/* Seleção de Antecedência */}
          {localSettings.ativado ? (
            <View style={styles.sectionAntecedencia}>
              <View style={styles.sectionHeader}>
                <Ionicons name="time-outline" size={16} color={theme.textSecondary} />
                <Text style={styles.sectionTitle}>Momento do Alerta</Text>
              </View>
              <Text style={styles.sectionSubtitle}>
                Escolha a antecedência desejada para ser notificado:
              </Text>

              <View style={styles.optionsList}>
                {OPCOES_ANTECEDENCIA.map((opcao) => {
                  const isSelected = localSettings.minutosAntecedencia === opcao.valor;
                  return (
                    <TouchableOpacity
                      key={opcao.valor}
                      style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                      onPress={() => handleSelecionarAntecedencia(opcao.valor as AntecedenciaMinutos)}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                        size={20}
                        color={isSelected ? theme.primary : theme.textMuted}
                      />
                      <View style={styles.optionTextCol}>
                        <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                          {opcao.rotulo}
                        </Text>
                        <Text style={styles.optionDesc}>{opcao.descricao}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ) : null}
        </View>
      )}
    </BaseModal>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    loadingContainer: {
      padding: spacing.xxxl,
      alignItems: 'center',
      gap: spacing.sm,
    },
    loadingText: {
      fontSize: 13,
      color: theme.textSecondary,
    },
    content: {
      gap: spacing.lg,
      paddingTop: spacing.xs,
    },
    permissionWarningBox: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      backgroundColor: theme.isDark ? '#422006' : '#FEF3C7',
      borderRadius: borderRadius.md,
      padding: 12,
      borderWidth: 1,
      borderColor: theme.isDark ? '#78350F' : '#FCD34D',
      gap: 10,
    },
    permissionWarningTitle: {
      fontSize: 13,
      fontWeight: '700',
      color: theme.isDark ? '#FDE68A' : '#92400E',
      marginBottom: 2,
    },
    permissionWarningText: {
      fontSize: 12,
      color: theme.isDark ? '#FCD34D' : '#B45309',
      lineHeight: 16,
      marginBottom: 8,
    },
    btnOpenSettings: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: theme.isDark ? '#78350F' : '#FDE68A',
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: borderRadius.sm,
      alignSelf: 'flex-start',
    },
    btnOpenSettingsText: {
      fontSize: 11,
      fontWeight: '700',
      color: theme.isDark ? '#FEF3C7' : '#92400E',
    },
    toggleCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surfaceSubtle,
      borderRadius: borderRadius.lg,
      padding: 14,
      borderWidth: 1,
      borderColor: theme.border,
      gap: spacing.md,
    },
    toggleIconWrap: {
      width: 40,
      height: 40,
      borderRadius: borderRadius.md,
      backgroundColor: theme.badgePrimaryBg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    toggleTextCol: {
      flex: 1,
      gap: 2,
    },
    toggleTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.text,
    },
    toggleDesc: {
      fontSize: 12,
      color: theme.textSecondary,
      lineHeight: 16,
    },
    sectionAntecedencia: {
      gap: spacing.sm,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    sectionTitle: {
      fontSize: 13,
      fontWeight: '800',
      color: theme.text,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    sectionSubtitle: {
      fontSize: 12,
      color: theme.textSecondary,
      marginBottom: spacing.xs,
    },
    optionsList: {
      gap: spacing.sm,
    },
    optionCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.card,
      borderRadius: borderRadius.md,
      paddingVertical: 10,
      paddingHorizontal: spacing.md,
      borderWidth: 1,
      borderColor: theme.border,
      gap: 10,
    },
    optionCardSelected: {
      backgroundColor: theme.badgePrimaryBg,
      borderColor: theme.badgePrimaryBorder,
    },
    optionTextCol: {
      flex: 1,
    },
    optionLabel: {
      fontSize: 13,
      fontWeight: '700',
      color: theme.text,
    },
    optionLabelSelected: {
      color: theme.badgePrimaryText,
    },
    optionDesc: {
      fontSize: 11,
      color: theme.textSecondary,
      marginTop: 1,
    },
    footerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      marginTop: spacing.sm,
    },
    btnCancelar: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: borderRadius.md,
      backgroundColor: theme.surfaceMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    btnCancelarText: {
      fontSize: 13,
      fontWeight: '700',
      color: theme.textSecondary,
    },
    btnSalvar: {
      flex: 2,
      paddingVertical: 12,
      borderRadius: borderRadius.md,
      backgroundColor: theme.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    btnDisabled: {
      opacity: 0.6,
    },
    btnSalvarText: {
      fontSize: 13,
      fontWeight: '700',
      color: '#FFFFFF',
    },
  });
