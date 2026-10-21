import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RoleBadge } from '../../../components/RoleBadge';
import { shadows } from '../../../utils/shadow';
import { useUserProfile } from '../../../hooks/useUserProfile';
import { useTheme, useThemedStyles } from '../../../contexts/ThemeContext';
import { AppTheme } from '../../../constants/theme';
import { obterBadgeGamificacao } from '../../../utils/familyCareUtils';

interface PerfilUsuarioCardProps {
  profile: ReturnType<typeof useUserProfile>['profile'];
  onEdit: () => void;
  onUpgrade?: () => void;
  isUpgrading?: boolean;
}

export function PerfilUsuarioCard({ profile, onEdit, onUpgrade, isUpgrading = false }: PerfilUsuarioCardProps) {
  const { user, initials, enderecoPrincipal, redeCuidado } = profile;
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const nivelBadge = obterBadgeGamificacao(redeCuidado?.nivelGamificacao);

  return (
    <View style={styles.profileCard}>
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarInitials}>{initials}</Text>
      </View>
      <Text style={styles.userName}>{user?.nome}</Text>
      {user?.email ? <Text style={styles.userEmail}>{user.email}</Text> : null}

      <View style={styles.badgesRow}>
        <RoleBadge role={user?.role} />
        {redeCuidado?.nivelGamificacao ? (
          <View style={[styles.nivelBadge, { backgroundColor: nivelBadge.bg, borderColor: nivelBadge.border }]}>
            <Text style={[styles.nivelBadgeText, { color: nivelBadge.text }]}>{nivelBadge.label}</Text>
          </View>
        ) : null}
      </View>

      {(user?.role === 'COMUM' && onUpgrade) ? (
        <TouchableOpacity
          style={styles.btnUpgradePremium}
          onPress={onUpgrade}
          activeOpacity={0.8}
          disabled={isUpgrading}
        >
          <Ionicons name="sparkles" size={14} color="#B45309" />
          <Text style={styles.btnUpgradePremiumText}>
            {isUpgrading ? 'Ativando Premium...' : 'Fazer Upgrade para Premium ⭐'}
          </Text>
        </TouchableOpacity>
      ) : null}

      <View style={styles.infoPillsRow}>
        {user?.ddd && user?.numeroTelefone ? (
          <View style={styles.infoPill}>
            <Ionicons name="call-outline" size={12} color={theme.textSecondary} />
            <Text style={styles.infoPillText}>
              ({user.ddd}) {user.numeroTelefone}
            </Text>
          </View>
        ) : null}

        {enderecoPrincipal ? (
          <View style={styles.infoPill}>
            <Ionicons name="location-outline" size={12} color={theme.textSecondary} />
            <Text style={styles.infoPillText}>
              {enderecoPrincipal.bairro ? `${enderecoPrincipal.bairro} • ` : ''}CEP {enderecoPrincipal.cep}
            </Text>
          </View>
        ) : null}
      </View>

      <TouchableOpacity
        style={styles.btnEditProfile}
        onPress={onEdit}
        activeOpacity={0.8}
      >
        <Ionicons name="pencil" size={14} color={theme.primary} />
        <Text style={styles.btnEditProfileText}>
          Editar Dados Cadastrais
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    profileCard: {
      backgroundColor: theme.card,
      borderRadius: 24,
      padding: 22,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.border,
      ...shadows.sm,
    },
    avatarContainer: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: '#059669',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
      borderWidth: 3,
      borderColor: theme.badgeSuccessBorder,
    },
    avatarInitials: {
      color: '#FFFFFF',
      fontSize: 24,
      fontWeight: '800',
    },
    userName: {
      fontSize: 20,
      fontWeight: '800',
      color: theme.text,
      marginBottom: 2,
    },
    userEmail: {
      fontSize: 13,
      color: theme.textSecondary,
      fontWeight: '500',
      marginBottom: 10,
    },
    badgesRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 12,
    },
    nivelBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 3,
      paddingHorizontal: 9,
      borderRadius: 10,
      borderWidth: 1,
    },
    nivelBadgeText: {
      fontSize: 11,
      fontWeight: '800',
    },
    infoPillsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      justifyContent: 'center',
      marginBottom: 16,
    },
    infoPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      backgroundColor: theme.surfaceMuted,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
    },
    infoPillText: {
      fontSize: 12,
      color: theme.textSecondary,
      fontWeight: '600',
    },
    btnEditProfile: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: theme.badgePrimaryBg,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 14,
    },
    btnEditProfileText: {
      color: theme.badgePrimaryText,
      fontSize: 12,
      fontWeight: '700',
    },
    btnUpgradePremium: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: theme.badgeWarningBg,
      borderWidth: 1,
      borderColor: theme.badgeWarningBorder,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 14,
      marginBottom: 12,
    },
    btnUpgradePremiumText: {
      color: theme.badgeWarningText,
      fontSize: 12,
      fontWeight: '800',
    },
  });


