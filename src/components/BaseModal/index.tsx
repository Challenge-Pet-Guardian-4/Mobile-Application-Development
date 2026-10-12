import React, { ReactNode, useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, KeyboardAvoidingView, Platform, ScrollView, DimensionValue, Keyboard, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { shadows } from '../../utils/shadow';
import { colors, layout, borderRadius, AppTheme } from '../../constants/theme';
import { useThemedStyles, useTheme } from '../../contexts/ThemeContext';

export type ModalSize = 'sm' | 'md' | 'lg';

interface BaseModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  showCloseButton?: boolean;
  size?: ModalSize;
  maxHeight?: DimensionValue;
}

export function BaseModal({
  visible,
  onClose,
  title,
  subtitle,
  children,
  showCloseButton = true,
  size = 'md',
  maxHeight,
}: BaseModalProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => setKeyboardHeight(e.endCoordinates.height)
    );
    const hideSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardHeight(0)
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const isKeyboardVisible = keyboardHeight > 0;

  // Largura máxima e altura calculadas proporcionalmente de acordo com a variante (SOLID & Clean Code)
  const computedMaxWidth = Math.min(layout.modal.width[size], windowWidth - 32);

  const dynamicBodyMaxHeight = useMemo(() => {
    if (typeof maxHeight === 'number') {
      return maxHeight;
    }
    if (isKeyboardVisible) {
      const available = windowHeight - keyboardHeight - (Platform.OS === 'ios' ? 160 : 130);
      return Math.max(160, Math.min(available, windowHeight * 0.45));
    }
    // Proporção ergonômica padrão: 70% da altura da tela para evitar cortes ou overflow
    return Math.min(layout.modal.maxHeightMaxPx, windowHeight * layout.modal.maxHeightRatio);
  }, [isKeyboardVisible, keyboardHeight, windowHeight, maxHeight]);

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View
        style={[
          styles.overlay,
          isKeyboardVisible && styles.overlayKeyboard,
        ]}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardAvoid}
        >
          <View style={[styles.card, { maxWidth: computedMaxWidth }]}>
            <View style={styles.header}>
              <View style={styles.titleWrapper}>
                <Text style={styles.title}>{title}</Text>
                {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
              </View>
              {showCloseButton ? (
                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={onClose}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="close" size={20} color={theme.textMuted} />
                </TouchableOpacity>
              ) : null}
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
              style={{ maxHeight: dynamicBodyMaxHeight }}
              contentContainerStyle={styles.body}
              keyboardShouldPersistTaps="handled"
              bounces={false}
            >
              {children}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: colors.overlay.dark,
      justifyContent: 'center',
      padding: 20,
    },
    overlayKeyboard: {
      justifyContent: 'flex-start',
      paddingTop: Platform.OS === 'ios' ? 56 : 38,
      paddingBottom: 10,
    },
    keyboardAvoid: {
      width: '100%',
      alignItems: 'center',
    },
    card: {
      backgroundColor: theme.card,
      borderRadius: borderRadius.xxl,
      borderColor: theme.border,
      borderWidth: theme.isDark ? 1 : 0,
      padding: layout.modal.cardPadding,
      width: '100%',
      elevation: 10,
      ...shadows.xl,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: 14,
    },
    titleWrapper: {
      flex: 1,
      marginRight: 12,
    },
    title: {
      fontSize: 18,
      fontWeight: '800',
      color: theme.text,
      letterSpacing: -0.3,
    },
    subtitle: {
      fontSize: 13,
      color: theme.textSecondary,
      marginTop: 2,
      lineHeight: 18,
    },
    closeBtn: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.surfaceMuted,
      justifyContent: 'center',
      alignItems: 'center',
    },
    body: {
      paddingBottom: 6,
    },
  });
