import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { shadows } from '../../../utils/shadow';
import { UsuarioRole } from '../../../types/user';
import { useTheme, useThemedStyles } from '../../../contexts/ThemeContext';
import { AppTheme } from '../../../constants/theme';

interface UpgradePremiumCardProps {
  role?: UsuarioRole;
  onUpgradePress: () => void;
  isUpgrading?: boolean;
}

export function UpgradePremiumCard({
  role = 'COMUM',
  onUpgradePress,
  isUpgrading = false,
}: UpgradePremiumCardProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  // 1. Estado para Usuário COMUM (Banner de Chamada para Upgrade)
  if (role === 'COMUM') {
    return (
      <View style={styles.cardComum}>
        <View style={styles.topHeaderRow}>
          <View style={styles.badgePromo}>
            <Ionicons name="sparkles" size={12} color={theme.badgeWarningText} />
            <Text style={styles.badgePromoText}>PLANO RECOMENDADO</Text>
          </View>
          <View style={styles.crownCircle}>
            <MaterialCommunityIcons name="crown" size={20} color={theme.badgeWarningText} />
          </View>
        </View>

        <Text style={styles.titleComum}>PetGuardian Premium ⭐</Text>
        <Text style={styles.subtitleComum}>
          Desbloqueie todo o potencial de cuidados, educação e saúde inteligente para sua família.
        </Text>

        <View style={styles.benefitsContainer}>
          <View style={styles.benefitRow}>
            <Ionicons name="checkmark-circle" size={16} color="#059669" />
            <Text style={styles.benefitText}>Trilhas pedagógicas completas de adestramento com XP</Text>
          </View>
          <View style={styles.benefitRow}>
            <Ionicons name="checkmark-circle" size={16} color="#059669" />
            <Text style={styles.benefitText}>Assistente de IA Preventiva de saúde 24h ilimitado</Text>
          </View>
          <View style={styles.benefitRow}>
            <Ionicons name="checkmark-circle" size={16} color="#059669" />
            <Text style={styles.benefitText}>Gamificação avançada com pontuação agregada no Oracle</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.btnUpgrade}
          onPress={onUpgradePress}
          activeOpacity={0.85}
          disabled={isUpgrading}
        >
          {isUpgrading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <MaterialCommunityIcons name="crown" size={18} color="#FFFFFF" />
              <Text style={styles.btnUpgradeText}>Fazer Upgrade para Premium</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    );
  }

  // 2. Estado para Usuário PREMIUM (Confirmação de Status Ativo)
  return (
    <View style={styles.cardPremiumAtivo}>
      <View style={styles.headerStatusRow}>
        <View style={styles.badgeAtivo}>
          <MaterialCommunityIcons name="crown" size={14} color={theme.badgeWarningText} />
          <Text style={styles.badgeAtivoText}>ASSINANTE PREMIUM ATIVO</Text>
        </View>
        <Ionicons name="shield-checkmark" size={22} color="#059669" />
      </View>

      <Text style={styles.titleAtivo}>Seu Plano Premium está 100% Ativo! ⭐</Text>
      <Text style={styles.subtitleAtivo}>
        Você possui acesso irrestrito a todas as trilhas educativas de adestramento, lições gamificadas e à IA Preventiva de saúde.
      </Text>

      <View style={styles.activePillsRow}>
        <View style={styles.activePill}>
          <Ionicons name="school-outline" size={14} color={theme.badgeSuccessText} />
          <Text style={styles.activePillText}>Trilhas Liberadas</Text>
        </View>
        <View style={styles.activePill}>
          <MaterialCommunityIcons name="robot-outline" size={14} color={theme.badgeSuccessText} />
          <Text style={styles.activePillText}>IA Desbloqueada</Text>
        </View>
        <View style={styles.activePill}>
          <Ionicons name="flash-outline" size={14} color={theme.badgeSuccessText} />
          <Text style={styles.activePillText}>XP Total</Text>
        </View>
      </View>
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    // Card Comum
    cardComum: {
      backgroundColor: theme.isDark ? theme.card : '#FFFDF5',
      borderRadius: 24,
      padding: 20,
      borderWidth: 1.5,
      borderColor: theme.isDark ? theme.badgeWarningBorder : '#FDE68A',
      ...shadows.sm,
    },
    topHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    badgePromo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      backgroundColor: theme.badgeWarningBg,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.badgeWarningBorder,
    },
    badgePromoText: {
      color: theme.badgeWarningText,
      fontSize: 10,
      fontWeight: '800',
      letterSpacing: 0.5,
    },
    crownCircle: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.badgeWarningBg,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.badgeWarningBorder,
    },
    titleComum: {
      fontSize: 18,
      fontWeight: '900',
      color: theme.text,
      marginBottom: 4,
    },
    subtitleComum: {
      fontSize: 12,
      color: theme.textSecondary,
      lineHeight: 18,
      marginBottom: 14,
    },
    benefitsContainer: {
      gap: 8,
      backgroundColor: theme.cardSubtle,
      borderRadius: 16,
      padding: 12,
      borderWidth: 1,
      borderColor: theme.border,
      marginBottom: 16,
    },
    benefitRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    benefitText: {
      fontSize: 12,
      color: theme.text,
      fontWeight: '600',
      flex: 1,
    },
    btnUpgrade: {
      backgroundColor: '#D97706',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 14,
      borderRadius: 16,
      ...shadows.sm,
    },
    btnUpgradeText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '800',
      letterSpacing: 0.3,
    },

    // Card Premium Ativo
    cardPremiumAtivo: {
      backgroundColor: theme.isDark ? theme.card : '#F0FDF4',
      borderRadius: 24,
      padding: 20,
      borderWidth: 1.5,
      borderColor: theme.isDark ? theme.badgeSuccessBorder : '#BBF7D0',
      ...shadows.sm,
    },
    headerStatusRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    badgeAtivo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      backgroundColor: theme.badgeWarningBg,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.badgeWarningBorder,
    },
    badgeAtivoText: {
      color: theme.badgeWarningText,
      fontSize: 10,
      fontWeight: '800',
      letterSpacing: 0.5,
    },
    titleAtivo: {
      fontSize: 16,
      fontWeight: '800',
      color: theme.isDark ? '#6EE7B7' : '#065F46',
      marginBottom: 4,
    },
    subtitleAtivo: {
      fontSize: 12,
      color: theme.isDark ? theme.textSecondary : '#047857',
      lineHeight: 17,
      marginBottom: 14,
    },
    activePillsRow: {
      flexDirection: 'row',
      gap: 8,
      flexWrap: 'wrap',
    },
    activePill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      backgroundColor: theme.badgeSuccessBg,
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.badgeSuccessBorder,
    },
    activePillText: {
      fontSize: 11,
      fontWeight: '700',
      color: theme.badgeSuccessText,
    },
  });
