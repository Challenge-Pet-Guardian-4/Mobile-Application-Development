import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { UsuarioRole } from '../../types/user';
import { useTheme, useThemedStyles } from '../../contexts/ThemeContext';
import { AppTheme } from '../../constants/theme';

interface RoleOptionConfig {
  role: UsuarioRole;
  title: string;
  description: string;
  badgeLabel: string;
  iconFamily: 'ion' | 'material';
  activeBorder: (theme: AppTheme) => string;
  activeBg: (theme: AppTheme) => string;
  activeColor: (theme: AppTheme) => string;
}

const ROLES: RoleOptionConfig[] = [
  {
    role: 'COMUM',
    title: 'Comum',
    description: 'Rotinas, cuidados e histórico do pet',
    badgeLabel: 'Gratuito',
    iconFamily: 'ion',
    activeBorder: (t) => t.badgePrimaryBorder,
    activeBg: (t) => t.badgePrimaryBg,
    activeColor: (t) => t.badgePrimaryText,
  },
  {
    role: 'PREMIUM',
    title: 'Premium',
    description: 'Trilhas, módulos, aulas e IA Assistente',
    badgeLabel: '⭐ Completo',
    iconFamily: 'material',
    activeBorder: (t) => t.badgeWarningBorder,
    activeBg: (t) => t.badgeWarningBg,
    activeColor: (t) => t.badgeWarningText,
  },
];

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
          {ROLES.map((item) => {
            const isSelected = value === item.role;
            const iconColor = isSelected ? item.activeColor(theme) : theme.textSecondary;

            return (
              <TouchableOpacity
                key={item.role}
                style={[
                  styles.compactCard,
                  isSelected && {
                    borderColor: item.activeBorder(theme),
                    backgroundColor: item.activeBg(theme),
                  },
                ]}
                onPress={() => onChange(item.role)}
                activeOpacity={0.8}
              >
                {item.iconFamily === 'ion' ? (
                  <Ionicons name="paw" size={16} color={iconColor} />
                ) : (
                  <MaterialCommunityIcons name="crown" size={16} color={iconColor} />
                )}
                <Text
                  style={[
                    styles.compactCardText,
                    isSelected && { color: item.activeColor(theme) },
                  ]}
                >
                  {item.role === 'PREMIUM' ? 'Premium ⭐' : 'Comum'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.row}>
        {ROLES.map((item) => {
          const isSelected = value === item.role;
          const iconColor = isSelected ? item.activeColor(theme) : theme.textSecondary;

          return (
            <TouchableOpacity
              key={item.role}
              style={[
                styles.card,
                isSelected && {
                  borderColor: item.activeBorder(theme),
                  backgroundColor: item.activeBg(theme),
                },
              ]}
              onPress={() => onChange(item.role)}
              activeOpacity={0.8}
            >
              <View style={styles.headerRow}>
                {item.iconFamily === 'ion' ? (
                  <Ionicons name="paw" size={20} color={iconColor} />
                ) : (
                  <MaterialCommunityIcons name="crown" size={20} color={iconColor} />
                )}
                <Text style={[styles.title, isSelected && { color: item.activeColor(theme) }]}>
                  {item.title}
                </Text>
              </View>
              <Text style={styles.description}>{item.description}</Text>
              <View
                style={[
                  styles.badge,
                  isSelected && {
                    backgroundColor: theme.isDark
                      ? theme.surfaceMuted
                      : item.role === 'COMUM'
                      ? '#DBEAFE'
                      : '#FDE68A',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    isSelected && { color: item.activeColor(theme) },
                  ]}
                >
                  {item.badgeLabel}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
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
    badgeText: {
      fontSize: 10,
      fontWeight: '700',
      color: theme.textSecondary,
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
    compactCardText: {
      fontSize: 12,
      fontWeight: '700',
      color: theme.textSecondary,
    },
  });
