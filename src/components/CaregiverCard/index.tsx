import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { spacing, borderRadius, AppTheme } from '../../constants/theme';
import { useTheme, useThemedStyles } from '../../contexts/ThemeContext';

export interface CaregiverCardProps {
  key?: React.Key;
  nome: string;
  email?: string;
  roleText?: string;
  isCurrentUser?: boolean;
  isPrincipal?: boolean;
  onPress?: () => void;
  onTransfer?: () => void;
  onRemove?: () => void;
}

export function CaregiverCard({
  nome,
  email,
  roleText,
  isCurrentUser = false,
  isPrincipal = false,
  onPress,
  onTransfer,
  onRemove,
}: CaregiverCardProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const initials = (nome || 'TU').substring(0, 2).toUpperCase();
  const displayName = isCurrentUser ? `${nome} (Você)` : nome;
  const displayRole = roleText || (isPrincipal ? 'Tutor Principal' : email || 'Co-cuidador');
  const badgeLabel = isPrincipal ? 'Tutor Principal' : 'Co-cuidador';

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={[styles.avatar, isPrincipal && styles.avatarPrincipal]}>
        <Text style={[styles.initials, isPrincipal && styles.initialsPrincipal]}>
          {initials}
        </Text>
      </View>

      <View style={styles.infoWrapper}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>
            {displayName}
          </Text>
          <View style={[styles.roleBadge, isPrincipal && styles.roleBadgePrincipal]}>
            <Text style={[styles.roleBadgeText, isPrincipal && styles.roleBadgeTextPrincipal]}>
              {badgeLabel}
            </Text>
          </View>
        </View>
        <Text style={styles.role} numberOfLines={2}>
          {displayRole}
        </Text>
      </View>

      {/* Ações de Gestão do Cuidador */}
      {(onTransfer || onRemove) ? (
        <View style={styles.actionsContainer}>
          {onTransfer ? (
            <TouchableOpacity
              style={styles.actionBtnTransfer}
              onPress={onTransfer}
              activeOpacity={0.7}
              hitSlop={8}
            >
              <MaterialCommunityIcons
                name="crown-outline"
                size={16}
                color={theme.badgeWarningText}
              />
            </TouchableOpacity>
          ) : null}

          {onRemove ? (
            <TouchableOpacity
              style={styles.actionBtnRemove}
              onPress={onRemove}
              activeOpacity={0.7}
              hitSlop={8}
            >
              <Ionicons
                name={isCurrentUser ? 'exit-outline' : 'trash-outline'}
                size={15}
                color={theme.badgeDangerText}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      ) : null}

      {(onPress && !onTransfer && !onRemove) ? (
        <Ionicons name="chevron-forward" size={18} color={theme.textMuted} />
      ) : null}
    </TouchableOpacity>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
      backgroundColor: theme.card,
      gap: spacing.md,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme.surfaceMuted,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarPrincipal: {
      backgroundColor: theme.badgePrimaryBg,
    },
    initials: {
      fontSize: 14,
      fontWeight: '800',
      color: theme.textSecondary,
    },
    initialsPrincipal: {
      color: theme.badgePrimaryText,
    },
    infoWrapper: {
      flex: 1,
      justifyContent: 'center',
    },
    nameRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    name: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.text,
      flexShrink: 1,
    },
    role: {
      fontSize: 11,
      color: theme.textSecondary,
      marginTop: 2,
    },
    roleBadge: {
      backgroundColor: theme.surfaceMuted,
      paddingVertical: 2,
      paddingHorizontal: 6,
      borderRadius: borderRadius.xs,
    },
    roleBadgePrincipal: {
      backgroundColor: theme.badgePrimaryBg,
    },
    roleBadgeText: {
      fontSize: 9,
      fontWeight: '700',
      color: theme.textSecondary,
    },
    roleBadgeTextPrincipal: {
      color: theme.badgePrimaryText,
    },
    actionsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    actionBtnTransfer: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.badgeWarningBg,
      justifyContent: 'center',
      alignItems: 'center',
    },
    actionBtnRemove: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: theme.badgeDangerBg,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
