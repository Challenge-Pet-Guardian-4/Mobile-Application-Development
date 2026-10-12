import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAiAssistantScreen } from '../../../hooks/useAiAssistantScreen';
import { AppTheme } from '../../../constants/theme';
import { useThemedStyles } from '../../../contexts/ThemeContext';

interface AiPetContextSelectorProps {
  pet: ReturnType<typeof useAiAssistantScreen>['pet'];
}

export function AiPetContextSelector({ pet }: AiPetContextSelectorProps) {
  const styles = useThemedStyles(createStyles);
  if ((pet?.pets?.length ?? 0) === 0) return null;

  return (
    <View style={styles.petContextBar}>
      <Text style={styles.petContextLabel}>Contexto:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        {pet?.pets?.map((p) => {
          const isSelected = pet?.activePet?.id === p.id;
          return (
            <TouchableOpacity
              key={p.id}
              style={[
                styles.petContextChip,
                isSelected && styles.petContextChipSelected,
              ]}
              onPress={() => pet.setSelectedPetId(p.id)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.petContextChipText,
                  isSelected && styles.petContextChipTextSelected,
                ]}
              >
                🐾 {p?.nome}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    petContextBar: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    petContextLabel: {
      fontSize: 12,
      fontWeight: '700',
      color: theme.textSecondary,
    },
    petContextChip: {
      backgroundColor: theme.card,
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.border,
    },
    petContextChipSelected: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    petContextChipText: {
      fontSize: 12,
      fontWeight: '700',
      color: theme.textSecondary,
    },
    petContextChipTextSelected: {
      color: '#FFFFFF',
      fontWeight: '800',
    },
  });
