import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CustomInput } from '../../../components/CustomInput';
import { PasswordInput } from '../../../components/PasswordInput';
import { CustomButton } from '../../../components/CustomButton';
import { shadows } from '../../../utils/shadow';
import { useRegisterForm } from '../../../hooks/useRegisterForm';
import { useTheme, useThemedStyles } from '../../../contexts/ThemeContext';
import { AppTheme } from '../../../constants/theme';

interface RegisterFormProps {
  registerState: ReturnType<typeof useRegisterForm>;
}

export function RegisterForm({ registerState }: RegisterFormProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const {
    form,
    updateField,
    updateDdd,
    updateTelefone,
    updateCep,
    handleRegister,
    handleGoBack,
    erroExibido,
    isPending,
  } = registerState;

  return (
    <View style={styles.formContainer}>
      <CustomInput
        label="Nome Completo"
        placeholder="Ex: Carlos Eduardo"
        maxLength={60}
        value={form.nome}
        onChangeText={(t) => updateField('nome', t)}
        leftIcon={<Ionicons name="person-outline" size={18} color={theme.textMuted} />}
      />

      <CustomInput
        label="E-mail"
        placeholder="seu@email.com"
        keyboardType="email-address"
        autoCapitalize="none"
        maxLength={80}
        value={form.email}
        onChangeText={(t) => updateField('email', t)}
        leftIcon={<Ionicons name="mail-outline" size={18} color={theme.textMuted} />}
      />

      <View style={styles.row}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <CustomInput
            label="DDD"
            placeholder="11"
            keyboardType="numeric"
            maxLength={2}
            value={form.ddd}
            onChangeText={updateDdd}
          />
        </View>
        <View style={{ flex: 3 }}>
          <CustomInput
            label="Telefone"
            placeholder="987654321"
            keyboardType="numeric"
            maxLength={9}
            value={form.numeroTelefone}
            onChangeText={updateTelefone}
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={{ flex: 2, marginRight: 8 }}>
          <CustomInput
            label="CEP"
            placeholder="07749-000"
            keyboardType="numeric"
            maxLength={9}
            value={form.cep}
            onChangeText={updateCep}
          />
        </View>
        <View style={{ flex: 1 }}>
          <CustomInput
            label="Número"
            placeholder="100"
            maxLength={10}
            value={form.numero}
            onChangeText={(t) => updateField('numero', t)}
          />
        </View>
      </View>

      <PasswordInput
        label="Senha"
        placeholder="Mínimo 6 caracteres"
        maxLength={64}
        value={form.senha}
        onChangeText={(t) => updateField('senha', t)}
      />

      <PasswordInput
        label="Confirmar Senha"
        placeholder="Repita a senha"
        maxLength={64}
        value={form.confirmarSenha}
        onChangeText={(t) => updateField('confirmarSenha', t)}
      />

      {erroExibido ? <Text style={styles.erroText}>{erroExibido}</Text> : null}

      <CustomButton
        title={isPending ? 'Cadastrando…' : 'Concluir Cadastro'}
        variant="success"
        isLoading={isPending}
        disabled={isPending}
        onPress={handleRegister}
        style={{ marginTop: 6 }}
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>Já faz parte de uma família? </Text>
        <TouchableOpacity onPress={handleGoBack} activeOpacity={0.7}>
          <Text style={styles.linkText}>Fazer Login</Text>
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
    row: {
      flexDirection: 'row',
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
