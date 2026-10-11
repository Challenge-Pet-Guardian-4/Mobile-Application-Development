import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

/**
 * Utilitário para interpretar e renderizar sintaxe simplificada de Markdown em elementos React Native.
 * Suporta títulos (H1, H2/H3), callouts/dicas de ouro, listas numeradas, listas com marcadores e parágrafos.
 */
export function renderMarkdownContent(markdown: string, corTema: string): React.ReactNode[] {
  const lines = markdown.split('\n');
  const elements: React.ReactNode[] = [];

  for (let idx = 0; idx < lines.length; idx++) {
    const rawLine = lines[idx];
    const line = rawLine.trim();

    if (!line) continue;

    // 1. Título H1 (# Título)
    if (line.startsWith('# ')) {
      elements.push(
        <Text key={idx} style={styles.mdH1}>
          {line.replace(/^#\s+/, '')}
        </Text>
      );
      continue;
    }

    // 2. Título H2 ou H3 (## ou ###)
    if (line.startsWith('## ') || line.startsWith('### ')) {
      elements.push(
        <Text key={idx} style={[styles.mdH2, { color: corTema }]}>
          {line.replace(/^#{2,3}\s+/, '')}
        </Text>
      );
      continue;
    }

    // 3. Blockquote / Dica de Ouro (> ...)
    if (line.startsWith('>')) {
      const calloutText = line.replace(/^>\s*/, '').replace(/\*\*/g, '');
      elements.push(
        <View key={idx} style={styles.mdCallout}>
          <MaterialCommunityIcons name="lightbulb-on-outline" size={18} color="#D97706" style={{ marginTop: 2 }} />
          <Text style={styles.mdCalloutText}>{calloutText}</Text>
        </View>
      );
      continue;
    }

    // 4. Lista numerada (1. , 2. )
    const numMatch = line.match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      const num = numMatch[1];
      const stepText = numMatch[2].replace(/\*\*/g, '');
      elements.push(
        <View key={idx} style={styles.mdStepRow}>
          <View style={[styles.mdStepBadge, { backgroundColor: corTema }]}>
            <Text style={styles.mdStepBadgeText}>{num}</Text>
          </View>
          <Text style={styles.mdStepText}>{stepText}</Text>
        </View>
      );
      continue;
    }

    // 5. Lista com marcadores (- ou *)
    if (line.startsWith('- ') || line.startsWith('* ')) {
      const bulletText = line.replace(/^[-*]\s+/, '').replace(/\*\*/g, '');
      elements.push(
        <View key={idx} style={styles.mdBulletRow}>
          <Text style={[styles.mdBulletDot, { color: corTema }]}>•</Text>
          <Text style={styles.mdBulletText}>{bulletText}</Text>
        </View>
      );
      continue;
    }

    // 6. Parágrafo comum
    const paragraphText = line.replace(/\*\*/g, '');
    elements.push(
      <Text key={idx} style={styles.mdParagraph}>
        {paragraphText}
      </Text>
    );
  }

  return elements;
}

const styles = StyleSheet.create({
  mdH1: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
    marginTop: 2,
  },
  mdH2: {
    fontSize: 13,
    fontWeight: '800',
    marginTop: 8,
    marginBottom: 4,
  },
  mdParagraph: {
    fontSize: 13,
    lineHeight: 20,
    color: '#334155',
    fontWeight: '400',
  },
  mdCallout: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: '#FFFBEB',
    padding: 10,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
    marginVertical: 4,
  },
  mdCalloutText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    color: '#92400E',
    fontWeight: '600',
  },
  mdStepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginVertical: 3,
  },
  mdStepBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 1,
  },
  mdStepBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#FFF',
  },
  mdStepText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    color: '#334155',
    fontWeight: '500',
  },
  mdBulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginVertical: 2,
  },
  mdBulletDot: {
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 18,
  },
  mdBulletText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    color: '#334155',
    fontWeight: '400',
  },
});
