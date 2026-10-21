import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PetPontuacaoResponse } from '../../../types/pet';
import { shadows } from '../../../utils/shadow';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { AppTheme, spacing, borderRadius } from '../../../constants/theme';
import { useTheme, useThemedStyles } from '../../../contexts/ThemeContext';

export interface PetPointsCardProps {
  pontos?: PetPontuacaoResponse;
  isLoading?: boolean;
}

export function PetPointsCard({ pontos, isLoading = false }: PetPointsCardProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  if (isLoading && !pontos) {
    return (
      <View style={styles.pointsCard}>
        <LoadingSpinner message="Buscando pontuação do pet..." size="small" />
      </View>
    );
  }

  const pontosTotais = pontos?.pontosTotais ?? 0;
  const pontosTarefas = pontos?.pontosTarefas ?? 0;
  const pontosAulas = pontos?.pontosAulas ?? 0;

  return (
    <View style={styles.pointsCard}>
      <View style={styles.pointsHeader}>
        <View style={styles.headerTitleRow}>
          <MaterialCommunityIcons name="star-circle-outline" size={20} color={theme.primary} />
          <Text style={styles.pointsTitle}>Pontuação do Pet</Text>
        </View>

        <View style={styles.totalBadge}>
          <MaterialCommunityIcons name="star" size={14} color={theme.badgeWarningText} />
          <Text style={styles.totalBadgeText}>{pontosTotais} XP</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <View style={[styles.iconBox, styles.iconBoxPrimary]}>
            <MaterialCommunityIcons name="clipboard-check-outline" size={18} color={theme.primary} />
          </View>
          <Text style={styles.statValue}>+{pontosTarefas} pts</Text>
          <Text style={styles.statLabel}>Tarefas da Rotina</Text>
        </View>

        <View style={styles.statBox}>
          <View style={[styles.iconBox, styles.iconBoxSuccess]}>
            <MaterialCommunityIcons name="school-outline" size={18} color={theme.badgeSuccessText} />
          </View>
          <Text style={styles.statValue}>+{pontosAulas} pts</Text>
          <Text style={styles.statLabel}>Aulas & Treinos</Text>
        </View>
      </View>
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    pointsCard: {
      backgroundColor: theme.card,
      borderRadius: borderRadius.xxl,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: theme.border,
      ...shadows.sm,
      marginBottom: spacing.md,
    },
    pointsHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    headerTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    pointsTitle: {
      fontSize: 16,
      fontWeight: '800',
      color: theme.text,
    },
    totalBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.badgeWarningBg,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: borderRadius.md,
      gap: 4,
    },
    totalBadgeText: {
      fontSize: 13,
      fontWeight: '800',
      color: theme.badgeWarningText,
    },
    statsRow: {
      flexDirection: 'row',
      gap: 12,
    },
    statBox: {
      flex: 1,
      backgroundColor: theme.surfaceSubtle,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.border,
    },
    iconBox: {
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
    },
    iconBoxPrimary: {
      backgroundColor: theme.badgePrimaryBg,
    },
    iconBoxSuccess: {
      backgroundColor: theme.badgeSuccessBg,
    },
    statValue: {
      fontSize: 15,
      fontWeight: '800',
      color: theme.text,
      marginBottom: 2,
    },
    statLabel: {
      fontSize: 11,
      color: theme.textSecondary,
      fontWeight: '600',
      textAlign: 'center',
    },
  });
