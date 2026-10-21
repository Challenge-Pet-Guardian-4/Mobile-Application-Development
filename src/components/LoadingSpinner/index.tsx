import React, { memo, useState, useEffect } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useThemedStyles, useTheme } from '../../contexts/ThemeContext';
import { AppTheme } from '../../constants/theme';

interface LoadingSpinnerProps {
  message?: string;
  color?: string;
  size?: 'small' | 'large';
  showCloudNotice?: boolean;
}

export const LoadingSpinner = memo(function LoadingSpinner({
  message = 'Carregando dados...',
  color,
  size = 'large',
  showCloudNotice = true,
}: LoadingSpinnerProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const [isLongWait, setIsLongWait] = useState(false);
  const spinnerColor = color || theme.primary;

  useEffect(() => {
    if (!showCloudNotice) {
      return;
    }
    const timer = setTimeout(() => {
      setIsLongWait(true);
    }, 3500);
    return () => clearTimeout(timer);
  }, [showCloudNotice]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={spinnerColor} />
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {isLongWait ? (
        <Text style={styles.cloudNotice}>
          O servidor em nuvem pode levar alguns segundos para inicializar...
        </Text>
      ) : null}
    </View>
  );
});

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
      gap: 8,
      backgroundColor: theme.background,
    },
    message: {
      fontSize: 14,
      color: theme.textSecondary,
      fontWeight: '600',
      textAlign: 'center',
    },
    cloudNotice: {
      fontSize: 11,
      color: theme.textMuted,
      textAlign: 'center',
      marginTop: 4,
      lineHeight: 15,
    },
  });
