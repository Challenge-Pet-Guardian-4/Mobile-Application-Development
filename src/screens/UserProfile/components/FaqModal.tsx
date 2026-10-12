import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BaseModal } from '../../../components/BaseModal';
import { useThemedStyles } from '../../../contexts/ThemeContext';
import { AppTheme } from '../../../constants/theme';

interface FaqModalProps {
  visible: boolean;
  onClose: () => void;
}

const FAQ_ITEMS = [
  {
    pergunta: 'Como os pontos são creditados ao Pet?',
    resposta:
      'Ao concluir tarefas diárias na Home ou lições na aba de Trilhas, os pontos são registrados imediatamente na API Java e sobem a barra de bem-estar do pet ativo.',
  },
  {
    pergunta: 'Como convidar familiares?',
    resposta:
      'Acesse a aba Family Pet e clique no botão "+ Convidar Familiar" informando o e-mail cadastrado.',
  },
  {
    pergunta: 'Onde vejo o histórico de cuidados e saúde?',
    resposta:
      'Na aba Family Pet, toque no card do animal para abrir a Ficha Completa com todo o histórico consolidado.',
  },
];

export function FaqModal({ visible, onClose }: FaqModalProps) {
  const styles = useThemedStyles(createStyles);

  return (
    <BaseModal
      visible={visible}
      onClose={onClose}
      title="Perguntas Frequentes"
      subtitle="Dúvidas comuns sobre o PetGuardian"
      size="sm"
    >
      {FAQ_ITEMS.map((item, idx) => (
        <View key={idx} style={styles.faqItem}>
          <Text style={styles.faqQ}>{item.pergunta}</Text>
          <Text style={styles.faqA}>{item.resposta}</Text>
        </View>
      ))}
    </BaseModal>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    faqItem: {
      backgroundColor: theme.cardSubtle,
      borderRadius: 14,
      padding: 14,
      borderWidth: 1,
      borderColor: theme.border,
      marginBottom: 10,
    },
    faqQ: {
      fontSize: 14,
      fontWeight: '800',
      color: theme.text,
      marginBottom: 6,
    },
    faqA: {
      fontSize: 13,
      color: theme.textSecondary,
      lineHeight: 19,
    },
  });
