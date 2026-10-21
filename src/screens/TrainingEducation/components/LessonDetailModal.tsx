import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { TrainingLesson } from '../../../types/training';
import { useConteudoAula } from '../../../hooks/useTrainings';
import { BaseModal } from '../../../components/BaseModal';
import { renderMarkdownContent } from '../../../utils/markdownUtils';
import { useTheme, useThemedStyles } from '../../../contexts/ThemeContext';
import { AppTheme } from '../../../constants/theme';

interface LessonDetailModalProps {
  visible: boolean;
  licao?: TrainingLesson;
  corTrilha?: string;
  isConcluindo: boolean;
  onClose: () => void;
  onConcluir: () => void;
}

export function LessonDetailModal({
  visible,
  licao,
  corTrilha = '#58CC02',
  isConcluindo,
  onClose,
  onConcluir,
}: LessonDetailModalProps) {
  const { theme, isDark } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { data: conteudoNoSql, isLoading: isLoadingConteudo } = useConteudoAula(licao?.id, visible);

  if (!visible || !licao) {
    return null;
  }

  const handleOpenLink = (url: string) => {
    const formattedUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
    Linking.openURL(formattedUrl).catch(() => {});
  };

  const textoConteudo = conteudoNoSql?.corpoMarkdown || licao.conteudo;
  const tipoFormato = conteudoNoSql?.tipoConteudo || 'PASSO_A_PASSO';

  return (
    <BaseModal
      visible={visible}
      onClose={onClose}
      title={licao.titulo}
      subtitle={licao.descricao}
      size="lg"
    >
      <View style={styles.duoBadgeRow}>
        <View style={styles.duoBadgeXP}>
          <MaterialCommunityIcons name="star" size={16} color="#FF9600" />
          <Text style={styles.duoBadgeXPText}>+{licao.pontos} PONTOS XP</Text>
        </View>

        {textoConteudo ? (
          <View style={styles.badgeMongo}>
            <MaterialCommunityIcons name="leaf" size={14} color="#16A34A" />
            <Text style={styles.badgeMongoText}>
              {tipoFormato.replace('_', ' ')}
            </Text>
          </View>
        ) : null}
      </View>

      {/* Seção Conteúdo Rico NoSQL (MongoDB) */}
      {isLoadingConteudo && !textoConteudo ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={corTrilha} />
          <Text style={styles.loadingText}>Carregando conteúdo pedagógico...</Text>
        </View>
      ) : textoConteudo ? (
        <View style={styles.conteudoNoSqlContainer}>
          <View style={styles.conteudoNoSqlHeader}>
            <MaterialCommunityIcons name="book-open-page-variant" size={18} color={isDark ? '#2DD4BF' : '#0F766E'} />
            <Text style={styles.conteudoNoSqlTitle}>Conteúdo Pedagógico Aprofundado</Text>
          </View>

          <View style={styles.markdownWrapper}>
            {renderMarkdownContent(textoConteudo, corTrilha, isDark)}
          </View>

          {(conteudoNoSql?.linksRecursos && conteudoNoSql.linksRecursos.length > 0) ? (
            <View style={styles.linksContainer}>
              <Text style={styles.linksHeader}>Links & Recursos Recomendados:</Text>
              {conteudoNoSql.linksRecursos.map((link, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.linkButton}
                  onPress={() => handleOpenLink(link)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="link-outline" size={16} color={theme.primary} />
                  <Text style={styles.linkButtonText} numberOfLines={1}>
                    {link}
                  </Text>
                  <Ionicons name="open-outline" size={14} color={theme.textMuted} />
                </TouchableOpacity>
              ))}
            </View>
          ) : null}
        </View>
      ) : (
        /* Fallback de passos apenas se não houver conteúdo rico carregado */
        (licao.passos && licao.passos.length > 0) ? (
          <View style={styles.passosContainer}>
            <Text style={styles.passosHeader}>Passo a Passo Prático com o Pet:</Text>
            {licao.passos.map((passo, idx) => (
              <View key={idx} style={styles.passoCard}>
                <View style={[styles.passoCircle, { backgroundColor: corTrilha }]}>
                  <Text style={styles.passoNumber}>{idx + 1}</Text>
                </View>
                <Text style={styles.passoText}>{passo}</Text>
              </View>
            ))}
          </View>
        ) : null
      )}

      <TouchableOpacity
        style={[
          styles.btnCompletarDuo,
          licao.concluido
            ? { backgroundColor: '#EF4444', opacity: isConcluindo ? 0.7 : 1 }
            : { backgroundColor: corTrilha, opacity: isConcluindo ? 0.7 : 1 },
        ]}
        onPress={onConcluir}
        disabled={isConcluindo}
        activeOpacity={0.8}
      >
        {isConcluindo ? (
          <ActivityIndicator color="#FFF" style={{ marginRight: 8 }} />
        ) : licao.concluido ? (
          <Ionicons name="close-circle-outline" size={22} color="#FFF" style={{ marginRight: 8 }} />
        ) : (
          <Ionicons name="checkmark-done" size={22} color="#FFF" style={{ marginRight: 8 }} />
        )}
        <Text style={styles.btnCompletarDuoText}>
          {isConcluindo
            ? 'Salvando...'
            : licao.concluido
            ? 'Desmarcar Aula Concluída'
            : 'Concluir & Ganhar Pontos!'}
        </Text>
      </TouchableOpacity>
    </BaseModal>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    duoBadgeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginBottom: 14,
    },
    duoBadgeXP: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: theme.badgeWarningBg,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.badgeWarningBorder,
    },
    duoBadgeXPText: {
      fontSize: 12,
      fontWeight: '900',
      color: theme.badgeWarningText,
    },
    badgeMongo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      backgroundColor: theme.badgeSuccessBg,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.badgeSuccessBorder,
    },
    badgeMongoText: {
      fontSize: 11,
      fontWeight: '800',
      color: theme.badgeSuccessText,
      textTransform: 'uppercase',
    },
    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      gap: 8,
      backgroundColor: theme.cardSubtle,
      borderRadius: 12,
      marginBottom: 12,
    },
    loadingText: {
      fontSize: 12,
      color: theme.textSecondary,
      fontWeight: '600',
    },
    conteudoNoSqlContainer: {
      backgroundColor: theme.isDark ? theme.surfaceMuted : '#F0FDFA',
      borderRadius: 16,
      padding: 14,
      marginBottom: 14,
      borderWidth: 1,
      borderColor: theme.isDark ? theme.border : '#CCFBF1',
    },
    conteudoNoSqlHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 8,
    },
    conteudoNoSqlTitle: {
      fontSize: 13,
      fontWeight: '800',
      color: theme.isDark ? '#2DD4BF' : '#0F766E',
    },
    markdownWrapper: {
      gap: 6,
    },
    linksContainer: {
      marginTop: 12,
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: theme.isDark ? theme.border : '#CCFBF1',
    },
    linksHeader: {
      fontSize: 12,
      fontWeight: '700',
      color: theme.isDark ? '#2DD4BF' : '#0F766E',
      marginBottom: 6,
    },
    linkButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: theme.card,
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderRadius: 10,
      marginBottom: 6,
      borderWidth: 1,
      borderColor: theme.border,
    },
    linkButtonText: {
      flex: 1,
      fontSize: 12,
      color: theme.primary,
      fontWeight: '600',
    },
    passosContainer: {
      marginBottom: 10,
    },
    passosHeader: {
      fontSize: 14,
      fontWeight: '800',
      color: theme.text,
      marginBottom: 10,
    },
    passoCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.cardSubtle,
      borderRadius: 14,
      padding: 12,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: theme.border,
    },
    passoCircle: {
      width: 24,
      height: 24,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    passoNumber: {
      fontSize: 12,
      fontWeight: 'bold',
      color: '#FFF',
    },
    passoText: {
      flex: 1,
      fontSize: 13,
      color: theme.text,
      fontWeight: '500',
    },
    btnCompletarDuo: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 15,
      borderRadius: 20,
      marginTop: 18,
      marginBottom: 16,
      borderBottomWidth: 4,
      borderBottomColor: 'rgba(0,0,0,0.2)',
    },
    btnCompletarDuoText: {
      fontSize: 15,
      fontWeight: '900',
      color: '#FFF',
    },
  });
