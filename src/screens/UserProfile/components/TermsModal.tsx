import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { BaseModal } from '../../../components/BaseModal';
import { useThemedStyles } from '../../../contexts/ThemeContext';
import { AppTheme } from '../../../constants/theme';

interface TermsModalProps {
  visible: boolean;
  onClose: () => void;
}

export function TermsModal({ visible, onClose }: TermsModalProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <BaseModal
      visible={visible}
      onClose={onClose}
      title="Termos & Privacidade"
      subtitle="Diretrizes do ecossistema Clyvo"
      size="sm"
    >
      <Text style={styles.termsText}>
        O PetGuardian respeita a privacidade dos dados de sua família e de seus animais de estimação. Todos os registros de saúde e rotina são sincronizados com segurança em nosso backend em nuvem.
      </Text>
      <Text style={styles.termsTextParagraph}>
        As recomendações da IA Preventiva possuem caráter orientador e não substituem o diagnóstico de um médico veterinário presencial.
      </Text>
    </BaseModal>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    termsText: {
      fontSize: 13,
      color: theme.textSecondary,
      lineHeight: 20,
    },
    termsTextParagraph: {
      fontSize: 13,
      color: theme.textSecondary,
      lineHeight: 20,
      marginTop: 10,
    },
  });
