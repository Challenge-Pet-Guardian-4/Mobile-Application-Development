import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { shadows } from '../../../utils/shadow';
import { useUserProfile } from '../../../hooks/useUserProfile';
import { useTheme, useThemedStyles } from '../../../contexts/ThemeContext';
import { AppTheme, colors } from '../../../constants/theme';

interface StatCardProps {
  iconName: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  iconColor: string;
  iconBgColor: string;
  value: string | number;
  label: string;
  styles: ReturnType<typeof createStyles>;
}

function StatCard({ iconName, iconColor, iconBgColor, value, label, styles }: StatCardProps) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconBox, { backgroundColor: iconBgColor }]}>
        <MaterialCommunityIcons name={iconName} size={18} color={iconColor} />
      </View>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

interface EstatisticasPerfilProps {
  profile: ReturnType<typeof useUserProfile>['profile'];
}

export function EstatisticasPerfil({ profile }: EstatisticasPerfilProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { pontosTotais, redeCuidado } = profile;

  return (
    <View style={styles.statsRow}>
      <StatCard
        iconName="star"
        iconColor={colors.warning[600]}
        iconBgColor={theme.badgeWarningBg}
        value={pontosTotais !== undefined ? `${pontosTotais}` : '0'}
        label="Pontos XP"
        styles={styles}
      />
      <StatCard
        iconName="paw"
        iconColor={theme.primary}
        iconBgColor={theme.badgePrimaryBg}
        value={redeCuidado?.pets?.length ? `${redeCuidado.pets.length}` : '0'}
        label="Pets Família"
        styles={styles}
      />
      <StatCard
        iconName="check-circle"
        iconColor={colors.success.default}
        iconBgColor={theme.badgeSuccessBg}
        value={redeCuidado?.totalTarefasConcluidas ? `${redeCuidado.totalTarefasConcluidas}` : '0'}
        label="Concluídas"
        styles={styles}
      />
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    statsRow: {
      flexDirection: 'row',
      gap: 10,
    },
    card: {
      flex: 1,
      backgroundColor: theme.card,
      borderRadius: 20,
      paddingVertical: 14,
      paddingHorizontal: 10,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.border,
      ...shadows.xs,
      elevation: 1,
    },
    iconBox: {
      width: 36,
      height: 36,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
    },
    value: {
      fontSize: 18,
      fontWeight: '900',
      color: theme.text,
    },
    label: {
      fontSize: 11,
      color: theme.textSecondary,
      fontWeight: '600',
      marginTop: 2,
    },
  });
