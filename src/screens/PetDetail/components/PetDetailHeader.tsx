import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Header } from '../../../components/Header';
import { AppTheme } from '../../../constants/theme';
import { useTheme, useThemedStyles } from '../../../contexts/ThemeContext';

interface PetDetailHeaderProps {
  onGoBack: () => void;
  subtitle?: string;
}

export function PetDetailHeader({
  onGoBack,
  subtitle = 'Ficha Completa & Histórico de Cuidados',
}: PetDetailHeaderProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.paddingHeader, { paddingTop: Math.max(insets.top, 16) }]}>
      <TouchableOpacity onPress={onGoBack} style={styles.btnVoltarTop} activeOpacity={0.7}>
        <Ionicons name="arrow-back" size={18} color={theme.text} />
        <Text style={styles.btnVoltarText}>Voltar</Text>
      </TouchableOpacity>
      <Header subtitle={subtitle} />
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    paddingHeader: {
      paddingHorizontal: 20,
    },
    btnVoltarTop: {
      flexDirection: 'row',
      alignItems: 'center',
      alignSelf: 'flex-start',
      gap: 6,
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 12,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      marginBottom: 8,
    },
    btnVoltarText: {
      fontSize: 13,
      fontWeight: '700',
      color: theme.text,
    },
  });
