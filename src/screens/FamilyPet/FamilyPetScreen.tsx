import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FamilyStackParamList } from '../../routes/types';
import { useFamilyCare } from '../../hooks/useFamilyCare';
import { colors, spacing, AppTheme } from '../../constants/theme';
import { Header } from '../../components/Header';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { FamilySummaryCard } from './components/FamilySummaryCard';
import { FamilyPetsSection } from './components/FamilyPetsSection';
import { FamilyRoutineSection } from './components/FamilyRoutineSection';
import { FamilyCaregiversSection } from './components/FamilyCaregiversSection';
import { FamilyPetModals } from './components/FamilyPetModals';
import { useThemedStyles } from '../../contexts/ThemeContext';

interface FamilyPetScreenProps {
  navigation: NativeStackNavigationProp<FamilyStackParamList>;
}

export default function FamilyPetScreen({ navigation }: FamilyPetScreenProps) {
  const styles = useThemedStyles(createStyles);
  const familyCare = useFamilyCare();
  const { status, family, modals } = familyCare;

  if (status.isLoading) {
    return <LoadingSpinner message="Carregando rede da família..." />;
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={status.isFetching && !status.isLoading}
            onRefresh={status.refetchAll}
            tintColor={colors.success.default}
          />
        }
      >
        <Header subtitle="Cuidado Familiar & Pets" />

        {/* Resumo da Rede de Cuidado */}
        <FamilySummaryCard {...family.summary} />

        {/* Seção de Animais da Família */}
        <FamilyPetsSection
          family={family}
          onAddPet={() => modals.abrir('novoPet')}
          onSelectPet={(petId) => navigation.navigate('PetDetail', { petId })}
        />

        {/* Seção Reutilizável de Tarefas da Rotina */}
        <FamilyRoutineSection
          family={family}
          onNewTask={() => {
            if (!family?.pets || family.pets.length === 0) {
              Alert.alert(
                'Nenhum Pet Cadastrado',
                'Cadastre um pet primeiro para poder criar tarefas de cuidado.',
                [
                  { text: 'Cadastrar Pet', onPress: () => modals.abrir('novoPet') },
                  { text: 'Cancelar', style: 'cancel' },
                ]
              );
              return;
            }
            modals.abrir('novaTarefa');
          }}
        />

        {/* Seção de Co-Cuidadores */}
        <FamilyCaregiversSection
          family={family}
          onInvite={modals.abrirConvite}
          onManageCaregiver={modals.abrirGerenciamento}
        />

        <View style={{ height: 140 }} />
      </ScrollView>

      {/* Modais de Gestão da Família, Tarefas e Co-Cuidadores */}
      <FamilyPetModals familyCare={familyCare} />
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContent: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.xs,
      gap: spacing.md,
    },
  });