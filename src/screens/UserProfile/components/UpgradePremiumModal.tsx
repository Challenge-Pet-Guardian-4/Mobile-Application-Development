import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { BaseModal } from '../../../components/BaseModal';
import { shadows } from '../../../utils/shadow';
import { useTheme, useThemedStyles } from '../../../contexts/ThemeContext';
import { AppTheme } from '../../../constants/theme';

interface UpgradePremiumModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

const BENEFICIOS_PREMIUM = [
  {
    icon: 'school-outline',
    titulo: 'Trilhas Educativas & Adestramento',
    descricao: 'Módulos didáticos completos com lições práticas e ganho de pontuação de bem-estar.',
  },
  {
    icon: 'sparkles-outline',
    titulo: 'Assistente de IA Preventiva 24h',
    descricao: 'Orientações inteligentes em tempo real sobre nutrição, sintomas e vacinação.',
  },
  {
    icon: 'trophy-outline',
    titulo: 'Gamificação & Ranking Familiar',
    descricao: 'Acúmulo acelerado de XP registrado nativamente nas Stored Procedures Oracle.',
  },
  {
    icon: 'people-outline',
    titulo: 'Care Circle Sem Restrições',
    descricao: 'Gestão compartilhada de pets com múltiplos co-cuidadores e alertas síncronos.',
  },
];

export function UpgradePremiumModal({
  visible,
  onClose,
  onConfirm,
  isLoading = false,
}: UpgradePremiumModalProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <BaseModal
      visible={visible}
      onClose={onClose}
      title="Ativar PetGuardian Premium"
      subtitle="Evolua os cuidados e o aprendizado dos seus pets"
      size="md"
      footer={
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.btnConfirm}
            onPress={onConfirm}
            activeOpacity={0.85}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <MaterialCommunityIcons name="crown" size={18} color="#FFFFFF" />
                <Text style={styles.btnConfirmText}>Confirmar e Ativar Premium ⭐</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnCancel}
            onPress={onClose}
            activeOpacity={0.7}
            disabled={isLoading}
          >
            <Text style={styles.btnCancelText}>Agora Não</Text>
          </TouchableOpacity>
        </View>
      }
    >
      <View style={styles.modalContent}>
        {/* Banner de Destaque */}
        <View style={styles.promoBanner}>
          <View style={styles.crownCircle}>
            <MaterialCommunityIcons name="crown" size={28} color={theme.badgeWarningText} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.promoTitle}>Plano Premium ⭐</Text>
            <Text style={styles.promoSubtitle}>
              Acesso total ao ecossistema avançado de cuidados do PetGuardian.
            </Text>
          </View>
        </View>

        {/* Lista de Benefícios */}
        <View style={styles.benefitsList}>
          {BENEFICIOS_PREMIUM.map((b, index) => (
            <View key={index} style={styles.benefitItem}>
              <View style={styles.benefitIconBox}>
                <Ionicons name={b.icon as keyof typeof Ionicons.glyphMap} size={18} color={theme.badgeWarningText} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.benefitTitle}>{b.titulo}</Text>
                <Text style={styles.benefitDesc}>{b.descricao}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Ativação Premium */}
        <View style={styles.academicNotice}>
          <Ionicons name="information-circle" size={16} color={theme.badgePrimaryText} />
          <Text style={styles.academicNoticeText}>
            Ativação do perfil Premium é imediata e gratuita para testes.
          </Text>
        </View>
      </View>
    </BaseModal>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    modalContent: {
      gap: 14,
    },
    promoBanner: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      backgroundColor: theme.badgeWarningBg,
      borderRadius: 18,
      padding: 14,
      borderWidth: 1.5,
      borderColor: theme.badgeWarningBorder,
    },
    crownCircle: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.badgeWarningBg,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1.5,
      borderColor: theme.badgeWarningBorder,
    },
    promoTitle: {
      fontSize: 16,
      fontWeight: '900',
      color: theme.badgeWarningText,
      marginBottom: 2,
    },
    promoSubtitle: {
      fontSize: 12,
      color: theme.badgeWarningText,
      lineHeight: 16,
      opacity: 0.9,
    },
    benefitsList: {
      gap: 10,
    },
    benefitItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
      backgroundColor: theme.cardSubtle,
      borderRadius: 14,
      padding: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    benefitIconBox: {
      width: 32,
      height: 32,
      borderRadius: 10,
      backgroundColor: theme.badgeWarningBg,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 2,
    },
    benefitTitle: {
      fontSize: 13,
      fontWeight: '800',
      color: theme.text,
      marginBottom: 2,
    },
    benefitDesc: {
      fontSize: 11,
      color: theme.textSecondary,
      lineHeight: 16,
    },
    academicNotice: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: theme.badgePrimaryBg,
      padding: 10,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.badgePrimaryBorder,
    },
    academicNoticeText: {
      fontSize: 11,
      color: theme.badgePrimaryText,
      lineHeight: 15,
      flex: 1,
      fontWeight: '500',
    },
    actionsContainer: {
      gap: 8,
      marginTop: 4,
    },
    btnConfirm: {
      backgroundColor: '#D97706',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 14,
      borderRadius: 16,
      ...shadows.sm,
    },
    btnConfirmText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '800',
      letterSpacing: 0.3,
    },
    btnCancel: {
      backgroundColor: theme.surfaceMuted,
      paddingVertical: 12,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
    btnCancelText: {
      color: theme.textSecondary,
      fontSize: 13,
      fontWeight: '600',
    },
  });
