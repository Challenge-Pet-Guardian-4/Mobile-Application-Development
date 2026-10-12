import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CaregiverCard } from '../../../components/CaregiverCard';
import { AppTheme, spacing, borderRadius } from '../../../constants/theme';
import { shadows } from '../../../utils/shadow';
import { useFamilyCare } from '../../../hooks/useFamilyCare';
import { CuidadorFamiliarItem } from '../../../types/user';
import { useTheme, useThemedStyles } from '../../../contexts/ThemeContext';

interface FamilyCaregiversSectionProps {
  family: ReturnType<typeof useFamilyCare>['family'];
  onInvite: () => void;
  onManageCaregiver: (caregiver: CuidadorFamiliarItem) => void;
}

export function FamilyCaregiversSection({
  family,
  onInvite,
  onManageCaregiver,
}: FamilyCaregiversSectionProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { currentUserCaregiver, coCuidadores } = family;
  const isPrincipal = currentUserCaregiver?.isPrincipal ?? false;

  return (
    <View style={styles.sectionBox}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Rede de Cuidados</Text>
        {isPrincipal && (
          <TouchableOpacity style={styles.btnInvite} onPress={onInvite} activeOpacity={0.8}>
            <Ionicons name="person-add" size={14} color={theme.badgePrimaryText} />
            <Text style={styles.btnInviteText}>Convidar</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Meu perfil */}
      {currentUserCaregiver && (
        <CaregiverCard
          nome={currentUserCaregiver.nome}
          email={currentUserCaregiver.email}
          roleText={currentUserCaregiver.roleText}
          isCurrentUser
          isPrincipal={currentUserCaregiver.isPrincipal}
        />
      )}

      {/* Co-cuidadores */}
      {(coCuidadores ?? []).map((c: CuidadorFamiliarItem) => (
        <CaregiverCard
          key={c.email}
          nome={c.nome}
          email={c.email}
          roleText={c.roleText}
          isPrincipal={Boolean(c.responsavelPrincipal)}
          onPress={isPrincipal ? () => onManageCaregiver(c) : undefined}
        />
      ))}
    </View>
  );
}

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
    btnInvite: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.badgePrimaryBg,
      paddingVertical: spacing.xs,
      paddingHorizontal: spacing.sm,
      borderRadius: borderRadius.md,
      gap: 4,
    },
    btnInviteText: {
      color: theme.badgePrimaryText,
      fontWeight: '800',
      fontSize: 12,
    },
  });
