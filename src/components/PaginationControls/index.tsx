import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppTheme, spacing, borderRadius } from '../../constants/theme';
import { useTheme, useThemedStyles } from '../../contexts/ThemeContext';

export interface PaginationControlsProps {
  currentPage: number; // 0-indexed (Spring Data standard)
  totalPages: number;
  totalElements?: number;
  onPageChange: (newPage: number) => void;
  isLoading?: boolean;
}

export const PaginationControls = memo(function PaginationControls({
  currentPage,
  totalPages,
  totalElements,
  onPageChange,
  isLoading = false,
}: PaginationControlsProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  if (totalPages <= 1) {
    return null;
  }

  const isFirst = currentPage <= 0;
  const isLast = currentPage >= totalPages - 1;

  const handlePrev = () => {
    if (!isFirst && !isLoading) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (!isLast && !isLoading) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.pageButton, isFirst && styles.pageButtonDisabled]}
        onPress={handlePrev}
        disabled={isFirst || isLoading}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Página anterior"
      >
        <Ionicons
          name="chevron-back"
          size={16}
          color={isFirst ? theme.textMuted : theme.text}
        />
        <Text style={[styles.pageButtonText, isFirst && styles.pageButtonTextDisabled]}>
          Anterior
        </Text>
      </TouchableOpacity>

      <View style={styles.pageIndicatorBox}>
        <Text style={styles.pageIndicatorText}>
          Página <Text style={styles.pageCurrentText}>{currentPage + 1}</Text> de{' '}
          <Text style={styles.pageTotalText}>{totalPages}</Text>
        </Text>
        {totalElements !== undefined ? (
          <Text style={styles.totalElementsText}>({totalElements} {totalElements === 1 ? 'item' : 'itens'})</Text>
        ) : null}
      </View>

      <TouchableOpacity
        style={[styles.pageButton, isLast && styles.pageButtonDisabled]}
        onPress={handleNext}
        disabled={isLast || isLoading}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Próxima página"
      >
        <Text style={[styles.pageButtonText, isLast && styles.pageButtonTextDisabled]}>
          Próxima
        </Text>
        <Ionicons
          name="chevron-forward"
          size={16}
          color={isLast ? theme.textMuted : theme.text}
        />
      </TouchableOpacity>
    </View>
  );
});

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.xs,
      marginTop: spacing.xs,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },
    pageButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: borderRadius.md,
      backgroundColor: theme.surfaceMuted,
    },
    pageButtonDisabled: {
      backgroundColor: 'transparent',
      opacity: 0.5,
    },
    pageButtonText: {
      fontSize: 12,
      fontWeight: '700',
      color: theme.text,
    },
    pageButtonTextDisabled: {
      color: theme.textMuted,
    },
    pageIndicatorBox: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    pageIndicatorText: {
      fontSize: 12,
      color: theme.textSecondary,
      fontWeight: '500',
    },
    pageCurrentText: {
      fontWeight: '800',
      color: theme.primary,
    },
    pageTotalText: {
      fontWeight: '700',
      color: theme.text,
    },
    totalElementsText: {
      fontSize: 10,
      color: theme.textMuted,
      marginTop: 1,
    },
  });
