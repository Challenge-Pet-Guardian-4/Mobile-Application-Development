import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CustomInput } from '../../../components/CustomInput';
import { PasswordInput } from '../../../components/PasswordInput';
import { CustomButton } from '../../../components/CustomButton';
import { shadows } from '../../../utils/shadow';
import { useLoginForm } from '../../../hooks/useLoginForm';
import { useTheme, useThemedStyles } from '../../../contexts/ThemeContext';
import { AppTheme } from '../../../constants/theme';

interface LoginFormProps {
  loginState: ReturnType<typeof useLoginForm>;
}

export function LoginForm({ loginState }: LoginFormProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const {
    form,
    updateField,
    handleLogin,
    handleNavigateToRegister,
    mensagemErro,
    isPending,
  } = loginState;

  return (
    <View style={styles.formContainer}>
      <CustomInput
        label="E-mail"
        placeholder="seu@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
        value={form.email}
        onChangeText={(t) => updateField('email', t)}
        leftIcon={<Ionicons name="mail-outline" size={18} color={theme.textMuted} />}
      />

      <PasswordInput
        label="Senha"
        placeholder="Sua senha secreta"
        value={form.senha}
        onChangeText={(t) => updateField('senha', t)}
      />

      {mensagemErro && <Text style={styles.erroText}>{mensagemErro}</Text>}

      <CustomButton
        title={isPending ? 'Entrando…' : 'Entrar na Plataforma'}
        variant="primary"
        isLoading={isPending}
        disabled={isPending}
        onPress={handleLogin}
        style={{ marginTop: 6 }}
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>Ainda não tem conta? </Text>
        <TouchableOpacity onPress={handleNavigateToRegister} activeOpacity={0.7}>
          <Text style={styles.linkText}>Cadastre-se</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    formContainer: {
      backgroundColor: theme.card,
      padding: 24,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: theme.border,
      ...shadows.sm,
      elevation: 2,
    },
    erroText: {
      color: '#DC2626',
      fontSize: 13,
      fontWeight: '600',
      textAlign: 'center',
      marginBottom: 8,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 20,
      alignItems: 'center',
    },
    footerText: {
      color: theme.textSecondary,
      fontSize: 13,
    },
    linkText: {
      color: theme.primary,
      fontWeight: '800',
      fontSize: 13,
    },
  });
