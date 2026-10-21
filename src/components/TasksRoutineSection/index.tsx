import React, { memo, useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { shadows } from '../../utils/shadow';
import { TasksRoutineSectionProps, } from '../../types/task';
import { RoutineCard } from './RoutineCard';
import { spacing, borderRadius, AppTheme } from '../../constants/theme';
import { PaginationControls } from '../PaginationControls';
import { useTheme, useThemedStyles } from '../../contexts/ThemeContext';

export const TasksRoutineSection = memo(function TasksRoutineSection(props: TasksRoutineSectionProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const {
    routineData,
    pets,
    headerButton,
    emptyTitle,
    emptyDesc,
    pageSize = 5,
    pagination,
  } = props;

  const data = routineData ?? props;
  const effectiveFilter = data.filter ?? 'HOJE';
  const effectiveOnFilterChange = data.onFilterChange ?? (() => {});
  const effectiveTitle = data.title ?? (effectiveFilter === 'HOJE' ? 'Rotina de Hoje' : 'Todas as Tarefas');
  const effectiveSubtitle = data.subtitle;
  const effectiveCountHoje = data.countHoje ?? 0;
  const effectiveCountTodas = data.countTodas ?? 0;
  const effectiveTasks = data.tasks ?? [];
  const effectiveOnToggle = data.onToggleTask;
  const effectiveOnEdit = data.onEditTask;
  const effectiveOnDelete = data.onDeleteTask;

  const [internalPage, setInternalPage] = useState(0);

  // Reseta para a primeira página caso o filtro de visualização mude
  useEffect(() => {
    setInternalPage(0);
  }, [effectiveFilter]);

  const effectivePageSize = pageSize;
  const isInternalPagination = !!effectivePageSize && !pagination;

  const totalPages = isInternalPagination
    ? Math.max(1, Math.ceil(effectiveTasks.length / effectivePageSize))
    : (pagination?.totalPages ?? 1);

  const currentPage = isInternalPagination
    ? Math.min(internalPage, Math.max(0, totalPages - 1))
    : (pagination?.currentPage ?? 0);

  const displayedTasks = isInternalPagination
    ? effectiveTasks.slice(currentPage * effectivePageSize, (currentPage + 1) * effectivePageSize)
    : effectiveTasks;

  const paginationData = pagination ?? (isInternalPagination ? {
    currentPage,
    totalPages,
    totalElements: effectiveTasks.length,
    onPageChange: setInternalPage,
    isLoading: false,
  } : undefined);

  const petNameMap = useMemo(() => {
    if (!pets?.length) {
      return null;
    }
    return new Map(pets.map((p) => [p.id, p.nome]));
  }, [pets]);

  const getPetName = (petId: number): string | undefined => {
    return petNameMap?.get(petId);
  };

  const defaultEmptyTitle =
    effectiveFilter === 'HOJE' ? 'Tudo em dia para hoje!' : 'Nenhuma tarefa cadastrada';
  const defaultEmptyDesc =
    effectiveFilter === 'HOJE'
      ? 'Nenhuma tarefa agendada para hoje.'
      : 'Crie rotinas diárias para seu pet acumular pontos XP!';

  const isLinkButton = headerButton?.variant === 'link';

  return (
    <View style={styles.sectionBox}>
      {/* Cabeçalho da Seção */}
      <View style={styles.sectionHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.sectionTitle}>{effectiveTitle}</Text>
          {effectiveSubtitle ? <Text style={styles.sectionSubtitle}>{effectiveSubtitle}</Text> : null}
        </View>

        {headerButton ? (
          <TouchableOpacity
            style={isLinkButton ? styles.headerButtonLink : styles.headerButtonPrimary}
            onPress={headerButton.onPress}
            activeOpacity={0.7}
          >
            {headerButton.icon === 'add' ? <Ionicons name="add" size={16} color="#FFFFFF" /> : null}
            <Text style={isLinkButton ? styles.headerButtonLinkText : styles.headerButtonPrimaryText}>
              {headerButton.label}
            </Text>
            {headerButton.icon === 'chevron-forward' ? (
              <Ionicons name="chevron-forward" size={14} color={theme.primary} />
            ) : null}
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Abas de Filtro: Hoje vs Todas */}
      <View style={styles.filterTabsRow}>
        <TouchableOpacity
          style={[
            styles.filterTab,
            effectiveFilter === 'HOJE' && styles.filterTabActive,
          ]}
          onPress={() => effectiveOnFilterChange('HOJE')}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="calendar-today"
            size={14}
            color={effectiveFilter === 'HOJE' ? theme.primary : theme.textSecondary}
          />
          <Text
            style={[
              styles.filterTabText,
              effectiveFilter === 'HOJE' && styles.filterTabTextActive,
            ]}
          >
            Hoje ({effectiveCountHoje})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.filterTab,
            effectiveFilter === 'TODAS' && styles.filterTabActive,
          ]}
          onPress={() => effectiveOnFilterChange('TODAS')}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="format-list-bulleted"
            size={14}
            color={effectiveFilter === 'TODAS' ? theme.primary : theme.textSecondary}
          />
          <Text
            style={[
              styles.filterTabText,
              effectiveFilter === 'TODAS' && styles.filterTabTextActive,
            ]}
          >
            Todas ({effectiveCountTodas})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Conteúdo / Lista de Tarefas */}
      {effectiveTasks.length === 0 ? (
        <View style={styles.emptyBox}>
          <MaterialCommunityIcons name="clipboard-check-outline" size={32} color={theme.textMuted} />
          <Text style={styles.emptyTitle}>{emptyTitle || defaultEmptyTitle}</Text>
          <Text style={styles.emptyDesc}>{emptyDesc || defaultEmptyDesc}</Text>
        </View>
      ) : (
        <View style={styles.tasksList}>
          {displayedTasks.map((tarefa) => (
            <RoutineCard
              key={tarefa.id}
              tarefa={tarefa}
              petNome={getPetName(tarefa.petId)}
              onToggle={effectiveOnToggle}
              onEdit={effectiveOnEdit}
              onDelete={effectiveOnDelete}
            />
          ))}
        </View>
      )}

      {paginationData ? (
        <PaginationControls
          currentPage={paginationData.currentPage}
          totalPages={paginationData.totalPages}
          totalElements={paginationData.totalElements}
          onPageChange={paginationData.onPageChange}
          isLoading={paginationData.isLoading}
        />
      ) : null}
    </View>
  );
});

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
    sectionSubtitle: {
      fontSize: 12,
      color: theme.textSecondary,
      marginTop: 2,
      fontWeight: '500',
    },
    headerButtonPrimary: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.primary,
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
      borderRadius: borderRadius.md,
      gap: 4,
    },
    headerButtonPrimaryText: {
      color: "#FFFFFF",
      fontWeight: '800',
      fontSize: 12,
    },
    headerButtonLink: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: theme.badgePrimaryBg,
      paddingVertical: spacing.xs,
      paddingHorizontal: 10,
      borderRadius: borderRadius.md,
    },
    headerButtonLinkText: {
      fontSize: 11,
      fontWeight: '700',
      color: theme.badgePrimaryText,
    },
    filterTabsRow: {
      flexDirection: 'row',
      backgroundColor: theme.surfaceSubtle,
      borderRadius: borderRadius.md,
      padding: 4,
      marginBottom: spacing.md,
      borderWidth: 1,
      borderColor: theme.border,
      gap: spacing.xs,
    },
    filterTab: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xs,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.sm,
    },
    filterTabActive: {
      backgroundColor: theme.card,
      ...shadows.sm,
    },
    filterTabText: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.textSecondary,
    },
    filterTabTextActive: {
      color: theme.primary,
      fontWeight: '700',
    },
    emptyBox: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.xxl,
      paddingHorizontal: spacing.md,
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
      marginTop: spacing.sm,
    },
    emptyDesc: {
      fontSize: 12,
      color: theme.textSecondary,
      textAlign: 'center',
      marginTop: 4,
      lineHeight: 18,
    },
    tasksList: {
      gap: 4,
    },
  });
