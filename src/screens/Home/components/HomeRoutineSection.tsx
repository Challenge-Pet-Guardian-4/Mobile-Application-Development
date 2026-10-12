import React, { useMemo } from 'react';
import { HomeStreakCard } from './HomeStreakCard';
import { TasksRoutineSection } from '../../../components/TasksRoutineSection';
import { useHomeData } from '../../../hooks/useHomeData';
import { HeaderActionButton } from '../../../types';

interface HomeRoutineSectionProps {
  routine: ReturnType<typeof useHomeData>['routine'];
  onManagePress: () => void;
}

export function HomeRoutineSection({ routine, onManagePress }: HomeRoutineSectionProps) {
  const headerButton = useMemo<HeaderActionButton>(
    () => ({
      label: 'Gerenciar na Family',
      icon: 'chevron-forward',
      variant: 'link',
      onPress: onManagePress,
    }),
    [onManagePress]
  );

  return (
    <>
      {/* Ofensiva Familiar */}
      <HomeStreakCard
        streakDays={routine?.streak?.streakDays ?? []}
        totalStreak={routine?.streak?.totalStreak ?? 0}
      />

      {/* Seção de Tarefas da Rotina Diária */}
      <TasksRoutineSection
        routineData={routine?.sectionData}
        headerButton={headerButton}
      />
    </>
  );
}
