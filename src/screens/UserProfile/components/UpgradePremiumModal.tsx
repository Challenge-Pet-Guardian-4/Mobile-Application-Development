import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { BaseModal } from '../../../components/BaseModal';
import { shadows } from '../../../utils/shadow';

interface UpgradePremiumModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

const BENEFICIOS_PREMIUM = [
  {
    icon: 'school-outline',
    titulo: 'Trilhas Educativas & Adestramento',
    descricao: 'Módulos didáticos completos com lições práticas e ganho de pontuação de bem-estar.',
  },
  {
    icon: 'robot-outline',
    titulo: 'Assistente de IA Preventiva 24h',
    descricao: 'Orientações inteligentes em tempo real sobre nutrição, sintomas e vacinação.',
  },
  {
    icon: 'trophy-outline',
    titulo: 'Gamificação & Ranking Familiar',
    descricao: 'Acúmulo acelerado de XP registrado nativamente nas Stored Procedures Oracle.',
  },
  {
    icon: 'people-outline',
    titulo: 'Care Circle Sem Restrições',
    descricao: 'Gestão compartilhada de pets com múltiplos co-cuidadores e alertas síncronos.',
  },
];

export function UpgradePremiumModal({
  visible,
  onClose,
  onConfirm,
  isLoading = false,
}: UpgradePremiumModalProps) {
  return (
    <BaseModal
      visible={visible}
      onClose={onClose}
      title="Ativar PetGuardian Premium"
      subtitle="Evolua os cuidados e o aprendizado dos seus pets"
      size="md"
    >
      <View style={styles.modalContent}>
        {/* Banner de Destaque */}
        <View style={styles.promoBanner}>
          <View style={styles.crownCircle}>
            <MaterialCommunityIcons name="crown" size={28} color="#D97706" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.promoTitle}>Plano Premium ⭐</Text>
            <Text style={styles.promoSubtitle}>
              Acesso total ao ecossistema avançado de cuidados do PetGuardian.
            </Text>
          </View>
        </View>

        {/* Lista de Benefícios */}
        <View style={styles.benefitsList}>
          {BENEFICIOS_PREMIUM.map((b, index) => (
            <View key={index} style={styles.benefitItem}>
              <View style={styles.benefitIconBox}>
                <Ionicons name={b.icon as keyof typeof Ionicons.glyphMap} size={18} color="#D97706" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.benefitTitle}>{b.titulo}</Text>
                <Text style={styles.benefitDesc}>{b.descricao}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Ativação Premium */}
        <View style={styles.academicNotice}>
          <Ionicons name="information-circle" size={16} color="#0284C7" />
          <Text style={styles.academicNoticeText}>
            Ativação do perfil Premium é imediata e gratuita para testes.
          </Text>
        </View>

        {/* Botões de Ação */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.btnConfirm}
            onPress={onConfirm}
            activeOpacity={0.85}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <MaterialCommunityIcons name="crown" size={18} color="#FFFFFF" />
                <Text style={styles.btnConfirmText}>Confirmar e Ativar Premium ⭐</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnCancel}
            onPress={onClose}
            activeOpacity={0.7}
            disabled={isLoading}
          >
            <Text style={styles.btnCancelText}>Agora Não</Text>
          </TouchableOpacity>
        </View>
      </View>
    </BaseModal>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    gap: 14,
  },
  promoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFBEB',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
  },
  crownCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FCD34D',
  },
  promoTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#92400E',
    marginBottom: 2,
  },
  promoSubtitle: {
    fontSize: 12,
    color: '#78350F',
    lineHeight: 16,
  },
  benefitsList: {
    gap: 10,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  benefitIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  benefitTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  benefitDesc: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 16,
  },
  academicNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F0F9FF',
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  academicNoticeText: {
    fontSize: 11,
    color: '#0369A1',
    lineHeight: 15,
    flex: 1,
    fontWeight: '500',
  },
  actionsContainer: {
    gap: 8,
    marginTop: 4,
  },
  btnConfirm: {
    backgroundColor: '#D97706',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
    ...shadows.sm,
  },
  btnConfirmText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  btnCancel: {
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnCancelText: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '600',
  },
});
