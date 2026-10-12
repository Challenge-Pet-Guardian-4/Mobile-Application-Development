import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CaregiverCard } from '../../../components/CaregiverCard';
import { shadows } from '../../../utils/shadow';
import { usePetDetail } from '../../../hooks/usePetDetail';
import { useSession } from '../../../hooks/useSession';
import { CaregiverWithActions } from '../../../types/pet';
import { AppTheme } from '../../../constants/theme';
import { useTheme, useThemedStyles } from '../../../contexts/ThemeContext';

interface PetCaregiversSectionProps {
  pet: ReturnType<typeof usePetDetail>['pet'];
  user: ReturnType<typeof useSession>['user'];
  onInvite: () => void;
}

export function PetCaregiversSection({ pet, user, onInvite }: PetCaregiversSectionProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const caregiversCount = pet?.caregiversCount ?? pet?.caregivers?.length ?? 0;
  const isPrincipal = Boolean(pet?.isPrincipal);
  const temCuidadores = (pet?.caregivers?.length ?? 0) > 0;

  return (
    <View style={styles.sectionBox}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Ionicons name="people" size={18} color={theme.primary} />
          <Text style={styles.sectionTitle}>
            Rede de Cuidado ({caregiversCount})
          </Text>
        </View>
        {isPrincipal && (
          <TouchableOpacity
            style={styles.btnInvite}
            onPress={onInvite}
            activeOpacity={0.7}
          >
            <Ionicons name="person-add" size={13} color={theme.badgePrimaryText} />
            <Text style={styles.btnInviteText}>Convidar</Text>
          </TouchableOpacity>
        )}
      </View>

      {!temCuidadores ? (
        user && (
          <CaregiverCard
            nome={user?.nome || 'Tutor'}
            email={user?.email}
            roleText={isPrincipal ? 'Responsável Principal' : 'Co-cuidador'}
            isCurrentUser
            isPrincipal={isPrincipal}
          />
        )
      ) : (
        pet?.caregivers?.map((c: CaregiverWithActions) => (
          <CaregiverCard
            key={c.email}
            nome={c.nome}
            email={c.email}
            isPrincipal={c.responsavelPrincipal}
            isCurrentUser={c.isCurrentUser}
            onTransfer={c.onTransfer}
            onRemove={c.onRemove}
          />
        ))
      )}
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    sectionBox: {
      backgroundColor: theme.card,
      borderRadius: 24,
      padding: 20,
      borderWidth: 1,
      borderColor: theme.border,
      ...shadows.sm,
      elevation: 2,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    sectionTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
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
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 10,
      gap: 4,
    },
    btnInviteText: {
      color: theme.badgePrimaryText,
      fontWeight: '800',
      fontSize: 11,
    },
  });
