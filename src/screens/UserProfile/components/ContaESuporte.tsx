import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { shadows } from '../../../utils/shadow';
import { APP_VERSION_INFO } from '../../../config/version';
import { useTheme, useThemedStyles } from '../../../contexts/ThemeContext';
import { AppTheme, colors } from '../../../constants/theme';

interface ContaESuporteProps {
  onOpenNotifications: () => void;
  notificationSubtitle?: string;
  onOpenSobreApp: () => void;
  onOpenFaq: () => void;
  onOpenTerms: () => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
}

export function ContaESuporte({
  onOpenNotifications,
  notificationSubtitle,
  onOpenSobreApp,
  onOpenFaq,
  onOpenTerms,
  onLogout,
  onDeleteAccount,
}: ContaESuporteProps) {
  const { isDark, toggleTheme, theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.menuBox}>
      <Text style={styles.menuSectionTitle}>Conta & Suporte</Text>

      {/* Alternador de Tema Claro / Escuro */}
      <TouchableOpacity
        style={styles.menuItem}
        onPress={toggleTheme}
        activeOpacity={0.7}
      >
        <View style={styles.themeIconWrapper}>
          <Ionicons
            name={isDark ? 'moon' : 'sunny'}
            size={20}
            color={isDark ? '#A5B4FC' : '#D97706'}
          />
        </View>
        <View style={styles.itemContent}>
          <Text style={styles.menuText}>Tema do Aplicativo</Text>
          <Text style={styles.menuSubText}>
            {isDark ? 'Modo Escuro Ativado 🌙' : 'Modo Claro Ativado ☀️'}
          </Text>
        </View>
        <View style={styles.themePill}>
          <Text style={styles.themePillText}>
            {isDark ? 'Escuro' : 'Claro'}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Lembretes e Notificações Customizáveis */}
      <TouchableOpacity
        style={styles.menuItem}
        onPress={onOpenNotifications}
        activeOpacity={0.7}
      >
        <View style={styles.menuIconWrapperPrimary}>
          <Ionicons name="notifications-outline" size={20} color={theme.primary} />
        </View>
        <View style={styles.itemContent}>
          <Text style={styles.menuText}>Lembretes & Notificações</Text>
          <Text style={styles.menuSubText}>
            {notificationSubtitle || 'Configure avisos prévios de tarefas'}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
      </TouchableOpacity>

      {/* Sobre o PetGuardian - Versão e Equipe FIAP */}
      <TouchableOpacity
        style={styles.menuItem}
        onPress={onOpenSobreApp}
        activeOpacity={0.7}
      >
        <View style={styles.menuIconWrapperMuted}>
          <Ionicons name="information-circle-outline" size={20} color={theme.primary} />
        </View>
        <View style={styles.itemContent}>
          <Text style={styles.menuText}>Sobre o PetGuardian</Text>
          <Text style={styles.menuSubText}>
            v{APP_VERSION_INFO.version} • Commit #{APP_VERSION_INFO.shortCommitHash}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
      </TouchableOpacity>

      {/* FAQ */}
      <TouchableOpacity
        style={styles.menuItem}
        onPress={onOpenFaq}
        activeOpacity={0.7}
      >
        <View style={styles.menuIconWrapperMuted}>
          <Ionicons name="help-circle-outline" size={20} color={theme.textSecondary} />
        </View>
        <View style={styles.itemContent}>
          <Text style={styles.menuText}>Perguntas Frequentes (FAQ)</Text>
          <Text style={styles.menuSubText}>Dúvidas sobre o funcionamento</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
      </TouchableOpacity>

      {/* Termos de Uso */}
      <TouchableOpacity
        style={styles.menuItem}
        onPress={onOpenTerms}
        activeOpacity={0.7}
      >
        <View style={styles.menuIconWrapperMuted}>
          <Ionicons name="document-text-outline" size={20} color={theme.textSecondary} />
        </View>
        <View style={styles.itemContent}>
          <Text style={styles.menuText}>Termos de Uso & Privacidade</Text>
          <Text style={styles.menuSubText}>Diretrizes do ecossistema Clyvo</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
      </TouchableOpacity>

      {/* Logout */}
      <TouchableOpacity
        style={styles.menuItem}
        onPress={onLogout}
        activeOpacity={0.7}
      >
        <View style={styles.menuIconWrapperDanger}>
          <Ionicons name="log-out-outline" size={20} color={colors.danger.default} />
        </View>
        <View style={styles.itemContent}>
          <Text style={styles.menuTextDanger}>Encerrar Sessão (Logout)</Text>
          <Text style={styles.menuSubText}>Desconectar deste dispositivo</Text>
        </View>
      </TouchableOpacity>

      {/* Exclusão de Conta */}
      <TouchableOpacity style={styles.menuItemLast} onPress={onDeleteAccount} activeOpacity={0.7}>
        <View style={styles.menuIconWrapperDestructive}>
          <Ionicons name="trash-outline" size={20} color="#BE123C" />
        </View>
        <View style={styles.itemContent}>
          <Text style={styles.menuTextDestructive}>Excluir Minha Conta</Text>
          <Text style={styles.menuSubText}>Remover cadastro e dados permanentemente</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    menuBox: {
      backgroundColor: theme.card,
      borderRadius: 20,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.border,
      ...shadows.sm,
    },
    menuSectionTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: theme.text,
      marginBottom: 12,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.borderSubtle,
      gap: 12,
    },
    menuItemLast: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 0,
      gap: 12,
    },
    itemContent: {
      flex: 1,
    },
    themeIconWrapper: {
      width: 36,
      height: 36,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.isDark ? '#312E81' : '#FEF3C7',
    },
    menuIconWrapperPrimary: {
      width: 36,
      height: 36,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.badgePrimaryBg,
    },
    menuIconWrapperMuted: {
      width: 36,
      height: 36,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.surfaceMuted,
    },
    menuIconWrapperDanger: {
      width: 36,
      height: 36,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.isDark ? '#450A0A' : '#FEF2F2',
    },
    menuIconWrapperDestructive: {
      width: 36,
      height: 36,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.isDark ? '#4C0519' : '#FFF1F2',
    },
    menuText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.text,
    },
    menuTextDanger: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.danger.default,
    },
    menuTextDestructive: {
      fontSize: 14,
      fontWeight: '600',
      color: '#BE123C',
    },
    menuSubText: {
      fontSize: 11,
      color: theme.textSecondary,
      marginTop: 1,
    },
    themePill: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      backgroundColor: theme.isDark ? '#1E1B4B' : '#FEF9C3',
    },
    themePillText: {
      fontSize: 11,
      fontWeight: '700',
      color: theme.isDark ? '#C7D2FE' : '#B45309',
    },
  });

