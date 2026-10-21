import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { shadows } from '../../utils/shadow';
import { TarefaResponse } from '../../types/task';
import { formatarPrazoAmigavel } from '../../utils/petUtils';
import { spacing, borderRadius, AppTheme } from '../../constants/theme';
import { useTheme, useThemedStyles } from '../../contexts/ThemeContext';

export interface RoutineCardProps {
  tarefa: TarefaResponse;
  onToggle?: (id: number) => void;
  onEdit?: (tarefa: TarefaResponse) => void;
  onDelete?: (id: number) => void;
  petNome?: string;
}

const ACTION_HIT_SLOP = { top: 12, bottom: 12, left: 8, right: 8 } as const;

export const RoutineCard = memo(function RoutineCard({
  tarefa,
  onToggle,
  onEdit,
  onDelete,
  petNome,
}: RoutineCardProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const isDone = tarefa.status === 'CONCLUIDO';
  const isExpired = tarefa.status === 'EXPIRADO';

  const handlePressCard = () => {
    if (onToggle) {
      onToggle(tarefa.id);
    }
  };

  return (
    <View style={[styles.card, isDone && styles.cardDone, isExpired && styles.cardExpired]}>
      <TouchableOpacity
        style={styles.contentLeft}
        onPress={handlePressCard}
        disabled={!onToggle}
        activeOpacity={0.7}
      >
        <View style={[styles.checkbox, isDone && styles.checkboxDone, isExpired && styles.checkboxExpired]}>
          {isDone ? (
            <Ionicons name="checkmark" size={16} color="#FFFFFF" />
          ) : isExpired ? (
            <Ionicons name="alert" size={14} color={theme.badgeDangerText} />
          ) : null}
        </View>

        <View style={styles.textContainer}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, isDone && styles.titleDone]} numberOfLines={1}>
              {tarefa.titulo}
            </Text>
            {isExpired ? (
              <View style={styles.expiredBadge}>
                <Text style={styles.expiredBadgeText}>Expirada</Text>
              </View>
            ) : null}
          </View>
          {tarefa.descricao ? (
            <Text style={[styles.description, isDone && styles.descriptionDone]} numberOfLines={1}>
              {tarefa.descricao}
            </Text>
          ) : null}
          <View style={styles.metaRow}>
            {petNome ? (
              <View style={styles.petBadge}>
                <Ionicons name="paw" size={10} color={theme.badgePrimaryText} />
                <Text style={styles.petBadgeText} numberOfLines={1}>
                  {petNome}
                </Text>
              </View>
            ) : null}
            {tarefa.prazo ? (
              <View style={styles.prazoRow}>
                <Ionicons name="time-outline" size={12} color={isDone ? theme.taskDoneText : theme.primary} />
                <Text style={[styles.prazoText, isDone && styles.prazoTextDone]}>
                  {formatarPrazoAmigavel(tarefa.prazo)}
                </Text>
              </View>
            ) : null}
            {tarefa.usuarioNome ? (
              <View style={[styles.userBadge, isDone && styles.userBadgeDone]}>
                <Ionicons
                  name="person-outline"
                  size={10}
                  color={isDone ? theme.badgeSuccessText : theme.textSecondary}
                />
                <Text style={[styles.userBadgeText, isDone && styles.userBadgeTextDone]} numberOfLines={1}>
                  {tarefa.usuarioNome}
                </Text>
              </View>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.rightContainer}>
        <View style={[styles.xpBadge, isDone && styles.xpBadgeDone]}>
          <Text style={[styles.xpText, isDone && styles.xpTextDone]}>
            +{tarefa.pontosTarefa} XP
          </Text>
        </View>

        {onEdit ? (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onEdit(tarefa)}
            hitSlop={ACTION_HIT_SLOP}
            activeOpacity={0.7}
          >
            <Ionicons name="pencil" size={15} color={theme.primary} />
          </TouchableOpacity>
        ) : null}

        {onDelete ? (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => onDelete(tarefa.id)}
            hitSlop={ACTION_HIT_SLOP}
            activeOpacity={0.7}
          >
            <Ionicons name="trash" size={15} color={theme.badgeDangerText} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
});

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.card,
      paddingVertical: 12,
      paddingHorizontal: 14,
      borderRadius: borderRadius.lg,
      marginBottom: spacing.sm,
      borderWidth: 1,
      borderColor: theme.border,
      ...shadows.xs,
      elevation: 1,
    },
    cardDone: {
      backgroundColor: theme.taskDoneBg,
      borderColor: theme.taskDoneBorder,
      opacity: 0.85,
    },
    cardExpired: {
      backgroundColor: theme.taskExpiredBg,
      borderColor: theme.taskExpiredBorder,
    },
    contentLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      gap: spacing.md,
    },
    checkbox: {
      width: 26,
      height: 26,
      borderRadius: 13,
      borderWidth: 2,
      borderColor: theme.border,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.surfaceMuted,
    },
    checkboxDone: {
      backgroundColor: theme.colors.success.default,
      borderColor: theme.colors.success.default,
    },
    checkboxExpired: {
      backgroundColor: theme.badgeDangerBg,
      borderColor: theme.badgeDangerBorder,
    },
    textContainer: {
      flex: 1,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    title: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.text,
    },
    titleDone: {
      textDecorationLine: 'line-through',
      color: theme.taskDoneText,
    },
    expiredBadge: {
      backgroundColor: theme.badgeDangerBg,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: borderRadius.xs,
    },
    expiredBadgeText: {
      fontSize: 10,
      fontWeight: '700',
      color: theme.badgeDangerText,
    },
    description: {
      fontSize: 12,
      color: theme.textSecondary,
      marginTop: 2,
    },
    descriptionDone: {
      color: theme.taskDoneText,
    },
    rightContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    xpBadge: {
      backgroundColor: theme.badgePrimaryBg,
      paddingVertical: 5,
      paddingHorizontal: 8,
      borderRadius: 10,
    },
    xpBadgeDone: {
      backgroundColor: theme.badgeSuccessBg,
    },
    xpText: {
      fontSize: 11,
      fontWeight: '800',
      color: theme.badgePrimaryText,
    },
    xpTextDone: {
      color: theme.badgeSuccessText,
    },
    actionButton: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: theme.surfaceMuted,
      borderWidth: 1,
      borderColor: theme.border,
      justifyContent: 'center',
      alignItems: 'center',
    },
    deleteButton: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: theme.badgeDangerBg,
      borderWidth: 1,
      borderColor: theme.badgeDangerBorder,
      justifyContent: 'center',
      alignItems: 'center',
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      marginTop: 4,
      flexWrap: 'wrap',
    },
    petBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
      backgroundColor: theme.badgePrimaryBg,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: borderRadius.xs,
    },
    petBadgeText: {
      fontSize: 10,
      fontWeight: '700',
      color: theme.badgePrimaryText,
    },
    prazoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    prazoText: {
      fontSize: 11,
      fontWeight: '600',
      color: theme.primary,
    },
    prazoTextDone: {
      color: theme.taskDoneText,
    },
    userBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
      backgroundColor: theme.surfaceMuted,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: borderRadius.xs,
    },
    userBadgeDone: {
      backgroundColor: theme.badgeSuccessBg,
    },
    userBadgeText: {
      fontSize: 10,
      fontWeight: '600',
      color: theme.textSecondary,
    },
    userBadgeTextDone: {
      color: theme.badgeSuccessText,
    },
  });
