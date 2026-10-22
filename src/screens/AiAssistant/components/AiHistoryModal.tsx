import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, useThemedStyles } from '../../../contexts/ThemeContext';
import { AppTheme } from '../../../constants/theme';
import { useAiHistory } from '../../../hooks/useAiHistory';
import { PetResponse } from '../../../types/pet';
import { AiMessage } from '../../../types/ai';

interface AiHistoryModalProps {
  visible: boolean;
  onClose: () => void;
  pet?: PetResponse;
  activeSessionId?: string;
  onSelectSession: (sessionId: string, mensagens: AiMessage[]) => void;
  onNewChat: () => void;
}

export function AiHistoryModal({
  visible,
  onClose,
  pet,
  activeSessionId,
  onSelectSession,
  onNewChat,
}: AiHistoryModalProps) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useThemedStyles(createStyles);
  const { sessoes, isLoading: loading, loadingSessionId, selecionarSessao, removerSessao, iniciarNovaConversa } = useAiHistory({
    petId: pet?.id,
    visible,
    activeSessionId,
    onSelectSession,
    onNewChat,
    onClose,
  });

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
          {/* Header do Modal */}
          <View style={styles.modalHeader}>
            <View style={styles.titleRow}>
              <View style={styles.iconCircle}>
                <Ionicons name="chatbubbles-outline" size={18} color={theme.badgePrimaryText} />
              </View>
              <View>
                <Text style={styles.modalTitle}>Histórico de Conversas</Text>
                <Text style={styles.modalSubtitle}>
                  Conversas salvas de {pet?.nome || 'seu pet'}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              accessibilityRole="button"
              accessibilityLabel="Fechar histórico"
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Conteúdo do Modal */}
          {loading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator size="large" color={theme.primary} />
              <Text style={styles.loadingText}>Buscando conversas no banco de dados...</Text>
            </View>
          ) : sessoes.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons name="chatbubble-ellipses-outline" size={44} color={theme.textMuted} />
              <Text style={styles.emptyTitle}>Nenhuma conversa anterior</Text>
              <Text style={styles.emptySubtitle}>
                Envie uma dúvida sobre o {pet?.nome || 'pet'} no chat para que suas conversas fiquem registradas aqui.
              </Text>
            </View>
          ) : (
            <ScrollView
              style={styles.scrollArea}
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              {sessoes.map((item) => {
                const isActive = item.sessionId === activeSessionId;
                const isLoadingThis = loadingSessionId === item.sessionId;

                return (
                  <View
                    key={`sessao_${item.sessionId}`}
                    style={[styles.cardSession, isActive && styles.cardSessionActive]}
                  >
                    <TouchableOpacity
                      style={styles.cardMainClickable}
                      onPress={() => selecionarSessao(item.sessionId)}
                      disabled={isLoadingThis}
                      activeOpacity={0.7}
                    >
                      <View
                        style={[styles.sessionIconCircle, isActive && styles.sessionIconCircleActive]}
                      >
                        <Ionicons
                          name={isActive ? 'chatbubble' : 'chatbubble-outline'}
                          size={16}
                          color={isActive ? theme.badgePrimaryText : theme.textMuted}
                        />
                      </View>

                      <View style={styles.sessionTextCol}>
                        <View style={styles.sessionTitleRow}>
                          <Text
                            style={[styles.sessionTitle, isActive && styles.sessionTitleActive]}
                            numberOfLines={1}
                          >
                            {item.titulo || 'Conversa sem título'}
                          </Text>
                          {isActive ? (
                            <View style={styles.badgeAtiva}>
                              <Text style={styles.badgeAtivaText}>Ativa</Text>
                            </View>
                          ) : null}
                        </View>

                        <View style={styles.sessionMetaRow}>
                          <Text style={styles.sessionTimestamp}>
                            {item.lastActivity
                              ? item.lastActivity.replace('T', ' ').slice(0, 16)
                              : 'Recente'}
                          </Text>
                          <Text style={styles.sessionMetaDot}>•</Text>
                          <Text style={styles.sessionCountText}>
                            {item.totalMensagens} {item.totalMensagens === 1 ? 'msg' : 'msgs'}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>

                    {/* Ações da Sessão: Loading ou Lixeira */}
                    <View style={styles.cardActions}>
                      {isLoadingThis ? (
                        <ActivityIndicator size="small" color={theme.primary} />
                      ) : (
                        <TouchableOpacity
                          onPress={() => removerSessao(item.sessionId)}
                          style={styles.btnDeleteSession}
                          accessibilityRole="button"
                          accessibilityLabel="Excluir conversa"
                          hitSlop={10}
                          activeOpacity={0.6}
                        >
                          <Ionicons name="trash-outline" size={17} color={theme.textMuted} />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          )}

          {/* Rodapé com botão de Nova Conversa e Fechar */}
          <View style={styles.modalFooter}>
            <TouchableOpacity
              onPress={iniciarNovaConversa}
              style={styles.btnNovaConversa}
              activeOpacity={0.8}
            >
              <Ionicons name="add-circle-outline" size={18} color={theme.badgePrimaryText} />
              <Text style={styles.btnNovaConversaText}>Nova Conversa</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onClose}
              style={styles.btnFechar}
              activeOpacity={0.8}
            >
              <Text style={styles.btnFecharText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(15, 23, 42, 0.6)',
      justifyContent: 'flex-end',
    },
    modalContainer: {
      backgroundColor: theme.card,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      maxHeight: '85%',
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: 18,
      paddingBottom: 14,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    iconCircle: {
      width: 38,
      height: 38,
      borderRadius: 12,
      backgroundColor: theme.badgePrimaryBg,
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 16,
      fontWeight: '800',
      color: theme.text,
    },
    modalSubtitle: {
      fontSize: 12,
      color: theme.textSecondary,
      marginTop: 1,
    },
    closeBtn: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.surfaceMuted,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingBox: {
      paddingVertical: 32,
      paddingHorizontal: 20,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
    },
    loadingText: {
      fontSize: 13,
      color: theme.textSecondary,
    },
    emptyBox: {
      paddingVertical: 24,
      paddingHorizontal: 24,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    emptyTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: theme.text,
    },
    emptySubtitle: {
      fontSize: 13,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 18,
    },
    scrollArea: {
      maxHeight: 380,
    },
    scrollContent: {
      padding: 16,
      gap: 10,
    },
    cardSession: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surfaceMuted,
      borderRadius: 16,
      paddingVertical: 12,
      paddingHorizontal: 14,
      borderWidth: 1,
      borderColor: theme.border,
      justifyContent: 'space-between',
    },
    cardSessionActive: {
      backgroundColor: theme.badgePrimaryBg,
      borderColor: theme.badgePrimaryBorder,
    },
    cardMainClickable: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingRight: 8,
    },
    sessionIconCircle: {
      width: 34,
      height: 34,
      borderRadius: 10,
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sessionIconCircleActive: {
      backgroundColor: theme.card,
      borderColor: theme.badgePrimaryBorder,
    },
    sessionTextCol: {
      flex: 1,
      gap: 3,
    },
    sessionTitleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 6,
    },
    sessionTitle: {
      flex: 1,
      fontSize: 13,
      fontWeight: '700',
      color: theme.text,
    },
    sessionTitleActive: {
      color: theme.badgePrimaryText,
    },
    badgeAtiva: {
      backgroundColor: theme.badgePrimaryBg,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 6,
    },
    badgeAtivaText: {
      fontSize: 10,
      fontWeight: '800',
      color: theme.badgePrimaryText,
    },
    sessionMetaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    sessionTimestamp: {
      fontSize: 11,
      color: theme.textMuted,
      fontWeight: '500',
    },
    sessionMetaDot: {
      fontSize: 11,
      color: theme.border,
    },
    sessionCountText: {
      fontSize: 11,
      color: theme.textSecondary,
      fontWeight: '600',
    },
    cardActions: {
      paddingLeft: 6,
      alignItems: 'center',
      justifyContent: 'center',
    },
    btnDeleteSession: {
      padding: 6,
      borderRadius: 8,
    },
    modalFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingHorizontal: 16,
      paddingTop: 12,
    },
    btnNovaConversa: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      backgroundColor: theme.badgePrimaryBg,
      borderWidth: 1,
      borderColor: theme.badgePrimaryBorder,
      paddingVertical: 12,
      borderRadius: 14,
    },
    btnNovaConversaText: {
      fontSize: 13,
      fontWeight: '700',
      color: theme.badgePrimaryText,
    },
    btnFechar: {
      flex: 1,
      backgroundColor: theme.isDark ? theme.primary : '#0F172A',
      paddingVertical: 12,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
    },
    btnFecharText: {
      fontSize: 13,
      fontWeight: '700',
      color: '#FFFFFF',
    },
  });
