import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAiAssistantScreen } from '../../../hooks/useAiAssistantScreen';
import { AppTheme } from '../../../constants/theme';
import { useTheme, useThemedStyles } from '../../../contexts/ThemeContext';

interface AiChatMessagesProps {
  chat: ReturnType<typeof useAiAssistantScreen>['chat'];
}

export function AiChatMessages({ chat }: AiChatMessagesProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const hasMessages = (chat?.messages?.length ?? 0) > 0;

  return (
    <View style={styles.chatSection}>
      <Text style={styles.chatSectionTitle}>Conversa com a IA</Text>

      {!hasMessages && !chat?.isSending && (
        <View style={styles.emptyChatWrapper}>
          <View style={styles.emptyChatIconBg}>
            <MaterialCommunityIcons name="chat-processing-outline" size={28} color={theme.primary} />
          </View>
          <Text style={styles.emptyChatTitle}>Como a Guardian AI pode ajudar hoje?</Text>
          <Text style={styles.emptyChatDesc}>
            Envie perguntas sobre alimentação, vacinas, primeiros socorros ou rotina de cuidados do seu pet.
          </Text>
        </View>
      )}

      {chat?.messages?.map((msg) => {
        const isUser = msg.sender === 'user';
        const isError = msg.id.startsWith('err_') || msg.id.startsWith('ai_err_');
        return (
          <View
            key={msg.id}
            style={[styles.msgWrapper, isUser ? styles.msgUserWrapper : styles.msgAiWrapper]}
          >
            {!isUser && (
              <View style={[styles.aiAvatar, isError && styles.aiAvatarError]}>
                <MaterialCommunityIcons
                  name={isError ? 'alert-circle-outline' : 'robot'}
                  size={16}
                  color={isError ? '#DC2626' : theme.primary}
                />
              </View>
            )}
            <View
              style={[
                styles.msgBubble,
                isUser ? styles.msgBubbleUser : styles.msgBubbleAi,
                isError && styles.msgBubbleError,
              ]}
            >
              <Text
                style={[
                  styles.msgText,
                  isUser ? styles.msgTextUser : styles.msgTextAi,
                  isError && styles.msgTextError,
                ]}
              >
                {msg.text}
              </Text>
              <Text style={[styles.msgTime, isUser ? styles.msgTimeUser : styles.msgTimeAi]}>
                {msg.timestamp}
              </Text>
            </View>
          </View>
        );
      })}

      {chat?.isSending && (
        <View style={[styles.msgWrapper, styles.msgAiWrapper]}>
          <View style={styles.aiAvatar}>
            <MaterialCommunityIcons name="robot" size={16} color={theme.primary} />
          </View>
          <View style={[styles.msgBubble, styles.msgBubbleAi, styles.sendingBubble]}>
            <ActivityIndicator size="small" color={theme.primary} style={{ marginRight: 8 }} />
            <Text style={styles.msgTextAi}>Consultando inteligência preventiva...</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    chatSection: {
      gap: 10,
      marginTop: 4,
    },
    chatSectionTitle: {
      fontSize: 15,
      fontWeight: '800',
      color: theme.text,
      marginBottom: 4,
    },
    msgWrapper: {
      flexDirection: 'row',
      gap: 8,
      alignItems: 'flex-end',
      marginVertical: 3,
    },
    msgUserWrapper: {
      justifyContent: 'flex-end',
    },
    msgAiWrapper: {
      justifyContent: 'flex-start',
    },
    aiAvatar: {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: theme.badgePrimaryBg,
      justifyContent: 'center',
      alignItems: 'center',
    },
    aiAvatarError: {
      backgroundColor: theme.badgeDangerBg,
    },
    msgBubble: {
      maxWidth: '82%',
      paddingVertical: 12,
      paddingHorizontal: 14,
      borderRadius: 18,
    },
    msgBubbleUser: {
      backgroundColor: theme.primary,
      borderBottomRightRadius: 4,
    },
    msgBubbleAi: {
      backgroundColor: theme.card,
      borderWidth: 1,
      borderColor: theme.border,
      borderBottomLeftRadius: 4,
    },
    msgBubbleError: {
      backgroundColor: theme.badgeDangerBg,
      borderColor: theme.badgeDangerBorder,
    },
    sendingBubble: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    msgText: {
      fontSize: 13,
      lineHeight: 19,
    },
    msgTextUser: {
      color: '#FFFFFF',
    },
    msgTextAi: {
      color: theme.text,
    },
    msgTextError: {
      color: theme.badgeDangerText,
    },
    msgTime: {
      fontSize: 10,
      marginTop: 4,
      alignSelf: 'flex-end',
    },
    msgTimeUser: {
      color: 'rgba(255, 255, 255, 0.75)',
    },
    msgTimeAi: {
      color: theme.textMuted,
    },
    emptyChatWrapper: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 28,
      paddingHorizontal: 20,
      backgroundColor: theme.surfaceSubtle,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: theme.border,
      gap: 8,
      marginVertical: 8,
    },
    emptyChatIconBg: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: theme.badgePrimaryBg,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 4,
    },
    emptyChatTitle: {
      fontSize: 14,
      fontWeight: '800',
      color: theme.text,
      textAlign: 'center',
    },
    emptyChatDesc: {
      fontSize: 12,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 18,
      maxWidth: 280,
    },
  });
