import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppTheme } from '../../../constants/theme';
import { useTheme, useThemedStyles } from '../../../contexts/ThemeContext';

export function PetEmptyState() {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.emptyContainerCenter}>
      <MaterialCommunityIcons name="paw-off" size={48} color={theme.textMuted} />
      <Text style={styles.emptyTitle}>Nenhum pet encontrado</Text>
      <Text style={styles.emptySub}>
        Vá até a aba Family Pet para cadastrar o primeiro membro.
      </Text>
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    emptyContainerCenter: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    },
    emptyTitle: {
      fontSize: 16,
      fontWeight: '800',
      color: theme.text,
      marginTop: 12,
    },
    emptySub: {
      fontSize: 13,
      color: theme.textSecondary,
      textAlign: 'center',
      marginTop: 4,
    },
  });
