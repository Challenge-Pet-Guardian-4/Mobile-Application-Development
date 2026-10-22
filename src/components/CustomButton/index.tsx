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

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'success';

const BUTTON_STYLE_KEY: Record<ButtonVariant, 'btnPrimary' | 'btnSecondary' | 'btnOutline' | 'btnDanger' | 'btnSuccess'> = {
  primary: 'btnPrimary',
  secondary: 'btnSecondary',
  outline: 'btnOutline',
  danger: 'btnDanger',
  success: 'btnSuccess',
};

const TEXT_STYLE_KEY: Record<ButtonVariant, 'textPrimary' | 'textSecondary' | 'textOutline'> = {
  primary: 'textPrimary',
  secondary: 'textSecondary',
  outline: 'textOutline',
  danger: 'textPrimary',
  success: 'textPrimary',
};

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

  const buttonStyle = styles[BUTTON_STYLE_KEY[variant] ?? 'btnPrimary'];
  const textVariantStyle = styles[TEXT_STYLE_KEY[variant] ?? 'textPrimary'];

  return (
    <TouchableOpacity
      style={[
        styles.btnBase,
        buttonStyle,
        (disabled || isLoading) && styles.btnDisabled,
        style,
      ]}
      activeOpacity={0.8}
      disabled={disabled || isLoading}
      accessibilityRole="button"
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === 'outline' ? theme.text : '#FFFFFF'} size="small" />
      ) : (
        <>
          {icon ? icon : null}
          <Text style={[styles.textBase, textVariantStyle, textStyle]}>{title}</Text>
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
