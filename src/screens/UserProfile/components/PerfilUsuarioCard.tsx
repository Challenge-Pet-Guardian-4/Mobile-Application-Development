import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RoleBadge } from '../../../components/RoleBadge';
import { shadows } from '../../../utils/shadow';
import { useUserProfile } from '../../../hooks/useUserProfile';
import { useTheme } from '../../../hooks/useTheme';

interface PerfilUsuarioCardProps {
  profile: ReturnType<typeof useUserProfile>['profile'];
  onEdit: () => void;
  onUpgrade?: () => void;
  isUpgrading?: boolean;
}

export function PerfilUsuarioCard({ profile, onEdit, onUpgrade, isUpgrading = false }: PerfilUsuarioCardProps) {
  const { user, initials, enderecoPrincipal } = profile;
  const { theme, isDark } = useTheme();

  return (
    <View style={[styles.profileCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={[styles.avatarContainer, { borderColor: isDark ? '#064E3B' : '#ECFDF5' }]}>
        <Text style={styles.avatarInitials}>{initials}</Text>
      </View>
      <Text style={[styles.userName, { color: theme.text }]}>{user?.nome}</Text>
      {user?.email ? <Text style={[styles.userEmail, { color: theme.textSecondary }]}>{user.email}</Text> : null}

      <View style={styles.roleBadgeBox}>
        <RoleBadge role={user?.role} />
      </View>

      {user?.role === 'COMUM' && onUpgrade && (
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
      )}

      <View style={styles.infoPillsRow}>
        {user?.ddd && user?.numeroTelefone ? (
          <View style={[styles.infoPill, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }]}>
            <Ionicons name="call-outline" size={12} color={isDark ? '#94A3B8' : '#64748B'} />
            <Text style={[styles.infoPillText, { color: isDark ? '#CBD5E1' : '#475569' }]}>
              ({user.ddd}) {user.numeroTelefone}
            </Text>
          </View>
        ) : null}

        {enderecoPrincipal && (
          <View style={[styles.infoPill, { backgroundColor: isDark ? '#1E293B' : '#F1F5F9' }]}>
            <Ionicons name="location-outline" size={12} color={isDark ? '#94A3B8' : '#64748B'} />
            <Text style={[styles.infoPillText, { color: isDark ? '#CBD5E1' : '#475569' }]}>
              {enderecoPrincipal.bairro ? `${enderecoPrincipal.bairro} • ` : ''}CEP {enderecoPrincipal.cep}
            </Text>
          </View>
        )}
      </View>

      <TouchableOpacity style={[styles.btnEditProfile, { backgroundColor: isDark ? '#1E3A8A' : '#EFF6FF' }]} onPress={onEdit} activeOpacity={0.8}>
        <Ionicons name="pencil" size={14} color="#3B82F6" />
        <Text style={[styles.btnEditProfileText, { color: isDark ? '#93C5FD' : '#2563EB' }]}>Editar Dados Cadastrais</Text>
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.8)',
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
    borderColor: '#ECFDF5',
  },
  avatarInitials: { color: '#FFFFFF', fontSize: 24, fontWeight: '800' },
  userName: { fontSize: 20, fontWeight: '800', color: '#0F172A', marginBottom: 2 },
  userEmail: { fontSize: 13, color: '#64748B', fontWeight: '500', marginBottom: 10 },
  roleBadgeBox: { marginBottom: 12 },
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
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  infoPillText: { fontSize: 12, color: '#475569', fontWeight: '600' },
  btnEditProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
  },
  btnEditProfileText: { color: '#2563EB', fontSize: 12, fontWeight: '700' },
  btnUpgradePremium: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FDE68A',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    marginBottom: 12,
  },
  btnUpgradePremiumText: { color: '#B45309', fontSize: 12, fontWeight: '800' },
});

