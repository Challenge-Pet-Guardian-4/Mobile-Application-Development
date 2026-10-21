import React, { memo } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle, TouchableOpacityProps } from 'react-native';
import { shadows } from '../../utils/shadow';
import { borderRadius, AppTheme } from '../../constants/theme';
import { useThemedStyles, useTheme } from '../../contexts/ThemeContext';

interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success';
  isLoading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const CustomButton = memo(function CustomButton({
  title,
  variant = 'primary',
  isLoading = false,
  style,
  textStyle,
  icon,
  disabled,
  ...rest
}: CustomButtonProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  const getButtonStyle = () => {
    switch (variant) {
      case 'success':
        return styles.btnSuccess;
      case 'secondary':
        return styles.btnSecondary;
      case 'outline':
        return styles.btnOutline;
      case 'danger':
        return styles.btnDanger;
      default:
        return styles.btnPrimary;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'outline':
        return styles.textOutline;
      case 'secondary':
        return styles.textSecondary;
      default:
        return styles.textPrimary;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.btnBase,
        getButtonStyle(),
        (disabled || isLoading) && styles.btnDisabled,
        style,
      ]}
      activeOpacity={0.8}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'outline' ? theme.text : '#FFFFFF'} size="small" />
      ) : (
        <>
          {icon}
          <Text style={[styles.textBase, getTextStyle(), textStyle]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
});

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    btnBase: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 15,
      paddingHorizontal: 20,
      borderRadius: borderRadius.lg,
      gap: 8,
    },
    btnPrimary: {
      backgroundColor: theme.primary,
      ...shadows.sm,
      elevation: 2,
    },
    btnSecondary: {
      backgroundColor: theme.badgePrimaryBg,
    },
    btnOutline: {
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      borderColor: theme.border,
    },
    btnDanger: {
      backgroundColor: theme.colors.danger.default,
      ...shadows.sm,
      elevation: 2,
    },
    btnSuccess: {
      backgroundColor: theme.colors.success.default,
      ...shadows.sm,
      elevation: 2,
    },
    btnDisabled: {
      opacity: 0.6,
    },
    textBase: {
      fontSize: 15,
      fontWeight: '700',
      letterSpacing: 0.2,
    },
    textPrimary: {
      color: '#FFFFFF',
    },
    textSecondary: {
      color: theme.badgePrimaryText,
    },
    textOutline: {
      color: theme.text,
    },
  });
