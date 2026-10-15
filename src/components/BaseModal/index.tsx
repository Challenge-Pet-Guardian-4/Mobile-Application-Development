import React, { ReactNode, useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, KeyboardAvoidingView, Platform, ScrollView, DimensionValue, Keyboard, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
  footer?: ReactNode;
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
  footer,
  showCloseButton = true,
  size = 'md',
  maxHeight,
}: BaseModalProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();
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

  // Largura máxima calculada proporcionalmente de acordo com a variante (SOLID & Clean Code)
  const computedMaxWidth = Math.min(layout.modal.width[size], windowWidth - 28);

  // Considera margem de respiro para barra de status e botões de navegação do Android/iOS
  const bottomInset = Math.max(insets.bottom, Platform.OS === 'android' ? 24 : 16);
  const topInset = Math.max(insets.top, Platform.OS === 'android' ? 24 : 16);
  const safeScreenHeight = windowHeight - topInset - bottomInset - 16;

  // Altura máxima proporcional e responsiva do card para garantir que nunca transborde a tela
  const computedCardMaxHeight = useMemo(() => {
    if (isKeyboardVisible) {
      const available = windowHeight - keyboardHeight - topInset - 20;
      return Math.max(260, Math.min(available, windowHeight * 0.82));
    }
    if (typeof maxHeight === 'number') {
      return Math.min(maxHeight, safeScreenHeight);
    }
    // Permite que o modal aproveite confortavelmente até 92% da altura útil da tela em celulares
    return Math.min(740, Math.round(safeScreenHeight * 0.94));
  }, [isKeyboardVisible, keyboardHeight, windowHeight, maxHeight, safeScreenHeight, topInset]);

  const dynamicBodyMaxHeight = useMemo(() => {
    // Header tem ~56px e o padding do card tem 34px (18 top + 16 bottom)
    const cardOverhead = 90;
    return Math.max(180, computedCardMaxHeight - cardOverhead);
  }, [computedCardMaxHeight]);

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
          {
            paddingTop: topInset + 8,
            paddingBottom: bottomInset + 12,
          },
          isKeyboardVisible && styles.overlayKeyboard,
        ]}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardAvoid}
        >
          <View
            style={[
              styles.card,
              {
                maxWidth: computedMaxWidth,
                maxHeight: computedCardMaxHeight,
              },
            ]}
          >
            <View style={styles.header}>
              <View style={styles.titleWrapper}>
                <Text style={styles.title}>{title}</Text>
                {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
              </View>
              {showCloseButton ? (
                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={onClose}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                >
                  <Ionicons name="close" size={20} color={theme.textMuted} />
                </TouchableOpacity>
              ) : null}
            </View>

            <ScrollView
              showsVerticalScrollIndicator={true}
              nestedScrollEnabled={true}
              style={[styles.scrollView, { maxHeight: dynamicBodyMaxHeight }]}
              contentContainerStyle={styles.body}
              keyboardShouldPersistTaps="handled"
              bounces={false}
            >
              {children}

              {footer ? (
                <View style={styles.footerContainer}>
                  {footer}
                </View>
              ) : null}
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
      alignItems: 'center',
      paddingHorizontal: 14,
      paddingVertical: Platform.OS === 'android' ? 14 : 20,
    },
    overlayKeyboard: {
      justifyContent: 'flex-start',
      paddingTop: Platform.OS === 'ios' ? 44 : 24,
      paddingBottom: 8,
    },
    keyboardAvoid: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
    },
    card: {
      backgroundColor: theme.card,
      borderRadius: borderRadius.xxl,
      borderColor: theme.border,
      borderWidth: theme.isDark ? 1 : 0,
      paddingHorizontal: 18,
      paddingTop: 18,
      paddingBottom: 16,
      width: '100%',
      flexDirection: 'column',
      elevation: 10,
      ...shadows.xl,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: 10,
      flexShrink: 0,
    },
    titleWrapper: {
      flex: 1,
      marginRight: 10,
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
    scrollView: {
      width: '100%',
    },
    body: {
      paddingTop: 6,
      paddingBottom: 10,
    },
    footerContainer: {
      marginTop: 14,
      paddingTop: 2,
      paddingBottom: 16,
    },
  });
