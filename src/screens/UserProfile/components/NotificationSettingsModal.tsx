import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BaseModal } from '../../../components/BaseModal';
import { NotificationSettings, AntecedenciaMinutos, OPCOES_ANTECEDENCIA } from '../../../services/notifications';
import { useNotifications } from '../../../hooks/useNotifications';
import { colors, borderRadius, spacing } from '../../../constants/theme';
import { useTheme } from '../../../hooks/useTheme';

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
  const { theme, isDark } = useTheme();
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

      const opcao = OPCOES_ANTECEDENCIA.find((o) => o.valor === localSettings.minutosAntecedencia);
      const rotulo = opcao ? opcao.rotulo.toLowerCase() : `${localSettings.minutosAntecedencia} min antes`;

      Alert.alert(
        'Preferências Salvas',
        localSettings.ativado
          ? `Lembretes configurados para ${rotulo} do prazo.`
          : 'Lembretes de tarefas foram desativados.'
      );
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
          <View style={[styles.toggleCard, { backgroundColor: isDark ? '#1E293B' : colors.neutral[50], borderColor: theme.border }]}>
            <View style={[styles.toggleIconWrap, { backgroundColor: isDark ? '#1E3A8A' : colors.primary[50] }]}>
              <Ionicons
                name={localSettings.ativado ? 'notifications' : 'notifications-off-outline'}
                size={22}
                color={localSettings.ativado ? colors.primary[600] : colors.neutral[400]}
              />
            </View>
            <View style={styles.toggleTextCol}>
              <Text style={[styles.toggleTitle, { color: theme.text }]}>Lembretes de Tarefas</Text>
              <Text style={[styles.toggleDesc, { color: theme.textSecondary }]}>
                {localSettings.ativado
                  ? 'Ativo: avisos serão agendados antes do prazo'
                  : 'Desativado: nenhum alerta será disparado'}
              </Text>
            </View>
            <Switch
              value={localSettings.ativado}
              onValueChange={(ativado) => setLocalSettings((prev) => ({ ...prev, ativado }))}
              trackColor={{ false: colors.neutral[300], true: colors.primary[200] }}
              thumbColor={localSettings.ativado ? colors.primary[600] : colors.neutral[100]}
            />
          </View>

          {/* Seleção de Antecedência */}
          {localSettings.ativado && (
            <View style={styles.sectionAntecedencia}>
              <View style={styles.sectionHeader}>
                <Ionicons name="time-outline" size={16} color={isDark ? '#94A3B8' : colors.neutral[600]} />
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Momento do Alerta</Text>
              </View>
              <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
                Escolha a antecedência desejada para ser notificado:
              </Text>

              <View style={styles.optionsList}>
                {OPCOES_ANTECEDENCIA.map((opcao) => {
                  const isSelected = localSettings.minutosAntecedencia === opcao.valor;
                  return (
                    <TouchableOpacity
                      key={opcao.valor}
                      style={[
                        styles.optionCard,
                        {
                          backgroundColor: isSelected
                            ? (isDark ? '#1E3A8A' : colors.primary[50])
                            : (isDark ? '#1E293B' : colors.neutral.white),
                          borderColor: isSelected
                            ? (isDark ? '#3B82F6' : colors.primary[200])
                            : theme.border,
                        },
                      ]}
                      onPress={() =>
                        setLocalSettings((prev) => ({ ...prev, minutosAntecedencia: opcao.valor as AntecedenciaMinutos }))
                      }
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                        size={20}
                        color={isSelected ? colors.primary[600] : colors.neutral[400]}
                      />
                      <View style={styles.optionTextCol}>
                        <Text
                          style={[
                            styles.optionLabel,
                            { color: isSelected ? (isDark ? '#93C5FD' : colors.primary[700]) : theme.text },
                          ]}
                        >
                          {opcao.rotulo}
                        </Text>
                        <Text style={[styles.optionDesc, { color: theme.textSecondary }]}>{opcao.descricao}</Text>
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
              style={[styles.btnCancelar, { backgroundColor: isDark ? '#1E293B' : colors.neutral[100] }]}
              onPress={onClose}
              disabled={isSaving}
              activeOpacity={0.7}
            >
              <Text style={[styles.btnCancelarText, { color: isDark ? '#94A3B8' : colors.neutral[600] }]}>Cancelar</Text>
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

const styles = StyleSheet.create({
  loadingContainer: {
    padding: spacing.xxxl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  loadingText: {
    fontSize: 13,
    color: colors.neutral[500],
  },
  content: {
    gap: spacing.lg,
    paddingTop: spacing.xs,
  },
  toggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral[50],
    borderRadius: borderRadius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    gap: spacing.md,
  },
  toggleIconWrap: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary[50],
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
    color: colors.neutral[900],
  },
  toggleDesc: {
    fontSize: 12,
    color: colors.neutral[500],
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
    color: colors.neutral[700],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: colors.neutral[500],
    marginBottom: spacing.xs,
  },
  optionsList: {
    gap: spacing.sm,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.md,
    paddingVertical: 10,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.neutral[200],
    gap: 10,
  },
  optionCardSelected: {
    backgroundColor: colors.primary[50],
    borderColor: colors.primary[200],
  },
  optionTextCol: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.neutral[700],
  },
  optionLabelSelected: {
    color: colors.primary[700],
  },
  optionDesc: {
    fontSize: 11,
    color: colors.neutral[500],
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
    backgroundColor: colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnCancelarText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.neutral[600],
  },
  btnSalvar: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primary[600],
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

