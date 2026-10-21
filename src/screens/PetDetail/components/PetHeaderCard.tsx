import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { shadows } from '../../../utils/shadow';
import { PetResponse } from '../../../types/pet';
import { formatarIdadePet } from '../../../utils/petUtils';
import { AppTheme } from '../../../constants/theme';
import { useTheme, useThemedStyles } from '../../../contexts/ThemeContext';

export interface PetHeaderCardProps {
  pet: PetResponse;
  isResponsavelPrincipal?: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export function PetHeaderCard({ pet, isResponsavelPrincipal = true, onEdit, onDelete }: PetHeaderCardProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <View style={styles.petHeaderCard}>
      <View style={styles.avatarLargeWrapper}>
        <MaterialCommunityIcons name="paw" size={44} color={theme.primary} />
      </View>

      <Text style={styles.petHeaderName}>{pet.nome}</Text>
      <Text style={styles.petHeaderBreed}>{pet.raca || 'Sem raça definida'}</Text>

      <View style={styles.tagsRow}>
        <View style={styles.tagBadge}>
          <Text style={styles.tagText}>Porte {pet.porte || 'MEDIO'}</Text>
        </View>
        <View style={styles.tagBadge}>
          <Text style={styles.tagText}>{formatarIdadePet(pet.dataNasc)}</Text>
        </View>
        <View style={styles.tagBadge}>
          <Text style={styles.tagText}>{pet.sexo === 'M' ? 'Macho' : 'Fêmea'}</Text>
        </View>
        <View style={[styles.tagBadge, pet.castrado ? styles.tagCastrado : styles.tagNaoCastrado]}>
          <Text style={[styles.tagText, pet.castrado ? styles.tagCastradoText : styles.tagNaoCastradoText]}>
            {pet.castrado ? 'Castrado' : 'Não castrado'}
          </Text>
        </View>
      </View>

      {isResponsavelPrincipal ? (
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity style={styles.btnEditar} onPress={onEdit} activeOpacity={0.8}>
            <Ionicons name="pencil" size={15} color={theme.primary} />
            <Text style={styles.btnEditarText}>Editar Ficha</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnExcluir} onPress={onDelete} activeOpacity={0.8}>
            <Ionicons name="trash-outline" size={15} color={theme.badgeDangerText} />
            <Text style={styles.btnExcluirText}>Excluir</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.coCuidadorNotice}>
          <Ionicons name="shield-checkmark" size={16} color={theme.primary} />
          <Text style={styles.coCuidadorNoticeText}>
            Você é co-cuidador deste pet. Somente o tutor principal pode editar informações ou excluir a ficha.
          </Text>
        </View>
      )}
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    petHeaderCard: {
      backgroundColor: theme.card,
      borderRadius: 24,
      padding: 24,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.border,
      ...shadows.sm,
      marginBottom: 16,
    },
    avatarLargeWrapper: {
      width: 88,
      height: 88,
      borderRadius: 44,
      backgroundColor: theme.badgePrimaryBg,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
      borderWidth: 3,
      borderColor: theme.badgePrimaryBorder,
    },
    petHeaderName: {
      fontSize: 22,
      fontWeight: '900',
      color: theme.text,
      marginBottom: 2,
    },
    petHeaderBreed: {
      fontSize: 14,
      color: theme.textSecondary,
      fontWeight: '600',
      marginBottom: 14,
    },
    tagsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      justifyContent: 'center',
      marginBottom: 18,
    },
    tagBadge: {
      backgroundColor: theme.surfaceMuted,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
    },
    tagText: {
      fontSize: 12,
      fontWeight: '700',
      color: theme.textSecondary,
    },
    tagCastrado: {
      backgroundColor: theme.badgeSuccessBg,
    },
    tagCastradoText: {
      color: theme.badgeSuccessText,
    },
    tagNaoCastrado: {
      backgroundColor: theme.badgeWarningBg,
    },
    tagNaoCastradoText: {
      color: theme.badgeWarningText,
    },
    actionButtonsRow: {
      flexDirection: 'row',
      gap: 12,
      width: '100%',
      paddingTop: 14,
      borderTopWidth: 1,
      borderTopColor: theme.borderSubtle,
    },
    btnEditar: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      paddingVertical: 10,
      backgroundColor: theme.badgePrimaryBg,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.badgePrimaryBorder,
    },
    btnEditarText: {
      fontSize: 13,
      fontWeight: '700',
      color: theme.badgePrimaryText,
    },
    btnExcluir: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      paddingVertical: 10,
      backgroundColor: theme.badgeDangerBg,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.badgeDangerBorder,
    },
    btnExcluirText: {
      fontSize: 13,
      fontWeight: '700',
      color: theme.badgeDangerText,
    },
    coCuidadorNotice: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: theme.surfaceSubtle,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.border,
      marginTop: 6,
    },
    coCuidadorNoticeText: {
      flex: 1,
      fontSize: 12,
      color: theme.textSecondary,
      lineHeight: 16,
      fontWeight: '500',
    },
  });

