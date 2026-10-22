import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { shadows } from '../../../utils/shadow';
import { LoadingSpinner } from '../../../components/LoadingSpinner';
import { PaginationControls } from '../../../components/PaginationControls';
import { HistoricoResponse } from '../../../types/historico';
import { TarefaResponse } from '../../../types/task';
import { formatarIsoParaBr } from '../../../utils/petUtils';
import { AppTheme, spacing, borderRadius } from '../../../constants/theme';
import { useThemedStyles, useTheme } from '../../../contexts/ThemeContext';

interface HealthHistoryProps {
  type: 'health';
  items: HistoricoResponse[];
  isLoading?: boolean;
  onAdd: () => void;
  onEdit: (item: HistoricoResponse) => void;
  onDelete: (item: HistoricoResponse) => void;
  pageSize?: number;
}

interface RoutineHistoryProps {
  type: 'routine';
  items: TarefaResponse[];
  isLoading?: boolean;
  pageSize?: number;
  onAdd?: never;
  onEdit?: never;
  onDelete?: never;
}

export type PetHistorySectionProps = HealthHistoryProps | RoutineHistoryProps;

const EVENT_ICON_RULES: Array<{ match: (s: string) => boolean; icon: keyof typeof MaterialCommunityIcons.glyphMap }> = [
  { match: (s) => s.includes('vacina'), icon: 'needle' },
  { match: (s) => s.includes('consulta'), icon: 'stethoscope' },
  { match: (s) => s.includes('exame'), icon: 'flask-outline' },
  { match: (s) => s.includes('verm') || s.includes('pulga') || s.includes('remédio') || s.includes('medica'), icon: 'pill' },
  { match: (s) => s.includes('cirurg') || s.includes('castra'), icon: 'hospital-box-outline' },
];

function getEventIcon(tipo: string): keyof typeof MaterialCommunityIcons.glyphMap {
  const lower = tipo.toLowerCase();
  const rule = EVENT_ICON_RULES.find((r) => r.match(lower));
  return rule ? rule.icon : 'calendar-check-outline';
}

function formatarDataConclusao(dataStr?: string | null): string {
  if (!dataStr) {
    return 'Concluído';
  }
  return formatarIsoParaBr(dataStr) || 'Concluído';
}

export function PetHistorySection(props: PetHistorySectionProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { type, items, isLoading = false, pageSize = 10 } = props;
  const [currentPage, setCurrentPage] = useState(0);

  const safeItems = items ?? [];
  const totalPages = Math.max(1, Math.ceil(safeItems.length / pageSize));
  const safePage = Math.min(currentPage, Math.max(0, totalPages - 1));
  const displayedItems = safeItems.slice(safePage * pageSize, (safePage + 1) * pageSize);

  const isHealth = type === 'health';

  return (
    <View style={styles.card}>
      {/* Header da Seção */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <MaterialCommunityIcons
            name={isHealth ? 'heart-pulse' : 'clipboard-pulse-outline'}
            size={20}
            color={isHealth ? '#DC2626' : '#2563EB'}
          />
          <Text style={styles.title}>
            {isHealth
              ? `Prontuário & Saúde (${safeItems.length})`
              : 'Histórico de Cuidados & Rotina'}
          </Text>
        </View>

        {isHealth ? (
          <TouchableOpacity style={styles.btnAdd} onPress={props.onAdd} activeOpacity={0.7}>
            <Ionicons name="add" size={14} color={theme.badgeDangerText} />
            <Text style={styles.btnAddText}>Registrar</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {isLoading ? (
        <LoadingSpinner
          message={isHealth ? 'Buscando prontuário médico...' : 'Buscando histórico consolidado...'}
          size="small"
        />
      ) : safeItems.length === 0 ? (
        <View style={styles.emptyBox}>
          <MaterialCommunityIcons
            name={isHealth ? 'medical-bag' : 'history'}
            size={28}
            color="#CBD5E1"
          />
          <Text style={styles.emptyTitle}>
            {isHealth ? 'Nenhum registro de saúde' : 'Nenhum registro concluído ainda.'}
          </Text>
          <Text style={styles.emptySubtitle}>
            {isHealth
              ? 'Mantenha vacinas, vermífugos e consultas do seu pet sempre em dia.'
              : 'As rotinas concluídas na Home são sincronizadas aqui!'}
          </Text>
        </View>
      ) : (
        <>
          {isHealth
            ? (displayedItems as HistoricoResponse[]).map((item) => (
                <View key={item.id} style={styles.itemRow}>
                  <View style={styles.iconCircleHealth}>
                    <MaterialCommunityIcons name={getEventIcon(item.tipoHist)} size={18} color="#DC2626" />
                  </View>
                  <View style={styles.itemContent}>
                    <Text style={styles.itemTitle}>{item.tipoHist}</Text>
                    <Text style={styles.itemDate}>
                      {formatarIsoParaBr(item.dataHist) || 'Data não informada'}
                    </Text>
                  </View>
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      onPress={() => props.onEdit(item)}
                      style={styles.btnAction}
                      hitSlop={8}
                    >
                      <Ionicons name="pencil-outline" size={16} color="#64748B" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => props.onDelete(item)}
                      style={styles.btnAction}
                      hitSlop={8}
                    >
                      <Ionicons name="trash-outline" size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            : (displayedItems as TarefaResponse[]).map((t) => (
                <View key={t.id} style={styles.itemRow}>
                  <View style={styles.iconCircleRoutine}>
                    <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                  </View>
                  <View style={styles.itemContent}>
                    <Text style={styles.itemTitle}>{t.titulo}</Text>
                    {t.descricao ? <Text style={styles.itemDesc}>{t.descricao}</Text> : null}
                    <Text style={styles.itemDate}>{formatarDataConclusao(t.conclusao)}</Text>
                  </View>
                  <View style={styles.xpBadge}>
                    <Text style={styles.xpText}>+{t.pontosTarefa} XP</Text>
                  </View>
                </View>
              ))}

          {totalPages > 1 ? (
            <PaginationControls
              currentPage={safePage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          ) : null}
        </>
      )}
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.card,
      borderRadius: borderRadius.xxl,
      padding: spacing.lg,
      borderWidth: 1,
      borderColor: theme.border,
      ...shadows.sm,
      marginBottom: spacing.md,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.md,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    title: {
      fontSize: 16,
      fontWeight: '800',
      color: theme.text,
    },
    btnAdd: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: theme.badgeDangerBg,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: borderRadius.md,
    },
    btnAddText: {
      fontSize: 12,
      fontWeight: '700',
      color: theme.badgeDangerText,
    },
    emptyBox: {
      alignItems: 'center',
      paddingVertical: spacing.lg,
      gap: 6,
    },
    emptyTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.text,
    },
    emptySubtitle: {
      fontSize: 12,
      color: theme.textSecondary,
      textAlign: 'center',
      lineHeight: 16,
      paddingHorizontal: spacing.lg,
    },
    itemRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.borderSubtle,
      gap: 12,
    },
    iconCircleHealth: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.badgeDangerBg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    iconCircleRoutine: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: theme.badgeSuccessBg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    itemContent: {
      flex: 1,
    },
    itemTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: theme.text,
    },
    itemDesc: {
      fontSize: 12,
      color: theme.textSecondary,
      marginTop: 2,
    },
    itemDate: {
      fontSize: 12,
      color: theme.textSecondary,
      marginTop: 2,
    },
    actionButtons: {
      flexDirection: 'row',
      gap: 8,
    },
    btnAction: {
      padding: 6,
    },
    xpBadge: {
      backgroundColor: theme.badgeSuccessBg,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: borderRadius.sm,
    },
    xpText: {
      fontSize: 11,
      fontWeight: '800',
      color: theme.badgeSuccessText,
    },
  });
