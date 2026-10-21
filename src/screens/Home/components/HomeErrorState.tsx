import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Header } from '../../../components/Header';
import { AppTheme, spacing } from '../../../constants/theme';
import { shadows } from '../../../utils/shadow';
import { useHomeData } from '../../../hooks/useHomeData';
import { useThemedStyles, useTheme } from '../../../contexts/ThemeContext';

import axios from 'axios';
import { useSession } from '../../../hooks/useSession';

interface HomeErrorStateProps {
  status: ReturnType<typeof useHomeData>['status'];
}

export function HomeErrorState({ status }: HomeErrorStateProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const insets = useSafeAreaInsets();
  const { logout } = useSession();
  const isRefreshing = status.isFetching && !status.isLoading;

  const isAuthError =
    (axios.isAxiosError(status.error) && status.error.response?.status === 401) ||
    status.error?.message?.toLowerCase().includes('sessão expirada') ||
    status.error?.message?.toLowerCase().includes('não autorizada') ||
    status.error?.message?.toLowerCase().includes('login');

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 16) }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 }]}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={status.refetch}
            tintColor={theme.primary}
          />
        }
      >
        <Header subtitle="Visão Geral do Cuidado" />
        <View style={styles.cardContainer}>
          <View style={styles.errorCard}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="alert-circle-outline" size={44} color="#EF4444" />
            </View>
            <Text style={styles.title}>Algo deu errado</Text>
            <Text style={styles.text}>
              {status.error?.message || 'Não foi possível carregar os dados do painel.'}
            </Text>
            <TouchableOpacity style={styles.button} onPress={status.refetch} activeOpacity={0.8}>
              <Ionicons name="reload" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.buttonText}>Tentar novamente</Text>
            </TouchableOpacity>

            {isAuthError ? (
              <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.primary, marginTop: 10 }]}
                onPress={logout}
                activeOpacity={0.8}
              >
                <Ionicons name="log-in-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.buttonText}>Fazer Login Novamente</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContent: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.xs,
      paddingBottom: 24,
      gap: spacing.md,
    },
    cardContainer: {
      width: '100%',
      paddingVertical: spacing.sm,
    },
    errorCard: {
      backgroundColor: theme.card,
      borderRadius: 24,
      padding: 28,
      alignItems: 'center',
      width: '100%',
      marginVertical: 16,
      borderWidth: 1,
      borderColor: theme.isDark ? '#7F1D1D' : 'rgba(254, 202, 202, 0.8)',
      ...shadows.colored('#EF4444', 0.05),
      elevation: 2,
    },
    iconCircle: {
      width: 76,
      height: 76,
      borderRadius: 38,
      backgroundColor: theme.isDark ? '#450A0A' : '#FEF2F2',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
    },
    title: {
      fontSize: 18,
      fontWeight: '800',
      color: theme.isDark ? '#FCA5A5' : '#991B1B',
      marginTop: 8,
      textAlign: 'center',
    },
    text: {
      fontSize: 13,
      color: theme.textSecondary,
      textAlign: 'center',
      marginTop: 6,
      lineHeight: 18,
    },
    button: {
      flexDirection: 'row',
      width: '100%',
      paddingVertical: 14,
      backgroundColor: '#EF4444',
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
      ...shadows.colored('#EF4444', 0.25),
      elevation: 3,
    },
    buttonText: {
      color: '#FFFFFF',
      fontWeight: '800',
      fontSize: 15,
    },
  });
