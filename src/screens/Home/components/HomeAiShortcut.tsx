import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { AppTheme, spacing, borderRadius } from '../../../constants/theme';
import { shadows } from '../../../utils/shadow';
import { useTheme, useThemedStyles } from '../../../contexts/ThemeContext';

interface HomeAiShortcutProps {
  onPress: () => void;
}

export function HomeAiShortcut({ onPress }: HomeAiShortcutProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <TouchableOpacity
      style={styles.shortcutCard}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={styles.shortcutIconBox}>
        <MaterialCommunityIcons name="robot-outline" size={22} color={theme.primary} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.shortcutTitle}>IA Assistente Preventiva</Text>
        <Text style={styles.shortcutSub}>Orientações contextuais de saúde, nutrição e rotina do pet</Text>
      </View>
      <Ionicons name="arrow-forward" size={16} color={theme.primary} />
    </TouchableOpacity>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    shortcutCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.card,
      borderRadius: borderRadius.xxl,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: theme.border,
      gap: 14,
      ...shadows.sm,
    },
    shortcutIconBox: {
      width: 44,
      height: 44,
      borderRadius: borderRadius.lg,
      backgroundColor: theme.badgePrimaryBg,
      justifyContent: 'center',
      alignItems: 'center',
    },
    textContainer: {
      flex: 1,
    },
    shortcutTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.text,
    },
    shortcutSub: {
      fontSize: 12,
      color: theme.textSecondary,
      marginTop: 2,
    },
  });

