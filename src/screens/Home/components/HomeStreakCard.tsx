import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { shadows } from '../../../utils/shadow';
import { StreakCardProps } from '../../../types/models';
import { calcularDiasSemanaAtual, calcularTotalOfensiva, getDiasDaSemanaVazios } from '../../../utils/streakUtils';
import { useThemedStyles } from '../../../contexts/ThemeContext';
import { AppTheme } from '../../../constants/theme';

export function HomeStreakCard({ streakDays, totalStreak, tasks }: StreakCardProps) {
  const styles = useThemedStyles(createStyles);
  const { diasExibidos, streakExibido } = useMemo(() => {
    if (tasks) {
      return {
        diasExibidos: calcularDiasSemanaAtual(tasks),
        streakExibido: totalStreak !== undefined ? totalStreak : calcularTotalOfensiva(tasks),
      };
    }

    return {
      diasExibidos: streakDays && streakDays.length > 0 ? streakDays : getDiasDaSemanaVazios(),
      streakExibido: totalStreak ?? 0,
    };
  }, [tasks, streakDays, totalStreak]);

  return (
    <View style={styles.streakCard}>
      <View style={styles.streakHeader}>
        <View style={styles.titleRow}>
          <Text style={styles.sectionTitle}>Ofensiva Familiar</Text>
          <Text style={styles.sectionSubtitle}>Cuidado diário consistente</Text>
        </View>

        <View style={styles.totalStreakBadge}>
          <MaterialCommunityIcons name="fire" size={18} color="#EA580C" />
          <Text style={styles.totalStreakText}>
            {streakExibido} {streakExibido === 1 ? 'dia' : 'dias'}
          </Text>
        </View>
      </View>

      <View style={styles.streakRow}>
        {diasExibidos.map((item) => (
          <View key={item.id} style={styles.streakColumn}>
            <View
              style={[
                styles.streakDayCircle,
                item.done && styles.streakCompleted,
                item.isToday && !item.done && styles.streakToday,
                item.missed && styles.streakMissed,
              ]}
            >
              {item.done ? (
                <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" />
              ) : item.isToday ? (
                <MaterialCommunityIcons name="paw" size={14} color="#2563EB" />
              ) : item.missed ? (
                <MaterialCommunityIcons name="close" size={15} color="#EF4444" />
              ) : (
                <Text style={styles.streakDayNumber}>{item.dayNumber}</Text>
              )}
            </View>
            <Text
              style={[
                styles.streakDayLabel,
                item.isToday && styles.streakDayLabelToday,
                item.missed && styles.streakDayLabelMissed,
              ]}
            >
              {item.dayLabel}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    streakCard: {
      backgroundColor: theme.card,
      borderRadius: 24,
      padding: 20,
      borderWidth: 1,
      borderColor: theme.border,
      ...shadows.sm,
      elevation: 2,
    },
    streakHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    titleRow: {
      gap: 2,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '800',
      color: theme.text,
    },
    sectionSubtitle: {
      fontSize: 12,
      color: theme.textSecondary,
    },
    totalStreakBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.badgeWarningBg,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.badgeWarningBorder,
      gap: 4,
    },
    totalStreakText: {
      fontSize: 13,
      fontWeight: '800',
      color: '#C2410C',
    },
    streakRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    streakColumn: {
      alignItems: 'center',
      gap: 6,
    },
    streakDayCircle: {
      width: 38,
      height: 48,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.surfaceMuted,
      borderWidth: 1,
      borderColor: theme.border,
    },
    streakCompleted: {
      backgroundColor: '#10B981',
      borderColor: '#10B981',
    },
    streakToday: {
      backgroundColor: theme.badgePrimaryBg,
      borderColor: '#93C5FD',
      borderWidth: 1.5,
    },
    streakMissed: {
      backgroundColor: theme.badgeDangerBg,
      borderColor: '#FECACA',
      borderWidth: 1.5,
    },
    streakDayNumber: {
      color: theme.textSecondary,
      fontSize: 12,
      fontWeight: '700',
    },
    streakDayLabel: {
      fontSize: 11,
      color: theme.textSecondary,
      fontWeight: '600',
    },
    streakDayLabelToday: {
      color: '#2563EB',
      fontWeight: '800',
    },
    streakDayLabelMissed: {
      color: '#EF4444',
      fontWeight: '700',
    },
  });
