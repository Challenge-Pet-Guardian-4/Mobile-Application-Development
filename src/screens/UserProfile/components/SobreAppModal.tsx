import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { BaseModal } from '../../../components/BaseModal';
import { APP_VERSION_INFO } from '../../../config/version';

interface SobreAppModalProps {
  visible: boolean;
  onClose: () => void;
}

export function SobreAppModal({ visible, onClose }: SobreAppModalProps) {
  return (
    <BaseModal
      visible={visible}
      onClose={onClose}
      title="Sobre o PetGuardian"
      subtitle="Identificação da Versão & Publicação"
      size="md"
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        {/* Header do App com Ícone */}
        <View style={styles.appHeader}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name="paw" size={32} color="#FFFFFF" />
          </View>
          <Text style={styles.appName}>{APP_VERSION_INFO.appName}</Text>
          <Text style={styles.appTagline}>{APP_VERSION_INFO.tagline}</Text>
          <View style={styles.badgeSprint}>
            <Text style={styles.badgeSprintText}>{APP_VERSION_INFO.sprint}</Text>
          </View>
        </View>

        {/* Card de Identificação da Versão & Commit Hash Obrigatório do Edital */}
        <View style={styles.commitCard}>
          <View style={styles.commitHeaderRow}>
            <Ionicons name="git-commit-outline" size={20} color="#2563EB" />
            <Text style={styles.commitCardTitle}>Hash do Commit de Referência</Text>
          </View>

          <Text style={styles.commitExplica}>
            Hash do commit no GitHub Classroom correspondente à versão publicada no Firebase App Distribution:
          </Text>

          {/* Caixa de Destaque com o Hash Completo */}
          <View style={styles.hashBox}>
            <Text style={styles.hashText} selectable>
              {APP_VERSION_INFO.commitHash}
            </Text>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Versão</Text>
              <Text style={styles.metaValue}>v{APP_VERSION_INFO.version}</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Build</Text>
              <Text style={styles.metaValue}>#{APP_VERSION_INFO.buildNumber}</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Distribuição</Text>
              <Text style={styles.metaValue}>Firebase</Text>
            </View>
          </View>
        </View>

        {/* Informações da Instituição e Disciplina */}
        <View style={styles.infoBox}>
          <Text style={styles.infoSectionTitle}>Disciplina & Contexto</Text>
          <Text style={styles.infoItem}>
            • <Text style={styles.bold}>Disciplina:</Text> {APP_VERSION_INFO.disciplina}
          </Text>
          <Text style={styles.infoItem}>
            • <Text style={styles.bold}>Turma:</Text> {APP_VERSION_INFO.instituicao}
          </Text>
          <Text style={styles.infoItem}>
            • <Text style={styles.bold}>Desafio:</Text> {APP_VERSION_INFO.challenge}
          </Text>
          <Text style={styles.infoItem}>
            • <Text style={styles.bold}>Canal:</Text> {APP_VERSION_INFO.target}
          </Text>
        </View>

        {/* Equipe de Desenvolvimento com RMs */}
        <View style={styles.teamBox}>
          <Text style={styles.infoSectionTitle}>Equipe de Desenvolvimento</Text>
          {APP_VERSION_INFO.equipe.map((membro, idx) => (
            <View key={idx} style={styles.memberRow}>
              <View style={styles.avatarMini}>
                <Text style={styles.avatarMiniText}>{membro.nome.charAt(0)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.memberName}>{membro.nome}</Text>
                <Text style={styles.memberRm}>RM: {membro.rm}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </BaseModal>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 16,
    gap: 16,
  },
  appHeader: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 3,
  },
  appName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  appTagline: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    textAlign: 'center',
  },
  badgeSprint: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  badgeSprintText: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '700',
  },
  commitCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#3B82F6',
  },
  commitHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  commitCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  commitExplica: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 10,
    lineHeight: 16,
  },
  hashBox: {
    backgroundColor: '#0F172A',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  hashText: {
    color: '#38BDF8',
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  metaItem: {
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 10,
    color: '#94A3B8',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  metaValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 2,
  },
  metaDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#E2E8F0',
  },
  infoBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  infoSectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoItem: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
  },
  bold: {
    fontWeight: '700',
    color: '#1E293B',
  },
  teamBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarMini: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  avatarMiniText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
  },
  memberName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
  },
  memberRm: {
    fontSize: 11,
    color: '#64748B',
  },
});
