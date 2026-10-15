import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { CuidadorResumo, PetResumo } from '../../../types/user';
import { BaseModal } from '../../../components/BaseModal';
import { useTheme, useThemedStyles } from '../../../contexts/ThemeContext';
import { AppTheme } from '../../../constants/theme';

export interface ManageCaregiverModalProps {
  visible: boolean;
  onClose: () => void;
  cuidador?: CuidadorResumo;
  petsOndeSouPrincipal: PetResumo[];
  onTogglePetVinculo: (petId: number, isCurrentlyLinked: boolean) => void;
  onTransferirTitularidade: (petId: number, petNome: string) => void;
  onRemoverDeTodosPets: () => void;
  isLoading?: boolean;
}

export const ManageCaregiverModal = memo(function ManageCaregiverModal({
  visible,
  onClose,
  cuidador,
  petsOndeSouPrincipal,
  onTogglePetVinculo,
  onTransferirTitularidade,
  onRemoverDeTodosPets,
  isLoading = false,
}: ManageCaregiverModalProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  if (!cuidador) return null;

  const handlePressTransfer = (pet: PetResumo) => {
    Alert.alert(
      'Transferir Titularidade',
      `Tem certeza de que deseja transferir a titularidade de ${pet.nome} para ${cuidador.nome}?\n\nEle passará a ser o único tutor principal deste pet e você continuará colaborando como co-cuidador. Seus outros animais não serão afetados.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar Transferência',
          style: 'destructive',
          onPress: () => onTransferirTitularidade(pet.id, pet.nome),
        },
      ]
    );
  };

  const handlePressRemoveAll = () => {
    Alert.alert(
      'Remover Co-Cuidador',
      `Deseja realmente desvincular ${cuidador.nome} de todos os seus animais sob seu cuidado principal?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover de Todos',
          style: 'destructive',
          onPress: onRemoverDeTodosPets,
        },
      ]
    );
  };

  return (
    <BaseModal
      visible={visible}
      onClose={onClose}
      title={cuidador.nome}
      subtitle={cuidador.email}
      size="md"
      footer={
        isLoading ? (
          <ActivityIndicator color={theme.primary} style={{ marginVertical: 8 }} />
        ) : (
          <TouchableOpacity
            style={styles.btnDone}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.btnDoneText}>Concluir</Text>
          </TouchableOpacity>
        )
      }
    >
      {/* Badge Informativo de Regras */}
      <View style={styles.infoBadgeBox}>
        <Ionicons name="shield-checkmark-outline" size={16} color={theme.badgePrimaryText} />
        <Text style={styles.infoBadgeText}>
          Cada animal possui apenas 1 tutor principal. Marque abaixo com quais dos seus pets este cuidador colabora.
        </Text>
      </View>

      <Text style={styles.sectionSubtitle}>
        Vínculo com seus animais ({petsOndeSouPrincipal.length})
      </Text>

      {petsOndeSouPrincipal.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>Você não é tutor principal de nenhum animal cadastrado.</Text>
        </View>
      ) : (
        petsOndeSouPrincipal.map((pet) => {
          const isLinked = cuidador.petIds.includes(pet.id);

          return (
            <View key={pet.id} style={[styles.petRow, isLinked && styles.petRowActive]}>
              <TouchableOpacity
                style={styles.petToggleLeft}
                onPress={() => onTogglePetVinculo(pet.id, isLinked)}
                activeOpacity={0.7}
                disabled={isLoading}
              >
                <View style={[styles.checkbox, isLinked && styles.checkboxActive]}>
                  {isLinked && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.petName, isLinked && styles.petNameActive]}>
                    {pet.nome}
                  </Text>
                  <Text style={styles.petBreed}>
                    {pet.raca} • {isLinked ? 'Co-cuidando ativamente' : 'Não vinculado'}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Botão de Transferir Titularidade deste pet */}
              {isLinked && (
                <TouchableOpacity
                  style={styles.btnTransferCrown}
                  onPress={() => handlePressTransfer(pet)}
                  activeOpacity={0.7}
                  disabled={isLoading}
                >
                  <MaterialCommunityIcons name="crown-outline" size={16} color={theme.badgeWarningText} />
                  <Text style={styles.btnTransferCrownText}>Passar Titularidade</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })
      )}

      {/* Ação Destrutiva em Massa */}
      {cuidador.petIds.length > 0 && (
        <TouchableOpacity
          style={styles.btnRemoveAll}
          onPress={handlePressRemoveAll}
          activeOpacity={0.7}
          disabled={isLoading}
        >
          <Ionicons name="trash-outline" size={16} color="#EF4444" />
          <Text style={styles.btnRemoveAllText}>
            Desvincular de todos os animais
          </Text>
        </TouchableOpacity>
      )}
    </BaseModal>
  );
});

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    infoBadgeBox: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: theme.badgePrimaryBg,
      padding: 10,
      borderRadius: 14,
      marginBottom: 14,
      borderWidth: 1,
      borderColor: theme.badgePrimaryBorder,
    },
    infoBadgeText: {
      flex: 1,
      fontSize: 11,
      color: theme.badgePrimaryText,
      fontWeight: '600',
      lineHeight: 15,
    },
    sectionSubtitle: {
      fontSize: 13,
      fontWeight: '700',
      color: theme.textSecondary,
      marginBottom: 10,
    },
    emptyBox: {
      padding: 16,
      alignItems: 'center',
    },
    emptyText: {
      fontSize: 12,
      color: theme.textMuted,
      textAlign: 'center',
    },
    petRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.surfaceMuted,
      padding: 12,
      borderRadius: 14,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: theme.border,
      gap: 8,
    },
    petRowActive: {
      backgroundColor: theme.card,
      borderColor: theme.primary,
    },
    petToggleLeft: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    checkbox: {
      width: 20,
      height: 20,
      borderRadius: 6,
      borderWidth: 1.5,
      borderColor: theme.border,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.surfaceMuted,
    },
    checkboxActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    petName: {
      fontSize: 13,
      fontWeight: '700',
      color: theme.textSecondary,
    },
    petNameActive: {
      color: theme.text,
    },
    petBreed: {
      fontSize: 11,
      color: theme.textMuted,
      marginTop: 1,
    },
    btnTransferCrown: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: theme.badgeWarningBg,
      paddingVertical: 5,
      paddingHorizontal: 8,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.badgeWarningBorder,
    },
    btnTransferCrownText: {
      fontSize: 10,
      fontWeight: '700',
      color: theme.badgeWarningText,
    },
    btnRemoveAll: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      backgroundColor: theme.badgeDangerBg,
      paddingVertical: 10,
      borderRadius: 12,
      marginTop: 12,
      borderWidth: 1,
      borderColor: theme.badgeDangerBorder,
    },
    btnRemoveAllText: {
      fontSize: 12,
      fontWeight: '700',
      color: theme.badgeDangerText,
    },
    footer: {
      marginTop: 14,
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },
    btnDone: {
      backgroundColor: theme.isDark ? theme.primary : '#0F172A',
      paddingVertical: 12,
      borderRadius: 14,
      alignItems: 'center',
    },
    btnDoneText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '700',
    },
  });
