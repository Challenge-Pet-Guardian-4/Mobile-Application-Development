import React, { memo, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { shadows } from '../../../utils/shadow';
import { AppTheme, colors, spacing, borderRadius } from '../../../constants/theme';
import { useTheme, useThemedStyles } from '../../../contexts/ThemeContext';
import { obterStatusScoreBar } from '../../../utils/homeUtils';
import { HomeScoreBarProps } from '../../../types/task';

export const HomeScoreBar = memo(function HomeScoreBar({ pets, routine, onPress }: HomeScoreBarProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const activePet = pets?.active;
  if (!activePet) return null;

  const score = routine?.score ?? 0;
  const petName = activePet.nome || 'Pet';
  const concluidas = routine?.completedToday?.length ?? 0;
  const expiradas = routine?.expiredToday?.length ?? 0;
  const total = routine?.todayTasks?.length ?? 0;

  const { percentage, statusTexto, statusCor, statusBg, progressColor } = useMemo(
    () => obterStatusScoreBar(concluidas, expiradas, total, theme),
    [concluidas, expiradas, total, theme]
  );

  const rotinaLabel = `${concluidas}/${total} ${total === 1 ? 'tarefa' : 'tarefas'}${
    expiradas > 0 ? ` • ${expiradas} expirada${expiradas > 1 ? 's' : ''}` : ''
  }`;

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <View style={styles.infoLeft}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="heart-pulse" size={22} color={theme.primary} />
            </View>
            <View style={styles.titleWrapper}>
              <Text style={styles.petTitle} numberOfLines={1} ellipsizeMode="tail">
                Bem-estar de {petName}
              </Text>
              <View style={[styles.statusPill, { backgroundColor: statusBg }]}>
                <Text style={[styles.statusText, { color: statusCor }]}>{statusTexto}</Text>
              </View>
            </View>
          </View>

          <View style={styles.pointsBadge}>
            <MaterialCommunityIcons name="star" size={14} color={colors.warning[600]} />
            <Text style={styles.pointsBadgeText}>{score} XP</Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBarBackground}>
            <View style={[styles.progressBarFill, { width: `${percentage}%`, backgroundColor: progressColor }]} />
          </View>
        </View>

        <View style={styles.footerRow}>
          <Text style={styles.pointsLabel}>Rotina Diária: {rotinaLabel}</Text>
          <Text style={styles.pointsValue}>
            <Text style={styles.currentPoints}>{score}</Text> XP Acumulados
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.card,
      borderRadius: borderRadius.xxl,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: theme.border,
      ...shadows.sm,
      elevation: 2,
    },
    headerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    infoLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      flex: 1,
      marginRight: spacing.sm,
    },
    titleWrapper: {
      flex: 1,
    },
    iconCircle: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.badgePrimaryBg,
      justifyContent: 'center',
      alignItems: 'center',
      flexShrink: 0,
    },
    petTitle: {
      fontSize: 16,
      fontWeight: '800',
      color: theme.text,
    },
    statusPill: {
      alignSelf: 'flex-start',
      paddingVertical: 2,
      paddingHorizontal: spacing.xs,
      borderRadius: borderRadius.sm,
      marginTop: 4,
    },
    statusText: {
      fontSize: 11,
      fontWeight: '700',
    },
    pointsBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: theme.badgeWarningBg,
      paddingVertical: spacing.xs,
      paddingHorizontal: 10,
      borderRadius: borderRadius.md,
      borderWidth: 1,
      borderColor: theme.badgeWarningBorder,
      flexShrink: 0,
    },
    pointsBadgeText: {
      color: colors.warning[600],
      fontWeight: '900',
      fontSize: 13,
    },
    progressContainer: {
      marginBottom: 10,
    },
    progressBarBackground: {
      height: 10,
      backgroundColor: theme.surfaceMuted,
      borderRadius: 5,
      overflow: 'hidden',
    },
    progressBarFill: {
      height: '100%',
      borderRadius: 5,
    },
    footerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    pointsLabel: {
      fontSize: 12,
      color: theme.textSecondary,
      fontWeight: '600',
    },
    pointsValue: {
      fontSize: 13,
      color: theme.textSecondary,
      fontWeight: '600',
    },
    currentPoints: {
      color: theme.primary,
      fontWeight: '800',
      fontSize: 15,
    },
  });

