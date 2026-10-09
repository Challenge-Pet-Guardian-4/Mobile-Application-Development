import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Linking } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { TrainingLesson, ConteudoAulaApiResponse } from '../../../types/training';
import { TrainingService } from '../../../services/trainings';
import { BaseModal } from '../../../components/BaseModal';

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
  const [conteudoNoSql, setConteudoNoSql] = useState<ConteudoAulaApiResponse | null>(null);
  const [isLoadingConteudo, setIsLoadingConteudo] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (visible && licao?.id) {
      const aulaId = Number(licao.id);
      if (!Number.isNaN(aulaId) && aulaId > 0) {
        setIsLoadingConteudo(true);
        TrainingService.getConteudoAula(aulaId)
          .then((data) => {
            if (isMounted) {
              setConteudoNoSql(data);
            }
          })
          .catch(() => {
            if (isMounted) {
              setConteudoNoSql(null);
            }
          })
          .finally(() => {
            if (isMounted) {
              setIsLoadingConteudo(false);
            }
          });
      } else {
        setConteudoNoSql(null);
      }
    } else {
      setConteudoNoSql(null);
    }

    return () => {
      isMounted = false;
    };
  }, [visible, licao?.id]);

  if (!visible || !licao) return null;

  const handleOpenLink = (url: string) => {
    const formattedUrl = url.startsWith('http://') || url.startsWith('https://') ? url : `https://${url}`;
    Linking.openURL(formattedUrl).catch(() => {});
  };

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

        {conteudoNoSql && (
          <View style={styles.badgeMongo}>
            <MaterialCommunityIcons name="leaf" size={14} color="#16A34A" />
            <Text style={styles.badgeMongoText}>
              {conteudoNoSql.tipoConteudo.replace('_', ' ')}
            </Text>
          </View>
        )}
      </View>

      {/* Seção Conteúdo Rico NoSQL (MongoDB) */}
      {isLoadingConteudo ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={corTrilha} />
          <Text style={styles.loadingText}>Carregando conteúdo pedagógico...</Text>
        </View>
      ) : (
        conteudoNoSql && (
          <View style={styles.conteudoNoSqlContainer}>
            <View style={styles.conteudoNoSqlHeader}>
              <MaterialCommunityIcons name="book-open-page-variant" size={18} color="#0F766E" />
              <Text style={styles.conteudoNoSqlTitle}>Conteúdo Pedagógico Aprofundado</Text>
            </View>
            <Text style={styles.corpoMarkdownText}>{conteudoNoSql.corpoMarkdown}</Text>

            {conteudoNoSql.linksRecursos && conteudoNoSql.linksRecursos.length > 0 && (
              <View style={styles.linksContainer}>
                <Text style={styles.linksHeader}>Links & Recursos Recomendados:</Text>
                {conteudoNoSql.linksRecursos.map((link, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.linkButton}
                    onPress={() => handleOpenLink(link)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="link-outline" size={16} color="#2563EB" />
                    <Text style={styles.linkButtonText} numberOfLines={1}>
                      {link}
                    </Text>
                    <Ionicons name="open-outline" size={14} color="#94A3B8" />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )
      )}

      {/* Passo a Passo Prático */}
      <Text style={styles.passosHeader}>Passo a Passo Prático com o Pet:</Text>

      {licao.passos.map((passo, idx) => (
        <View key={idx} style={styles.passoCard}>
          <View style={[styles.passoCircle, { backgroundColor: corTrilha }]}>
            <Text style={styles.passoNumber}>{idx + 1}</Text>
          </View>
          <Text style={styles.passoText}>{passo}</Text>
        </View>
      ))}

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

const styles = StyleSheet.create({
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
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  duoBadgeXPText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#D97706',
  },
  badgeMongo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  badgeMongoText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#15803D',
    textTransform: 'uppercase',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    marginBottom: 12,
  },
  loadingText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  conteudoNoSqlContainer: {
    backgroundColor: '#F0FDFA',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#CCFBF1',
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
    color: '#0F766E',
  },
  corpoMarkdownText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#334155',
    fontWeight: '400',
  },
  linksContainer: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#CCFBF1',
  },
  linksHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F766E',
    marginBottom: 6,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  linkButtonText: {
    flex: 1,
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '600',
  },
  passosHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: '#334155',
    marginBottom: 10,
  },
  passoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F1F5F9',
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
    color: '#334155',
    fontWeight: '500',
  },
  btnCompletarDuo: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 20,
    marginTop: 18,
    borderBottomWidth: 4,
    borderBottomColor: 'rgba(0,0,0,0.2)',
  },
  btnCompletarDuoText: {
    fontSize: 15,
    fontWeight: '900',
    color: '#FFF',
  },
});

