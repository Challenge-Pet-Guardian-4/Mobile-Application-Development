import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../routes/types';
import { shadows } from '../../../utils/shadow';
import { useThemedStyles, useTheme } from '../../../contexts/ThemeContext';
import { AppTheme } from '../../../constants/theme';

interface RecursosPetGuardianProps {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

export function RecursosPetGuardian({ navigation }: RecursosPetGuardianProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.menuBox}>
      <Text style={styles.menuSectionTitle}>Recursos PetGuardian</Text>

      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate('IA')}
        activeOpacity={0.7}
      >
        <View style={styles.menuIconWrapper}>
          <MaterialCommunityIcons name="robot-outline" size={20} color={theme.primary} />
        </View>
        <View style={styles.itemContent}>
          <Text style={styles.menuText}>Assistente de IA Preventiva</Text>
          <Text style={styles.menuSubText}>Orientações sobre saúde e rotina do pet</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    menuBox: {
      backgroundColor: theme.card,
      borderRadius: 20,
      padding: 16,
      borderWidth: 1,
      borderColor: theme.border,
      ...shadows.sm,
    },
    menuSectionTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: theme.text,
      marginBottom: 12,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 0,
      gap: 12,
    },
    menuIconWrapper: {
      width: 36,
      height: 36,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.badgePrimaryBg,
    },
    itemContent: {
      flex: 1,
    },
    menuText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.text,
    },
    menuSubText: {
      fontSize: 11,
      color: theme.textSecondary,
      marginTop: 1,
    },
  });

