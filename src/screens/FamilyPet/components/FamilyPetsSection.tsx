import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { PetCard } from './PetCard';
import { PaginationControls } from '../../../components/PaginationControls';
import { AppTheme, spacing, borderRadius } from '../../../constants/theme';
import { shadows } from '../../../utils/shadow';
import { useFamilyCare } from '../../../hooks/useFamilyCare';
import { useTheme, useThemedStyles } from '../../../contexts/ThemeContext';

interface FamilyPetsSectionProps {
  family: ReturnType<typeof useFamilyCare>['family'];
  onAddPet: () => void;
  onSelectPet: (petId: number) => void;
}

export function FamilyPetsSection({ family, onAddPet, onSelectPet }: FamilyPetsSectionProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { pets, petsExibidos, petsPagination } = family;
  const hasPets = (pets?.length ?? 0) > 0;

  return (
    <View style={styles.sectionBox}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Animais da Família</Text>
        <TouchableOpacity style={styles.btnAddPet} onPress={onAddPet} activeOpacity={0.8}>
          <Ionicons name="add" size={16} color='#FFFFFF' />
          <Text style={styles.btnAddPetText}>Adicionar Pet</Text>
        </TouchableOpacity>
      </View>

      {!hasPets ? (
        <View style={styles.emptyBox}>
          <MaterialCommunityIcons name="paw-off" size={28} color={theme.textMuted} />
          <Text style={styles.emptyTitle}>Nenhum pet cadastrado</Text>
          <Text style={styles.emptySub}>Clique no botão acima para adicionar o primeiro pet!</Text>
        </View>
      ) : (
        <>
          <View style={styles.petsGrid}>
            {(petsExibidos ?? []).map((pet) => (
              <PetCard
                key={pet.id}
                pet={pet}
                isResponsavelPrincipal={Boolean(pet?.isResponsavelPrincipal)}
                tarefasCount={pet?.tarefasCount ?? 0}
                pontosTotais={pet?.pontosTotais ?? 0}
                onPress={() => onSelectPet(pet.id)}
              />
            ))}
          </View>

          <PaginationControls
            currentPage={petsPagination?.currentPage ?? 0}
            totalPages={petsPagination?.totalPages ?? 1}
            totalElements={petsPagination?.totalElements ?? 0}
            onPageChange={petsPagination.onPageChange}
          />
        </>
      )}
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    sectionBox: {
      backgroundColor: theme.card,
      borderRadius: borderRadius.xxl,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: theme.border,
      ...shadows.sm,
      elevation: 2,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '800',
      color: theme.text,
    },
    btnAddPet: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.success.default,
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
      borderRadius: borderRadius.md,
      gap: 4,
    },
    btnAddPetText: {
      color: '#FFFFFF',
      fontWeight: '800',
      fontSize: 12,
    },
    emptyBox: {
      alignItems: 'center',
      padding: spacing.lg,
      gap: 4,
      backgroundColor: theme.surfaceSubtle,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.border,
      borderStyle: 'dashed',
    },
    emptyTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.text,
    },
    emptySub: {
      fontSize: 12,
      color: theme.textSecondary,
      textAlign: 'center',
    },
    petsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
  });
