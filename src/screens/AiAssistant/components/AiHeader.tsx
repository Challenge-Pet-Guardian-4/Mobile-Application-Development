import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppTheme } from '../../../constants/theme';
import { useTheme, useThemedStyles } from '../../../contexts/ThemeContext';

interface AiHeaderProps {
  onGoBack: () => void;
  onClearChat?: () => void;
  onOpenHistory?: () => void;
  hasMessages?: boolean;
}

export function AiHeader({ onGoBack, onClearChat, onOpenHistory, hasMessages }: AiHeaderProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.headerPad}>
      <View style={styles.headerRow}>
        <TouchableOpacity
          onPress={onGoBack}
          style={styles.btnVoltarTop}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={16} color={theme.text} />
          <Text style={styles.btnVoltarText}>Voltar para Início</Text>
        </TouchableOpacity>

        <View style={styles.rightActions}>
          {onOpenHistory && (
            <TouchableOpacity
              onPress={onOpenHistory}
              style={styles.btnHistorico}
              activeOpacity={0.7}
            >
              <Ionicons name="time-outline" size={14} color={theme.textSecondary} />
              <Text style={styles.btnHistoricoText}>Histórico</Text>
            </TouchableOpacity>
          )}

          {hasMessages && onClearChat && (
            <TouchableOpacity
              onPress={onClearChat}
              style={styles.btnNovaDuvida}
              activeOpacity={0.7}
            >
              <Ionicons name="sparkles-outline" size={14} color={theme.primary} />
              <Text style={styles.btnNovaDuvidaText}>Nova Dúvida</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    headerPad: {
      paddingHorizontal: 16,
      paddingTop: Platform.OS === 'ios' ? 50 : 25,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    btnVoltarTop: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingVertical: 6,
      paddingHorizontal: 10,
      borderRadius: 12,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
    },
    btnVoltarText: {
      fontSize: 12,
      fontWeight: '700',
      color: theme.text,
    },
    rightActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    btnHistorico: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingVertical: 6,
      paddingHorizontal: 9,
      borderRadius: 12,
      backgroundColor: theme.surfaceMuted,
      borderWidth: 1,
      borderColor: theme.border,
    },
    btnHistoricoText: {
      fontSize: 12,
      fontWeight: '700',
      color: theme.textSecondary,
    },
    btnNovaDuvida: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingVertical: 6,
      paddingHorizontal: 9,
      borderRadius: 12,
      backgroundColor: theme.badgePrimaryBg,
      borderWidth: 1,
      borderColor: theme.badgePrimaryBorder,
    },
    btnNovaDuvidaText: {
      fontSize: 12,
      fontWeight: '700',
      color: theme.badgePrimaryText,
    },
  });
