import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { shadows } from '../../../utils/shadow';
import { useAiAssistantScreen } from '../../../hooks/useAiAssistantScreen';
import { AppTheme } from '../../../constants/theme';
import { useTheme, useThemedStyles } from '../../../contexts/ThemeContext';

interface AiPreventiveInsightsProps {
  insights: ReturnType<typeof useAiAssistantScreen>['insights'];
}

export function AiPreventiveInsights({ insights }: AiPreventiveInsightsProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const hasInsights = (insights?.data?.length ?? 0) > 0;
  if (!insights?.isLoading && !hasInsights) {
    return null;
  }

  return (
    <View style={styles.insightsSection}>
      <View style={styles.insightsHeader}>
        <MaterialCommunityIcons name="lightbulb-on-outline" size={18} color={theme.primary} />
        <Text style={styles.insightsTitle}>Recomendações Preventivas</Text>
      </View>

      {insights?.isLoading ? (
        <LoadingSpinner message="Analisando histórico..." size="small" />
      ) : (
        insights?.data?.map((ins, idx) => (
          <View key={idx} style={styles.insightCard}>
            <Text style={styles.insightCardTitle}>{ins?.titulo}</Text>
            <Text style={styles.insightCardDesc}>{ins?.descricao}</Text>
          </View>
        ))
      )}
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    insightsSection: {
      backgroundColor: theme.card,
      borderRadius: 22,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.border,
      gap: 10,
      ...shadows.xs,
      elevation: 1,
    },
    insightsHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 2,
    },
    insightsTitle: {
      fontSize: 14,
      fontWeight: '800',
      color: theme.text,
    },
    insightCard: {
      backgroundColor: theme.surfaceSubtle,
      borderRadius: 14,
      padding: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    insightCardTitle: {
      fontSize: 13,
      fontWeight: '800',
      color: theme.primary,
      marginBottom: 2,
    },
    insightCardDesc: {
      fontSize: 12,
      color: theme.textSecondary,
      lineHeight: 18,
    },
  });
