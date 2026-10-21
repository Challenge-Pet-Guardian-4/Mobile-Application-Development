import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { PetResponse } from '../../../types/pet';
import { AppTheme, spacing, borderRadius } from '../../../constants/theme';
import { useTheme, useThemedStyles } from '../../../contexts/ThemeContext';

export interface PetCardProps {
  pet: PetResponse;
  isResponsavelPrincipal?: boolean;
  tarefasCount?: number;
  pontosTotais?: number;
  onPress?: () => void;
}

export function PetCard({ pet, isResponsavelPrincipal, tarefasCount, pontosTotais, onPress }: PetCardProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
      disabled={!onPress}
    >
      {isResponsavelPrincipal ? (
        <View style={styles.principalBadge}>
          <Ionicons name="shield-checkmark" size={10} color={theme.badgeSuccessText} />
          <Text style={styles.principalBadgeText}>Tutor Princ.</Text>
        </View>
      ) : null}

      <View style={styles.avatarWrapper}>
        <MaterialCommunityIcons name="paw" size={24} color={theme.primary} />
      </View>

      <Text style={styles.name} numberOfLines={1}>
        {pet.nome}
      </Text>

      <Text style={styles.breed} numberOfLines={1}>
        {pet.raca || 'Pet'}
      </Text>

      <View style={styles.badgesRow}>
        <View style={styles.badgeMuted}>
          <Text style={styles.badgeMutedText}>Porte {pet.porte}</Text>
        </View>
        {tarefasCount !== undefined && tarefasCount > 0 ? (
          <View style={styles.badgePrimary}>
            <Text style={styles.badgePrimaryText}>
              {tarefasCount} {tarefasCount === 1 ? 'tarefa' : 'tarefas'}
            </Text>
          </View>
        ) : null}
        {pontosTotais !== undefined ? (
          <View style={styles.badgeWarning}>
            <Text style={styles.badgeWarningText}>
              {pontosTotais} XP
            </Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    card: {
      position: 'relative',
      width: '48%',
      backgroundColor: theme.card,
      padding: 14,
      borderRadius: borderRadius.xl,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.border,
    },
    principalBadge: {
      position: 'absolute',
      top: spacing.xs,
      right: spacing.xs,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
      backgroundColor: theme.badgeSuccessBg,
      paddingVertical: 2,
      paddingHorizontal: 6,
      borderRadius: borderRadius.xs,
      zIndex: 2,
    },
    principalBadgeText: {
      fontSize: 9,
      fontWeight: '800',
      color: theme.badgeSuccessText,
    },
    avatarWrapper: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: theme.badgePrimaryBg,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      marginBottom: spacing.xs,
    },
    name: {
      fontSize: 14,
      fontWeight: '800',
      color: theme.text,
    },
    breed: {
      fontSize: 11,
      color: theme.textSecondary,
      marginTop: 2,
      marginBottom: spacing.xs,
    },
    badgesRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: 4,
    },
    badgeMuted: {
      backgroundColor: theme.surfaceMuted,
      paddingVertical: 3,
      paddingHorizontal: spacing.xs,
      borderRadius: borderRadius.sm,
    },
    badgeMutedText: {
      fontSize: 10,
      fontWeight: '700',
      color: theme.textSecondary,
    },
    badgePrimary: {
      backgroundColor: theme.badgePrimaryBg,
      paddingVertical: 3,
      paddingHorizontal: spacing.xs,
      borderRadius: borderRadius.sm,
    },
    badgePrimaryText: {
      fontSize: 10,
      fontWeight: '700',
      color: theme.badgePrimaryText,
    },
    badgeWarning: {
      backgroundColor: theme.badgeWarningBg,
      paddingVertical: 3,
      paddingHorizontal: spacing.xs,
      borderRadius: borderRadius.sm,
    },
    badgeWarningText: {
      fontSize: 10,
      fontWeight: '700',
      color: theme.badgeWarningText,
    },
  });

