import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { BaseModal } from '../../../components/BaseModal';
import { APP_VERSION_INFO } from '../../../config/version';
import { useTheme, useThemedStyles } from '../../../contexts/ThemeContext';
import { AppTheme } from '../../../constants/theme';

interface SobreAppModalProps {
  visible: boolean;
  onClose: () => void;
}

export function SobreAppModal({ visible, onClose }: SobreAppModalProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <BaseModal
      visible={visible}
      onClose={onClose}
      title="Sobre o PetGuardian"
      subtitle="Identificação da Versão & Publicação"
      size="md"
    >
      <View style={styles.container}>
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

        {/* Card de Identificação da Versão & Commit Hash */}
        <View style={styles.commitCard}>
          <View style={styles.commitHeaderRow}>
            <Ionicons name="git-commit-outline" size={20} color={theme.primary} />
            <Text style={styles.commitCardTitle}>Hash do Commit de Referência</Text>
          </View>

          <Text style={styles.commitExplica}>
            Hash do commit no repositório GitHub correspondente à versão da entrega:
          </Text>

          {/* Caixa de Destaque com o Hash Completo */}
          <View style={styles.hashBox}>
            <Text style={styles.hashText} selectable>
              {APP_VERSION_INFO.commitHash || 'Build Oficial (Release)'}
            </Text>
          </View>

          {/* Mensagem do Commit de Referência */}
          {Boolean(APP_VERSION_INFO.commitMessage) ? (
            <View style={styles.commitMessageBox}>
              <View style={styles.commitMessageHeader}>
                <Ionicons name="chatbox-ellipses-outline" size={13} color={theme.badgePrimaryText} />
                <Text style={styles.commitMessageLabel}>Último Commit</Text>
              </View>
              <Text style={styles.commitMessageText} numberOfLines={2} ellipsizeMode="tail">
                "{APP_VERSION_INFO.commitMessage}"
              </Text>
            </View>
          ) : null}

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
              <Text style={styles.metaLabel}>Origem</Text>
              <Text style={styles.metaValue}>GitHub</Text>
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
      </View>
    </BaseModal>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
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
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 10,
      elevation: 3,
    },
    appName: {
      fontSize: 22,
      fontWeight: '800',
      color: theme.text,
    },
    appTagline: {
      fontSize: 12,
      color: theme.textSecondary,
      marginTop: 2,
      textAlign: 'center',
    },
    badgeSprint: {
      backgroundColor: theme.badgePrimaryBg,
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 20,
      marginTop: 8,
      borderWidth: 1,
      borderColor: theme.badgePrimaryBorder,
    },
    badgeSprintText: {
      color: theme.badgePrimaryText,
      fontSize: 12,
      fontWeight: '700',
    },
    commitCard: {
      backgroundColor: theme.cardSubtle,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1.5,
      borderColor: theme.border,
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
      color: theme.text,
    },
    commitExplica: {
      fontSize: 12,
      color: theme.textSecondary,
      marginBottom: 10,
      lineHeight: 16,
    },
    hashBox: {
      backgroundColor: theme.isDark ? '#0A0F1D' : '#0F172A',
      borderRadius: 10,
      padding: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.border,
    },
    hashText: {
      color: '#38BDF8',
      fontFamily: 'monospace',
      fontSize: 12,
      fontWeight: '700',
      textAlign: 'center',
      letterSpacing: 0.5,
    },
    commitMessageBox: {
      backgroundColor: theme.badgePrimaryBg,
      borderRadius: 8,
      paddingHorizontal: 10,
      paddingVertical: 8,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.badgePrimaryBorder,
    },
    commitMessageHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 3,
    },
    commitMessageLabel: {
      fontSize: 10,
      fontWeight: '700',
      color: theme.badgePrimaryText,
      textTransform: 'uppercase',
    },
    commitMessageText: {
      fontSize: 12,
      color: theme.text,
      fontStyle: 'italic',
      lineHeight: 16,
    },
    metaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      paddingTop: 8,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },
    metaItem: {
      alignItems: 'center',
    },
    metaLabel: {
      fontSize: 10,
      color: theme.textMuted,
      textTransform: 'uppercase',
      fontWeight: '600',
    },
    metaValue: {
      fontSize: 13,
      fontWeight: '700',
      color: theme.text,
      marginTop: 2,
    },
    metaDivider: {
      width: 1,
      height: 20,
      backgroundColor: theme.border,
    },
    infoBox: {
      backgroundColor: theme.cardSubtle,
      borderRadius: 14,
      padding: 14,
      borderWidth: 1,
      borderColor: theme.border,
      gap: 6,
    },
    infoSectionTitle: {
      fontSize: 13,
      fontWeight: '700',
      color: theme.text,
      marginBottom: 4,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    infoItem: {
      fontSize: 12,
      color: theme.textSecondary,
      lineHeight: 18,
    },
    bold: {
      fontWeight: '700',
      color: theme.text,
    },
    teamBox: {
      backgroundColor: theme.cardSubtle,
      borderRadius: 14,
      padding: 14,
      borderWidth: 1,
      borderColor: theme.border,
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
      backgroundColor: theme.badgePrimaryBg,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.badgePrimaryBorder,
    },
    avatarMiniText: {
      fontSize: 13,
      fontWeight: '700',
      color: theme.badgePrimaryText,
    },
    memberName: {
      fontSize: 13,
      fontWeight: '600',
      color: theme.text,
    },
    memberRm: {
      fontSize: 11,
      color: theme.textSecondary,
    },
  });
