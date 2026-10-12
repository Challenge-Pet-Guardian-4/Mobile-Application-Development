import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EdgeInsets } from 'react-native-safe-area-context';
import { useAiAssistantScreen } from '../../../hooks/useAiAssistantScreen';
import { AppTheme } from '../../../constants/theme';
import { useTheme, useThemedStyles } from '../../../contexts/ThemeContext';

interface AiChatInputBarProps {
  chat: ReturnType<typeof useAiAssistantScreen>['chat'];
  insets: EdgeInsets;
}

export function AiChatInputBar({ chat, insets }: AiChatInputBarProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const isSendDisabled = !chat.inputText.trim() || chat.isSending;

  return (
    <View
      style={[
        styles.fixedBottomContainer,
        {
          paddingBottom: chat.isKeyboardVisible
            ? (Platform.OS === 'ios' ? 20 : 36)
            : Math.max(insets.bottom + 14, Platform.OS === 'ios' ? 32 : 24),
        },
      ]}
    >
      {/* Carrossel Fixo de Sugestões de Perguntas Rápidas */}
      <View style={styles.fixedSuggestionsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.suggestionsScroll}
          keyboardShouldPersistTaps="handled"
        >
          {(chat?.sugestoesRapidas ?? []).map((sug: string, i: number) => (
            <TouchableOpacity
              key={i}
              style={styles.suggestionChip}
              onPress={() => chat.handleSend(sug)}
              activeOpacity={0.75}
            >
              <Ionicons name="sparkles" size={12} color={theme.primary} />
              <Text style={styles.suggestionChipText}>{sug}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Campo de Input Cápsula */}
      <View style={styles.inputInnerWrapper}>
        <TextInput
          style={styles.chatInput}
          placeholder="Escreva sua dúvida para a IA..."
          placeholderTextColor={theme.textMuted}
          value={chat.inputText}
          onChangeText={chat.setInputText}
          onSubmitEditing={() => chat.handleSend()}
          returnKeyType="send"
        />
        <TouchableOpacity
          style={[styles.btnSend, !chat.inputText.trim() && { opacity: 0.35 }]}
          onPress={() => chat.handleSend()}
          disabled={isSendDisabled}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-up" size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    fixedBottomContainer: {
      backgroundColor: theme.card,
      paddingHorizontal: 16,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: theme.border,
      gap: 12,
    },
    fixedSuggestionsWrapper: {
      marginBottom: 2,
    },
    suggestionsScroll: {
      gap: 8,
      paddingVertical: 2,
    },
    suggestionChip: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.badgePrimaryBg,
      paddingVertical: 7,
      paddingHorizontal: 14,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.badgePrimaryBorder,
      gap: 6,
    },
    suggestionChipText: {
      fontSize: 12,
      fontWeight: '700',
      color: theme.badgePrimaryText,
    },
    inputInnerWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surfaceSubtle,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 24,
      paddingHorizontal: 16,
      paddingVertical: 6,
      minHeight: 54,
      gap: 10,
    },
    chatInput: {
      flex: 1,
      paddingHorizontal: 6,
      paddingVertical: 10,
      fontSize: 14,
      color: theme.text,
      minHeight: 42,
    },
    btnSend: {
      width: 38,
      height: 38,
      borderRadius: 19,
      backgroundColor: theme.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
