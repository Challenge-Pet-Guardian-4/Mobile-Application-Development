import React from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../routes/types';
import { spacing, AppTheme } from '../../constants/theme';
import { Header } from '../../components/Header';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { useHomeData } from '../../hooks/useHomeData';
import { useTheme, useThemedStyles } from '../../contexts/ThemeContext';
import { HomePetSelector } from './components/HomePetSelector';
import { HomeScoreBar } from './components/HomeScoreBar';
import { HomeRoutineSection } from './components/HomeRoutineSection';
import { HomeAiShortcut } from './components/HomeAiShortcut';
import { HomeTaskModal } from './components/HomeTaskModal';
import { HomeEmptyState } from './components/HomeEmptyState';
import { HomeErrorState } from './components/HomeErrorState';

interface HomeScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

export default function Home({ navigation }: HomeScreenProps) {
  const { status, pets, routine, taskModal, navigation: nav } = useHomeData(navigation);
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();

  if (status.isLoading && (pets?.list?.length ?? 0) === 0) {
    return <LoadingSpinner message="Carregando dados do PetGuardian..." />;
  }

  if (status.isError && (pets?.list?.length ?? 0) === 0) {
    return <HomeErrorState status={status} />;
  }

  if ((pets?.list?.length ?? 0) === 0) {
    return (
      <HomeEmptyState
        status={status}
        onNavigateToFamily={nav.toFamily}
        onNavigateToAi={nav.toAi}
        onNavigateToEducation={nav.toEducation}
      />
    );
  }

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 16) }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 }]}
        refreshControl={
          <RefreshControl
            refreshing={status.isFetching && !status.isLoading}
            onRefresh={status.refetch}
            tintColor={theme.primary}
          />
        }
      >
        <Header subtitle="Painel de Saúde e Rotina" />

        {/* Seletor Horizontal de Pets Ativos */}
        <HomePetSelector pets={pets} />

        {/* Barra de Score e Bem-Estar do Pet Ativo */}
        <HomeScoreBar pets={pets} routine={routine} onPress={nav.toPetDetail} />

        {/* Ofensiva Familiar e Tarefas da Rotina */}
        <HomeRoutineSection
          routine={routine}
          onManagePress={nav.toFamily}
        />

        {/* Atalho Rápido para a IA Assistente Preventiva */}
        <HomeAiShortcut onPress={nav.toAi} />

      </ScrollView>

      {/* Modal de Edição Rápida de Tarefa */}
      <HomeTaskModal taskModal={taskModal} pets={pets} />

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