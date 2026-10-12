import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BaseModal } from '../../../components/BaseModal';
import { OPCOES_ANTECEDENCIA } from '../../../services/notifications';
import { NotificationSettings, AntecedenciaMinutos } from '../../../types/notification';
import { useNotifications } from '../../../hooks/useNotifications';
import { AppTheme, colors, borderRadius, spacing } from '../../../constants/theme';
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
  const { settings, salvarSettings, isLoadingSettings } = useNotifications();
  const [localSettings, setLocalSettings] = useState<NotificationSettings>(settings);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      setLocalSettings(settings);
    }
  }, [visible, settings]);

  const handleSalvar = async () => {
    setIsSaving(true);
    try {
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
    >
      {isLoadingSettings ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={colors.primary[600]} />
          <Text style={styles.loadingText}>Carregando preferências...</Text>
        </View>
      ) : (
        <View style={styles.content}>
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
              onValueChange={(ativado) => setLocalSettings((prev: NotificationSettings) => ({ ...prev, ativado }))}
              trackColor={{ false: colors.neutral[300], true: colors.primary[200] }}
              thumbColor={localSettings.ativado ? theme.primary : colors.neutral[100]}
            />
          </View>

          {/* Seleção de Antecedência */}
          {localSettings.ativado && (
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
                      onPress={() =>
                        setLocalSettings((prev: NotificationSettings) => ({ ...prev, minutosAntecedencia: opcao.valor as AntecedenciaMinutos }))
                      }
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
          )}

          {/* Botões de Ação */}
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
                <ActivityIndicator size="small" color={colors.neutral.white} />
              ) : (
                <Text style={styles.btnSalvarText}>Salvar Preferências</Text>
              )}
            </TouchableOpacity>
          </View>
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
      color: colors.neutral.white,
    },
  });

