import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { shadows } from '../../utils/shadow';
import { useTheme, useThemedStyles } from '../../contexts/ThemeContext';
import { AppTheme } from '../../constants/theme';

interface AuthHeaderProps {
  title?: string;
  subtitle: string;
  onBack?: () => void;
  showIcon?: boolean;
}

export function AuthHeader({
  title = 'PetGuardian',
  subtitle,
  onBack,
  showIcon = true,
}: AuthHeaderProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.container}>
      {onBack && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
        >
          <Ionicons name="arrow-back" size={20} color={theme.text} />
        </TouchableOpacity>
      )}

      <View style={styles.headerContent}>
        {showIcon && (
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name="paw" size={28} color={theme.primary} />
          </View>
        )}
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      width: '100%',
      marginBottom: 20,
    },
    backButton: {
      alignSelf: 'flex-start',
      padding: 10,
      borderRadius: 14,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      marginBottom: 16,
      ...shadows.sm,
      elevation: 1,
    },
    headerContent: {
      alignItems: 'center',
    },
    iconCircle: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: theme.badgePrimaryBg,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    title: {
      fontSize: 26,
      fontWeight: '900',
      color: theme.text,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 13,
      color: theme.textSecondary,
      textAlign: 'center',
      paddingHorizontal: 15,
    },
  });
