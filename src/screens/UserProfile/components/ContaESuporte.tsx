import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { shadows } from '../../../utils/shadow';
import { APP_VERSION_INFO } from '../../../config/version';
import { useTheme } from '../../../hooks/useTheme';

interface ContaESuporteProps {
  onOpenFaq: () => void;
  onOpenTerms: () => void;
  onOpenSobreApp: () => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
}

export function ContaESuporte({
  onOpenFaq,
  onOpenTerms,
  onOpenSobreApp,
  onLogout,
  onDeleteAccount,
}: ContaESuporteProps) {
  const { isDark, toggleTheme, theme } = useTheme();

  return (
    <View style={[styles.menuBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Text style={[styles.menuSectionTitle, { color: theme.text }]}>Conta & Suporte</Text>

      {/* Alternador de Tema Claro / Escuro (Penalidade VI do Edital) */}
      <TouchableOpacity style={[styles.menuItem, { borderBottomColor: theme.borderSubtle }]} onPress={toggleTheme} activeOpacity={0.7}>
        <View style={[styles.menuIconWrapper, { backgroundColor: isDark ? '#312E81' : '#FEF3C7' }]}>
          <Ionicons
            name={isDark ? 'moon' : 'sunny'}
            size={20}
            color={isDark ? '#A5B4FC' : '#D97706'}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.menuText, { color: theme.text }]}>Tema do Aplicativo</Text>
          <Text style={[styles.menuSubText, { color: theme.textSecondary }]}>
            {isDark ? 'Modo Escuro Ativado 🌙' : 'Modo Claro Ativado ☀️'}
          </Text>
        </View>
        <View style={[styles.themePill, { backgroundColor: isDark ? '#1E1B4B' : '#FEF9C3' }]}>
          <Text style={[styles.themePillText, { color: isDark ? '#C7D2FE' : '#B45309' }]}>
            {isDark ? 'Escuro' : 'Claro'}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Sobre o App - Requisito Avaliativo da Sprint 4 (Publicação & Commit Hash) */}
      <TouchableOpacity style={[styles.menuItem, { borderBottomColor: theme.borderSubtle }]} onPress={onOpenSobreApp} activeOpacity={0.7}>
        <View style={[styles.menuIconWrapper, { backgroundColor: isDark ? '#1E3A8A' : '#EFF6FF' }]}>
          <Ionicons name="information-circle-outline" size={20} color="#2563EB" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.menuText, { color: theme.text }]}>Sobre o PetGuardian</Text>
          <Text style={[styles.menuSubText, { color: theme.textSecondary }]}>Versão 1.0.0 • Commit #{APP_VERSION_INFO.shortCommitHash}</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
      </TouchableOpacity>

      <TouchableOpacity style={[styles.menuItem, { borderBottomColor: theme.borderSubtle }]} onPress={onOpenFaq} activeOpacity={0.7}>
        <View style={[styles.menuIconWrapper, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }]}>
          <Ionicons name="help-circle-outline" size={20} color={isDark ? '#94A3B8' : '#475569'} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.menuText, { color: theme.text }]}>Perguntas Frequentes (FAQ)</Text>
          <Text style={[styles.menuSubText, { color: theme.textSecondary }]}>Dúvidas sobre o funcionamento</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
      </TouchableOpacity>

      <TouchableOpacity style={[styles.menuItem, { borderBottomColor: theme.borderSubtle }]} onPress={onOpenTerms} activeOpacity={0.7}>
        <View style={[styles.menuIconWrapper, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }]}>
          <Ionicons name="document-text-outline" size={20} color={isDark ? '#94A3B8' : '#475569'} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.menuText, { color: theme.text }]}>Termos de Uso & Privacidade</Text>
          <Text style={[styles.menuSubText, { color: theme.textSecondary }]}>Diretrizes do ecossistema Clyvo</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
      </TouchableOpacity>

      <TouchableOpacity style={[styles.menuItem, { borderBottomColor: theme.borderSubtle }]} onPress={onLogout} activeOpacity={0.7}>
        <View style={[styles.menuIconWrapper, { backgroundColor: isDark ? '#450A0A' : '#FEF2F2' }]}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.menuText, { color: '#EF4444' }]}>Encerrar Sessão (Logout)</Text>
          <Text style={[styles.menuSubText, { color: theme.textSecondary }]}>Desconectar deste dispositivo</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]} onPress={onDeleteAccount} activeOpacity={0.7}>
        <View style={[styles.menuIconWrapper, { backgroundColor: isDark ? '#4C0519' : '#FFF1F2' }]}>
          <Ionicons name="trash-outline" size={20} color="#BE123C" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.menuText, { color: '#BE123C' }]}>Excluir Minha Conta</Text>
          <Text style={[styles.menuSubText, { color: theme.textSecondary }]}>Remover cadastro e dados permanentemente</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  menuBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.8)',
    ...shadows.sm,
  },
  menuSectionTitle: { fontSize: 15, fontWeight: '700', color: '#0F172A', marginBottom: 12 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 12,
  },
  menuIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuText: { fontSize: 14, fontWeight: '600', color: '#1E293B' },
  menuSubText: { fontSize: 11, color: '#94A3B8', marginTop: 1 },
  themePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  themePillText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
