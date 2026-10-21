import React from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppTheme, spacing, borderRadius } from '../../../constants/theme';
import { shadows } from '../../../utils/shadow';
import { useHomeData } from '../../../hooks/useHomeData';
import { useTheme, useThemedStyles } from '../../../contexts/ThemeContext';

interface HomePetSelectorProps {
  pets: ReturnType<typeof useHomeData>['pets'];
}

export function HomePetSelector({ pets }: HomePetSelectorProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { list, active, select } = pets;

  if ((list?.length ?? 0) === 0) {
    return null;
  }

  return (
    <View style={styles.petSelectorContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.petsScroll}>
        {list?.map((pet) => {
          const isSelected = active?.id === pet?.id;
          return (
            <TouchableOpacity
              key={pet?.id}
              style={[styles.petPill, isSelected && styles.petPillSelected]}
              onPress={() => pet?.id && select(pet.id)}
              activeOpacity={0.8}
            >
              <View style={[styles.petAvatarWrapper, isSelected && styles.petAvatarWrapperSelected]}>
                <MaterialCommunityIcons
                  name="paw"
                  size={18}
                  color={isSelected ? '#FFFFFF' : theme.textSecondary}
                />
              </View>
              <View style={styles.petInfoContainer}>
                <Text
                  style={[styles.petPillName, isSelected && styles.petPillNameSelected]}
                  numberOfLines={1}
                >
                  {pet?.nome}
                </Text>
                <Text
                  style={[styles.petPillBreed, isSelected && styles.petPillBreedSelected]}
                  numberOfLines={1}
                >
                  {pet?.raca}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    petSelectorContainer: {
      marginBottom: 4,
    },
    petsScroll: {
      gap: 10,
      paddingVertical: 2,
    },
    petPill: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.card,
      borderColor: theme.border,
      borderWidth: 1,
      paddingVertical: spacing.xs,
      paddingHorizontal: 12,
      borderRadius: borderRadius.xl,
      gap: 10,
      ...shadows.sm,
    },
    petPillSelected: {
      backgroundColor: theme.pillActiveBg,
      borderColor: theme.pillActiveBorder,
    },
    petAvatarWrapper: {
      width: 32,
      height: 32,
      borderRadius: borderRadius.md,
      backgroundColor: theme.surfaceMuted,
      justifyContent: 'center',
      alignItems: 'center',
    },
    petAvatarWrapperSelected: {
      backgroundColor: theme.primary,
    },
    petInfoContainer: {
      flex: 1,
    },
    petPillName: {
      fontSize: 13,
      fontWeight: '700',
      color: theme.text,
    },
    petPillNameSelected: {
      color: theme.pillActiveText,
    },
    petPillBreed: {
      fontSize: 11,
      color: theme.textSecondary,
      fontWeight: '500',
    },
    petPillBreedSelected: {
      color: 'rgba(255, 255, 255, 0.7)',
    },
  });

