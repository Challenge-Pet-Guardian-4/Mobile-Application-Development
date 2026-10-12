import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTrainings } from '../../../hooks/useTrainings';
import { AppTheme } from '../../../constants/theme';
import { useThemedStyles } from '../../../contexts/ThemeContext';

interface SeletorTrilhasPillsProps {
  trail: ReturnType<typeof useTrainings>['trail'];
}

export function SeletorTrilhasPills({ trail }: SeletorTrilhasPillsProps) {
  const styles = useThemedStyles(createStyles);
  const { trilhas, trilhaAtivaIndex, setTrilhaAtivaIndex } = trail;

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.trackPillsScroll}>
      {(trilhas ?? []).map((t, idx) => (
        <TouchableOpacity
          key={t.id}
          style={[styles.trackPill, trilhaAtivaIndex === idx && { backgroundColor: t.cor, borderColor: t.cor }]}
          onPress={() => setTrilhaAtivaIndex(idx)}
        >
          <Text style={[styles.trackPillText, trilhaAtivaIndex === idx && styles.trackPillTextActive]}>
            {t?.titulo}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    trackPillsScroll: {
      paddingHorizontal: 20,
      gap: 10,
      marginBottom: 20,
    },
    trackPill: {
      backgroundColor: theme.card,
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 16,
      borderWidth: 1.5,
      borderColor: theme.border,
    },
    trackPillText: {
      fontSize: 13,
      fontWeight: '700',
      color: theme.textSecondary,
    },
    trackPillTextActive: {
      color: '#FFF',
      fontWeight: '900',
    },
  });
