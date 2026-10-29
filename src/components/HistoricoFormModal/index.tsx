import React, { useState, useCallback, memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { BaseModal } from '../BaseModal';
import { CustomInput } from '../CustomInput';
import { CustomDateInput } from '../CustomDateInput';
import { CustomButton } from '../CustomButton';
import { HistoricoSchema, formatZodError } from '../../utils/schemas';
import { formatarIsoParaBr, normalizarDataNascParaIso, formatarDataHojeBr } from '../../utils/petUtils';
import { HistoricoFormSubmitData } from '../../types/historico';
import { useThemedStyles } from '../../contexts/ThemeContext';
import { AppTheme } from '../../constants/theme';

interface HistoricoFormModalProps {
  visible: boolean;
  onClose: () => void;
  mode?: 'create' | 'edit';
  petId: number;
  initialData?: {
    id?: number;
    tipoHist?: string;
    dataHist?: string;
  };
  onSubmit: (data: HistoricoFormSubmitData) => Promise<void> | void;
  isLoading?: boolean;
}

const SUGESTOES_EVENTOS = [
  'Vacina V10 / V8',
  'Vacina Raiva',
  'Consulta Veterinária',
  'Vermífugo',
  'Antipulgas / Carrapatos',
  'Exame Clínico',
  'Cirurgia / Castração',
];

interface HistoricoFormState {
  tipoHist: string;
  dataHist: string;
}

const HistoricoFormContent = memo(function HistoricoFormContent({
  onClose,
  mode = 'create',
  petId,
  initialData,
  onSubmit,
  isLoading = false,
}: Omit<HistoricoFormModalProps, 'visible'>) {
  const styles = useThemedStyles(createStyles);
  const [form, setForm] = useState<HistoricoFormState>(() => {
    if (initialData) {
      return {
        tipoHist: initialData.tipoHist || '',
        dataHist: initialData.dataHist ? formatarIsoParaBr(initialData.dataHist) : '',
      };
    }
    return {
      tipoHist: '',
      dataHist: formatarDataHojeBr(),
    };
  });

  const updateField = useCallback((key: keyof HistoricoFormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSubmit = () => {
    const validacao = HistoricoSchema.safeParse({
      tipoHist: form.tipoHist,
      dataHist: form.dataHist,
      petId,
    });

    if (!validacao.success) {
      Alert.alert('Atenção', formatZodError(validacao.error));
      return;
    }

    const isoDate = normalizarDataNascParaIso(form.dataHist);
    const isoDateTime = isoDate.includes('T') ? isoDate : `${isoDate}T12:00:00`;

    onSubmit({
      tipoHist: form.tipoHist.trim(),
      dataHist: isoDateTime,
      petId,
    });
  };

  return (
    <BaseModal
      visible={true}
      onClose={onClose}
      title={mode === 'edit' ? 'Editar Registro de Saúde' : 'Novo Registro de Saúde'}
      subtitle="Cadastre vacinas, consultas médicas, exames e procedimentos veterinários."
      size="md"
      footer={
        <View style={styles.modalButtonsRow}>
          <CustomButton
            title="Cancelar"
            variant="outline"
            onPress={onClose}
            style={{ flex: 1 }}
          />
          <CustomButton
            title={mode === 'edit' ? 'Salvar Alteração' : 'Registrar'}
            variant="primary"
            isLoading={isLoading}
            disabled={isLoading}
            onPress={handleSubmit}
            style={{ flex: 1 }}
          />
        </View>
      }
    >
      <CustomInput
        label="Tipo de Evento / Atendimento"
        placeholder="Ex: Vacina V10, Consulta de Rotina..."
        value={form.tipoHist}
        onChangeText={(t) => updateField('tipoHist', t)}
        maxLength={30}
      />

      {/* Chips de Sugestão Rápida */}
      <Text style={styles.suggestionsLabel}>Sugestões Rápidas:</Text>
      <View style={styles.chipsRow}>
        {SUGESTOES_EVENTOS.map((sugestao) => {
          const isSelected = form.tipoHist === sugestao;
          return (
            <TouchableOpacity
              key={sugestao}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => updateField('tipoHist', sugestao)}
              activeOpacity={0.7}
            >
              <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                {sugestao}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <CustomDateInput
        label="Data do Evento"
        placeholder="DD/MM/AAAA"
        value={form.dataHist}
        onChangeDate={(d) => updateField('dataHist', d)}
      />
    </BaseModal>
  );
});

export function HistoricoFormModal(props: HistoricoFormModalProps) {
  const { visible, initialData, petId } = props;
  if (!visible) {
    return null;
  }

  const formKey = initialData?.id ? `hist_${initialData.id}` : `pet_${petId}_create`;

  return <HistoricoFormContent key={formKey} {...props} />;
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    suggestionsLabel: {
      fontSize: 12,
      fontWeight: '700',
      color: theme.textSecondary,
      marginBottom: 6,
      marginTop: -4,
    },
    chipsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6,
      marginBottom: 14,
    },
    chip: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      backgroundColor: theme.surfaceMuted,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.border,
    },
    chipSelected: {
      backgroundColor: theme.badgePrimaryBg,
      borderColor: theme.badgePrimaryBorder,
    },
    chipText: {
      fontSize: 11,
      fontWeight: '600',
      color: theme.textSecondary,
    },
    chipTextSelected: {
      color: theme.badgePrimaryText,
      fontWeight: '700',
    },
    modalButtonsRow: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 10,
      marginBottom: 6,
    },
  });
