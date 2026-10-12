import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { PetResponse } from '../../../types/pet';
import { AppTheme } from '../../../constants/theme';
import { useTheme, useThemedStyles } from '../../../contexts/ThemeContext';

interface TrilhasEmptyStateProps {
  petAtivo?: PetResponse;
}

export function TrilhasEmptyState({ petAtivo }: TrilhasEmptyStateProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconCircle}>
        <MaterialCommunityIcons name="book-open-page-variant-outline" size={44} color={theme.primary} />
      </View>
      <Text style={styles.emptyTitle}>Nenhuma Trilha Disponível</Text>
      <Text style={styles.emptyDesc}>
        Ainda não há trilhas ou módulos educativos cadastrados para {petAtivo?.nome || 'este pet'}.
      </Text>
      <View style={styles.emptyInfoBox}>
        <Ionicons name="information-circle-outline" size={20} color={theme.primary} />
        <Text style={styles.emptyInfoText}>
          O administrador do sistema disponibilizará novos módulos e aulas personalizadas em breve!
        </Text>
      </View>
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.card,
      marginHorizontal: 20,
      marginTop: 20,
      padding: 30,
      borderRadius: 24,
      borderWidth: 1.5,
      borderColor: theme.border,
      elevation: 2,
    },
    emptyIconCircle: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.badgePrimaryBg,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: '900',
      color: theme.text,
      marginBottom: 8,
      textAlign: 'center',
    },
    emptyDesc: {
      fontSize: 13,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 19,
      marginBottom: 20,
    },
    emptyInfoBox: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      backgroundColor: theme.badgePrimaryBg,
      padding: 14,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.badgePrimaryBorder,
    },
    emptyInfoText: {
      flex: 1,
      fontSize: 12,
      color: theme.badgePrimaryText,
      lineHeight: 17,
      fontWeight: '600',
    },
  });
