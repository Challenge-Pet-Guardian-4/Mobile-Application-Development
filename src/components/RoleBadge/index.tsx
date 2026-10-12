import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { UsuarioRole } from '../../types/user';
import { useTheme, useThemedStyles } from '../../contexts/ThemeContext';
import { AppTheme } from '../../constants/theme';

interface RoleBadgeProps {
  role?: UsuarioRole;
  size?: 'sm' | 'md';
}

export function RoleBadge({ role = 'PREMIUM', size = 'sm' }: RoleBadgeProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const isPremium = role === 'PREMIUM';
  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.badgeBase,
        isPremium ? styles.premiumBadge : styles.comumBadge,
        isSmall ? styles.badgeSmall : styles.badgeMedium,
      ]}
    >
      {isPremium ? (
        <MaterialCommunityIcons
          name="crown"
          size={isSmall ? 13 : 15}
          color={theme.badgeWarningText}
        />
      ) : (
        <Ionicons
          name="paw"
          size={isSmall ? 12 : 14}
          color={theme.badgePrimaryText}
        />
      )}
      <Text
        style={[
          styles.badgeTextBase,
          isPremium ? styles.premiumText : styles.comumText,
          isSmall ? styles.textSmall : styles.textMedium,
        ]}
      >
        {isPremium ? 'Tutor Premium ⭐' : 'Tutor Comum'}
      </Text>
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    badgeBase: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 10,
      alignSelf: 'flex-start',
    },
    badgeSmall: {
      paddingVertical: 3,
      paddingHorizontal: 10,
      gap: 4,
    },
    badgeMedium: {
      paddingVertical: 5,
      paddingHorizontal: 12,
      gap: 6,
    },
    premiumBadge: {
      backgroundColor: theme.badgeWarningBg,
      borderWidth: 1,
      borderColor: theme.badgeWarningBorder,
    },
    comumBadge: {
      backgroundColor: theme.badgePrimaryBg,
      borderWidth: 1,
      borderColor: theme.badgePrimaryBorder,
    },
    badgeTextBase: {
      fontWeight: '800',
    },
    textSmall: {
      fontSize: 11,
    },
    textMedium: {
      fontSize: 12,
    },
    premiumText: {
      color: theme.badgeWarningText,
    },
    comumText: {
      color: theme.badgePrimaryText,
    },
  });
