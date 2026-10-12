import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme, useThemedStyles } from '../../contexts/ThemeContext';
import { AppTheme } from '../../constants/theme';
import { PetOption } from '../../types/pet';


export interface PetSelectorProps {
  label?: string;
  pets: PetOption[];
  selectedPetId?: number;
  onSelectPet: (petId: number) => void;
  containerStyle?: ViewStyle;
}

export const PetSelector = memo(function PetSelector({
  label = 'Para qual Pet?',
  pets,
  selectedPetId,
  onSelectPet,
  containerStyle,
}: PetSelectorProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  if (pets.length === 0) {
    return (
      <View style={[styles.container, containerStyle]}>
        {label ? <Text style={styles.label}>{label}</Text> : null}
        <View style={styles.emptyNotice}>
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={16}
            color={theme.badgeWarningText}
            style={{ marginRight: 6 }}
          />
          <Text style={styles.emptyNoticeText}>
            Nenhum pet cadastrado para vincular a esta tarefa.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.chipsContainer}>
        {pets.map((pet) => {
          const isSelected = selectedPetId === pet.id;
          return (
            <TouchableOpacity
              key={pet.id}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => onSelectPet(pet.id)}
              activeOpacity={0.75}
            >
              <MaterialCommunityIcons
                name="paw"
                size={14}
                color={isSelected ? '#FFFFFF' : theme.textSecondary}
                style={{ marginRight: 6 }}
              />
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {pet.nome}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
});

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      marginBottom: 16,
    },
    emptyNotice: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      backgroundColor: theme.badgeWarningBg,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.badgeWarningBorder,
    },
    emptyNoticeText: {
      fontSize: 12,
      color: theme.badgeWarningText,
      fontWeight: '600',
      flex: 1,
    },
    label: {
      fontSize: 13,
      fontWeight: '700',
      color: theme.text,
      marginBottom: 8,
      marginTop: 4,
    },
    chipsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    chip: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 14,
      paddingVertical: 10,
      backgroundColor: theme.surfaceMuted,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    chipSelected: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    chipText: {
      fontSize: 13,
      fontWeight: '700',
      color: theme.textSecondary,
    },
    chipTextSelected: {
      color: '#FFFFFF',
    },
  });
