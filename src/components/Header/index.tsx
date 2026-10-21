import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useSession } from '../../hooks/useSession';
import { shadows } from '../../utils/shadow';
import { spacing, AppTheme } from '../../constants/theme';
import { useThemedStyles, useTheme } from '../../contexts/ThemeContext';

export type HeaderProps = {
  title?: string;
  subtitle?: string;
  onRightPress?: () => void;
};

export function Header({ title, subtitle, onRightPress }: HeaderProps) {
  const { user } = useSession();
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const userName = user?.nome ? user.nome.split(' ')[0] : 'Tutor';

  return (
    <View style={styles.container}>
      <View style={styles.leftColumn}>
        <View style={styles.brandRow}>
          <View style={styles.brandIconWrapper}>
            <FontAwesome5 name="paw" size={13} color={theme.primary} />
          </View>
          <Text style={styles.brandText}>PetGuardian</Text>
        </View>
        <Text style={styles.pageTitle}>{title || `Olá, ${userName}`}</Text>
        {subtitle ? <Text style={styles.pageSubtitle}>{subtitle}</Text> : null}
      </View>

      <TouchableOpacity
        style={styles.profileBadge}
        onPress={onRightPress}
        activeOpacity={0.8}
      >
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>
            {userName.substring(0, 2).toUpperCase()}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing.sm,
      marginBottom: spacing.xs,
    },
    leftColumn: {
      flex: 1,
    },
    brandRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 4,
    },
    brandIconWrapper: {
      width: 22,
      height: 22,
      borderRadius: 7,
      backgroundColor: theme.badgePrimaryBg,
      justifyContent: 'center',
      alignItems: 'center',
    },
    brandText: {
      fontSize: 12,
      fontWeight: '700',
      color: theme.primary,
      letterSpacing: 0.3,
    },
    pageTitle: {
      fontSize: 22,
      fontWeight: '900',
      color: theme.text,
      letterSpacing: -0.5,
    },
    pageSubtitle: {
      fontSize: 13,
      color: theme.textSecondary,
      marginTop: 2,
    },
    profileBadge: {
      padding: 2,
    },
    avatarCircle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.isDark ? theme.surfaceMuted : theme.colors.neutral[900],
      borderColor: theme.border,
      borderWidth: theme.isDark ? 1 : 0,
      justifyContent: 'center',
      alignItems: 'center',
      ...shadows.lg,
      elevation: 3,
    },
    avatarText: {
      color: theme.isDark ? theme.text : '#FFFFFF',
      fontSize: 13,
      fontWeight: '800',
    },
  });