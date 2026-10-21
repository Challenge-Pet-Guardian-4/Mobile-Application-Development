import React, { memo } from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps, ViewStyle } from 'react-native';
import { shadows } from '../../utils/shadow';
import { borderRadius, AppTheme } from '../../constants/theme';
import { useThemedStyles, useTheme } from '../../contexts/ThemeContext';

interface CustomInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const CustomInput = memo(function CustomInput({
  label,
  error,
  containerStyle,
  leftIcon,
  rightIcon,
  style,
  ...rest
}: CustomInputProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const hasError = !!error;

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <View style={[styles.inputWrapper, hasError && styles.inputWrapperError]}>
        {leftIcon ? <View style={styles.leftIconWrapper}>{leftIcon}</View> : null}

        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={rest.placeholderTextColor ?? theme.textMuted}
          {...rest}
        />
        
        {rightIcon ? <View style={styles.rightIconWrapper}>{rightIcon}</View> : null}
      </View>
      {hasError ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
});

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      marginBottom: 14,
      width: '100%',
    },
    label: {
      fontSize: 13,
      fontWeight: '700',
      color: theme.text,
      marginBottom: 6,
      marginLeft: 2,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.isDark ? theme.surfaceSubtle : '#FFFFFF',
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: borderRadius.lg,
      paddingHorizontal: 14,
      minHeight: 50,
      ...shadows.xs,
      elevation: 1,
    },
    inputWrapperError: {
      borderColor: theme.badgeDangerBorder,
      backgroundColor: theme.badgeDangerBg,
    },
    input: {
      flex: 1,
      fontSize: 14,
      color: theme.text,
      paddingVertical: 10,
    },
    leftIconWrapper: {
      marginRight: 8,
    },
    rightIconWrapper: {
      marginLeft: 8,
    },
    errorText: {
      color: theme.badgeDangerText,
      fontSize: 11,
      marginTop: 4,
      marginLeft: 2,
    },
  });
