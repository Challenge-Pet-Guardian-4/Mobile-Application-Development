import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PetResponse } from '../../../types/pet';
import { AppTheme } from '../../../constants/theme';
import { useTheme, useThemedStyles } from '../../../contexts/ThemeContext';

export interface PetAvatarCarouselProps {
  pets: PetResponse[];
  selectedPetId?: number;
  onSelectPet: (petId: number) => void;
}

export function PetAvatarCarousel({ pets, selectedPetId, onSelectPet }: PetAvatarCarouselProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  if (pets.length === 0) {
    return null;
  }

  return (
    <View style={styles.carrosselContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.listaDePets}>
        {pets.map((pet) => {
          const isSelected = selectedPetId === pet.id;

          return (
            <TouchableOpacity
              key={pet.id}
              onPress={() => onSelectPet(pet.id)}
              style={styles.itemPetCarrossel}
              activeOpacity={0.8}
            >
              <View style={[styles.miniAvatarBorda, isSelected && styles.miniAvatarSelecionado]}>
                <MaterialCommunityIcons
                  name="paw"
                  size={20}
                  color={isSelected ? theme.primary : theme.textMuted}
                />
              </View>
              <Text
                style={[styles.miniAvatarTexto, isSelected && styles.miniAvatarTextoSelecionado]}
                numberOfLines={1}
              >
                {pet.nome.split(' ')[0]}
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
    carrosselContainer: {
      paddingVertical: 12,
      backgroundColor: theme.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    listaDePets: {
      paddingHorizontal: 20,
      gap: 12,
      alignItems: 'center',
    },
    itemPetCarrossel: {
      alignItems: 'center',
      gap: 4,
    },
    miniAvatarBorda: {
      width: 44,
      height: 44,
      borderRadius: 22,
      borderWidth: 1.5,
      borderColor: theme.border,
      backgroundColor: theme.surfaceSubtle,
      alignItems: 'center',
      justifyContent: 'center',
    },
    miniAvatarSelecionado: {
      borderColor: theme.primary,
      backgroundColor: theme.badgePrimaryBg,
      borderWidth: 2,
    },
    miniAvatarTexto: {
      fontSize: 11,
      color: theme.textSecondary,
      fontWeight: '600',
      maxWidth: 55,
    },
    miniAvatarTextoSelecionado: {
      color: theme.primary,
      fontWeight: '800',
    },
  });
