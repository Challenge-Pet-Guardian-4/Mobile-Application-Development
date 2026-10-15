import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Header } from '../../../components/Header';
import { AppTheme, colors, spacing } from '../../../constants/theme';
import { shadows } from '../../../utils/shadow';
import { useHomeData } from '../../../hooks/useHomeData';
import { useThemedStyles, useTheme } from '../../../contexts/ThemeContext';

interface HomeEmptyStateProps {
  status: ReturnType<typeof useHomeData>['status'];
  onNavigateToFamily: () => void;
  onNavigateToAi?: () => void;
  onNavigateToEducation?: () => void;
}

export function HomeEmptyState({
  status,
  onNavigateToFamily,
  onNavigateToAi,
  onNavigateToEducation,
}: HomeEmptyStateProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const isRefreshing = status.isFetching && !status.isLoading;

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={status.refetch}
            tintColor={colors.success.default}
          />
        }
      >
        <Header subtitle="Visão Geral do Cuidado" />

        {/* Card Principal de Boas-Vindas */}
        <View style={styles.welcomeCard}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons name="dog-side" size={44} color={colors.success.default} />
          </View>
          <Text style={styles.title}>Nenhum Pet Cadastrado</Text>
          <Text style={styles.subtitle}>
            Cadastre seu primeiro pet na aba Family Pet para desbloquear a rotina de cuidados diários, controle de vacinas e o score de bem-estar.
          </Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={onNavigateToFamily}
            activeOpacity={0.85}
          >
            <MaterialCommunityIcons name="plus-circle-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.primaryButtonText}>Cadastrar Pet na Family</Text>
          </TouchableOpacity>
        </View>

        {/* Seção Explicativa dos Recursos do App */}
        <View style={styles.sectionHeader}>
          <Ionicons name="sparkles" size={16} color={theme.primary} />
          <Text style={styles.sectionTitle}>O que você pode fazer no PetGuardian</Text>
        </View>

        <View style={styles.featuresContainer}>
          <View style={styles.featureCard}>
            <View style={[styles.featureIconBox, { backgroundColor: theme.isDark ? '#1E3A8A' : '#EFF6FF' }]}>
              <MaterialCommunityIcons name="calendar-check" size={24} color={colors.primary.default} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Rotina & Tarefas Diárias</Text>
              <Text style={styles.featureText}>
                Organize alimentação, medicamentos e passeios com lembretes automáticos e ganho de XP.
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={[styles.featureIconBox, { backgroundColor: theme.isDark ? '#3B1863' : '#F5F3FF' }]}>
              <MaterialCommunityIcons name="account-group" size={24} color="#8B5CF6" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Cuidado Familiar Compartilhado</Text>
              <Text style={styles.featureText}>
                Convide familiares e cuidadores para acompanhar e marcar tarefas concluídas em tempo real.
              </Text>
            </View>
          </View>

          <View style={styles.featureCard}>
            <View style={[styles.featureIconBox, { backgroundColor: theme.isDark ? '#451A03' : '#FFFBEB' }]}>
              <MaterialCommunityIcons name="robot-outline" size={24} color="#D97706" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Assistente IA Preventivo</Text>
              <Text style={styles.featureText}>
                Tire dúvidas sobre comportamento, nutrição e bem-estar do seu animal a qualquer momento.
              </Text>
            </View>
          </View>
        </View>

        {/* Atalhos Rápidos para outras abas */}
        {(onNavigateToEducation || onNavigateToAi) && (
          <View style={styles.shortcutsRow}>
            {onNavigateToEducation && (
              <TouchableOpacity
                style={styles.shortcutCard}
                onPress={onNavigateToEducation}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons name="school-outline" size={22} color={colors.primary.default} />
                <Text style={styles.shortcutTitle}>Trilhas Educativas</Text>
                <Text style={styles.shortcutDesc}>Aprenda cuidados essenciais</Text>
              </TouchableOpacity>
            )}

            {onNavigateToAi && (
              <TouchableOpacity
                style={styles.shortcutCard}
                onPress={onNavigateToAi}
                activeOpacity={0.8}
              >
                <MaterialCommunityIcons name="robot-confused-outline" size={22} color="#8B5CF6" />
                <Text style={styles.shortcutTitle}>Falar com a IA</Text>
                <Text style={styles.shortcutDesc}>Assistente inteligente</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingTop: Platform.OS === 'ios' ? 50 : 25,
    },
    scrollContent: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.xs,
      paddingBottom: 100,
      gap: spacing.md,
    },
    welcomeCard: {
      backgroundColor: theme.card,
      borderRadius: 24,
      padding: 24,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.border,
      ...shadows.sm,
      elevation: 2,
    },
    iconCircle: {
      width: 76,
      height: 76,
      borderRadius: 38,
      backgroundColor: theme.surfaceSubtle,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 10,
    },
    title: {
      fontSize: 18,
      fontWeight: '800',
      color: theme.text,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 13,
      color: theme.textSecondary,
      textAlign: 'center',
      marginTop: 6,
      lineHeight: 19,
      paddingHorizontal: 8,
    },
    primaryButton: {
      flexDirection: 'row',
      backgroundColor: colors.success.default,
      width: '100%',
      paddingVertical: 14,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 18,
      ...shadows.colored(colors.success.default, 0.3),
      elevation: 3,
    },
    primaryButtonText: {
      color: '#FFFFFF',
      fontWeight: '800',
      fontSize: 15,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginTop: 6,
      marginLeft: 4,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.textSecondary,
      letterSpacing: -0.2,
    },
    featuresContainer: {
      gap: 10,
    },
    featureCard: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.card,
      borderRadius: 18,
      padding: 14,
      borderWidth: 1,
      borderColor: theme.border,
      gap: 12,
    },
    featureIconBox: {
      width: 46,
      height: 46,
      borderRadius: 14,
      justifyContent: 'center',
      alignItems: 'center',
    },
    featureContent: {
      flex: 1,
    },
    featureTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.text,
      marginBottom: 2,
    },
    featureText: {
      fontSize: 12,
      color: theme.textSecondary,
      lineHeight: 16,
    },
    shortcutsRow: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 4,
    },
    shortcutCard: {
      flex: 1,
      backgroundColor: theme.card,
      borderRadius: 18,
      padding: 14,
      borderWidth: 1,
      borderColor: theme.border,
      alignItems: 'center',
      gap: 4,
    },
    shortcutTitle: {
      fontSize: 13,
      fontWeight: '700',
      color: theme.text,
      textAlign: 'center',
      marginTop: 2,
    },
    shortcutDesc: {
      fontSize: 11,
      color: theme.textSecondary,
      textAlign: 'center',
    },
  });
