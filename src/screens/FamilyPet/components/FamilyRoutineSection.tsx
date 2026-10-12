import React, { useMemo } from 'react';
import { TasksRoutineSection } from '../../../components/TasksRoutineSection';
import { useFamilyCare } from '../../../hooks/useFamilyCare';
import { HeaderActionButton } from '../../../types';

interface FamilyRoutineSectionProps {
  family: ReturnType<typeof useFamilyCare>['family'];
  onNewTask: () => void;
}

export function FamilyRoutineSection({ family, onNewTask }: FamilyRoutineSectionProps) {
  const headerButton = useMemo<HeaderActionButton>(
    () => ({
      label: 'Nova Tarefa',
      icon: 'add',
      variant: 'primary',
      onPress: onNewTask,
    }),
    [onNewTask]
  );

  return (
    <TasksRoutineSection
      routineData={family.routineData}
      pets={family.pets}
      pageSize={6}
      headerButton={headerButton}
    />
  );
}
