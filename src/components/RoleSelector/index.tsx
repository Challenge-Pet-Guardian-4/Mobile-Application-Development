import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { UsuarioRole } from '../../types/user';
import { useTheme, useThemedStyles } from '../../contexts/ThemeContext';
import { AppTheme } from '../../constants/theme';

interface RoleSelectorProps {
  value: UsuarioRole;
  onChange: (role: UsuarioRole) => void;
  variant?: 'cards' | 'compact';
  label?: string;
}

export function RoleSelector({
  value,
  onChange,
  variant = 'cards',
  label = 'Escolha seu Perfil de Tutor:',
}: RoleSelectorProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const isCompact = variant === 'compact';

  if (isCompact) {
    return (
      <View style={styles.compactContainer}>
        {label ? <Text style={styles.compactLabel}>{label}</Text> : null}
        <View style={styles.compactRow}>
          <TouchableOpacity
            style={[
              styles.compactCard,
              value === 'COMUM' && styles.compactCardActiveComum,
            ]}
            onPress={() => onChange('COMUM')}
            activeOpacity={0.8}
          >
            <Ionicons
              name="paw"
              size={16}
              color={value === 'COMUM' ? theme.badgePrimaryText : theme.textSecondary}
            />
            <Text
              style={[
                styles.compactCardText,
                value === 'COMUM' && styles.compactCardTextActiveComum,
              ]}
            >
              Comum
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.compactCard,
              value === 'PREMIUM' && styles.compactCardActivePremium,
            ]}
            onPress={() => onChange('PREMIUM')}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons
              name="crown"
              size={16}
              color={value === 'PREMIUM' ? theme.badgeWarningText : theme.textSecondary}
            />
            <Text
              style={[
                styles.compactCardText,
                value === 'PREMIUM' && styles.compactCardTextActivePremium,
              ]}
            >
              Premium ⭐
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.row}>
        {/* Opção Comum */}
        <TouchableOpacity
          style={[styles.card, value === 'COMUM' && styles.cardActiveComum]}
          onPress={() => onChange('COMUM')}
          activeOpacity={0.8}
        >
          <View style={styles.headerRow}>
            <Ionicons
              name="paw"
              size={20}
              color={value === 'COMUM' ? theme.badgePrimaryText : theme.textSecondary}
            />
            <Text style={[styles.title, value === 'COMUM' && styles.titleActiveComum]}>
              Comum
            </Text>
          </View>
          <Text style={styles.description}>
            Rotinas, cuidados e histórico do pet
          </Text>
          <View style={[styles.badge, value === 'COMUM' && styles.badgeActiveComum]}>
            <Text style={[styles.badgeText, value === 'COMUM' && styles.badgeTextActiveComum]}>
              Gratuito
            </Text>
          </View>
        </TouchableOpacity>

        {/* Opção Premium */}
        <TouchableOpacity
          style={[styles.card, value === 'PREMIUM' && styles.cardActivePremium]}
          onPress={() => onChange('PREMIUM')}
          activeOpacity={0.8}
        >
          <View style={styles.headerRow}>
            <MaterialCommunityIcons
              name="crown"
              size={20}
              color={value === 'PREMIUM' ? theme.badgeWarningText : theme.textSecondary}
            />
            <Text style={[styles.title, value === 'PREMIUM' && styles.titleActivePremium]}>
              Premium
            </Text>
          </View>
          <Text style={styles.description}>
            Trilhas, módulos, aulas e IA Assistente
          </Text>
          <View style={[styles.badge, value === 'PREMIUM' && styles.badgeActivePremium]}>
            <Text style={[styles.badgeText, value === 'PREMIUM' && styles.badgeTextActivePremium]}>
              ⭐ Completo
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      marginBottom: 18,
    },
    label: {
      fontSize: 13,
      fontWeight: '700',
      color: theme.text,
      marginBottom: 8,
    },
    row: {
      flexDirection: 'row',
      gap: 10,
    },
    card: {
      flex: 1,
      padding: 12,
      borderRadius: 16,
      borderWidth: 2,
      borderColor: theme.border,
      backgroundColor: theme.card,
      justifyContent: 'space-between',
    },
    cardActiveComum: {
      borderColor: theme.badgePrimaryBorder,
      backgroundColor: theme.badgePrimaryBg,
    },
    cardActivePremium: {
      borderColor: theme.badgeWarningBorder,
      backgroundColor: theme.badgeWarningBg,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 4,
    },
    title: {
      fontSize: 14,
      fontWeight: '800',
      color: theme.textSecondary,
    },
    titleActiveComum: {
      color: theme.badgePrimaryText,
    },
    titleActivePremium: {
      color: theme.badgeWarningText,
    },
    description: {
      fontSize: 11,
      color: theme.textSecondary,
      lineHeight: 14,
      marginBottom: 8,
    },
    badge: {
      alignSelf: 'flex-start',
      paddingVertical: 3,
      paddingHorizontal: 8,
      borderRadius: 6,
      backgroundColor: theme.surfaceMuted,
    },
    badgeActiveComum: {
      backgroundColor: theme.isDark ? theme.surfaceMuted : '#DBEAFE',
    },
    badgeActivePremium: {
      backgroundColor: theme.isDark ? theme.surfaceMuted : '#FDE68A',
    },
    badgeText: {
      fontSize: 10,
      fontWeight: '700',
      color: theme.textSecondary,
    },
    badgeTextActiveComum: {
      color: theme.badgePrimaryText,
    },
    badgeTextActivePremium: {
      color: theme.badgeWarningText,
    },

    // Compact Variant
    compactContainer: {
      marginBottom: 14,
    },
    compactLabel: {
      fontSize: 12,
      fontWeight: '700',
      color: theme.text,
      marginBottom: 6,
    },
    compactRow: {
      flexDirection: 'row',
      gap: 8,
    },
    compactCard: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 12,
      borderWidth: 1.5,
      borderColor: theme.border,
      backgroundColor: theme.card,
    },
    compactCardActiveComum: {
      borderColor: theme.badgePrimaryBorder,
      backgroundColor: theme.badgePrimaryBg,
    },
    compactCardActivePremium: {
      borderColor: theme.badgeWarningBorder,
      backgroundColor: theme.badgeWarningBg,
    },
    compactCardText: {
      fontSize: 12,
      fontWeight: '700',
      color: theme.textSecondary,
    },
    compactCardTextActiveComum: {
      color: theme.badgePrimaryText,
    },
    compactCardTextActivePremium: {
      color: theme.badgeWarningText,
    },
  });
