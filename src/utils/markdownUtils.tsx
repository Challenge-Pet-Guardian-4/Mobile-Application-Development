import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

/**
 * Utilitário para interpretar e renderizar sintaxe simplificada de Markdown em elementos React Native.
 * Suporta títulos (H1 a H6), tabelas com scroll horizontal, callouts/dicas de ouro,
 * listas numeradas, listas com marcadores e parágrafos.
 */
export function renderMarkdownContent(
  markdown: string,
  corTema: string,
  isDark: boolean = false
): React.ReactNode[] {
  const lines = markdown.split('\n');
  const elements: React.ReactNode[] = [];
  const primaryTextColor = isDark ? '#F8FAFC' : '#0F172A';
  const bodyTextColor = isDark ? '#E2E8F0' : '#334155';

  for (let idx = 0; idx < lines.length; idx++) {
    const rawLine = lines[idx];
    const line = rawLine.trim();

    if (!line) {
      continue;
    }

    // 1. Linha horizontal / divisor (---, ***, ___)
    if (/^[-*_]{3,}$/.test(line)) {
      elements.push(
        <View
          key={`divider-${idx}`}
          style={[styles.mdDivider, isDark && styles.mdDividerDark]}
        />
      );
      continue;
    }

    // 2. Tabela Markdown (| Col 1 | Col 2 | ...)
    if (line.startsWith('|') && line.endsWith('|')) {
      const tableLines: string[] = [];
      while (
        idx < lines.length &&
        lines[idx].trim().startsWith('|') &&
        lines[idx].trim().endsWith('|')
      ) {
        tableLines.push(lines[idx].trim());
        idx++;
      }
      idx--; // Recua 1 índice para o loop for avançar corretamente

      if (tableLines.length >= 2) {
        const parseRow = (r: string) => {
          const cells = r.split('|');
          if (cells.length >= 2) {
            cells.shift();
            cells.pop();
          }
          return cells.map(c => c.replace(/\*\*/g, '').trim());
        };

        const headerCells = parseRow(tableLines[0]);
        const delimiterCells = parseRow(tableLines[1]);
        const alignments: ('left' | 'center' | 'right')[] = delimiterCells.map(d => {
          if (d.startsWith(':') && d.endsWith(':')) return 'center';
          if (d.endsWith(':')) return 'right';
          return 'left';
        });

        const bodyRows = tableLines.slice(2).map(parseRow);

        elements.push(
          <ScrollView
            key={`table-scroll-${idx}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.mdTableScroll}
            contentContainerStyle={styles.mdTableContent}
          >
            <View style={[styles.mdTableContainer, isDark && styles.mdTableContainerDark]}>
              {/* Cabeçalho da Tabela */}
              <View
                style={[
                  styles.mdTableRow,
                  styles.mdTableHeaderRow,
                  isDark && styles.mdTableHeaderRowDark,
                ]}
              >
                {headerCells.map((h, hIdx) => (
                  <View
                    key={`th-${hIdx}`}
                    style={[
                      styles.mdTableCellContainer,
                      hIdx > 0 && (isDark ? styles.mdTableCellBorderLeftDark : styles.mdTableCellBorderLeft),
                    ]}
                  >
                    <Text
                      style={[
                        styles.mdTableCellText,
                        styles.mdTableHeaderText,
                        { color: primaryTextColor, textAlign: alignments[hIdx] || 'left' },
                      ]}
                    >
                      {h}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Linhas de Dados */}
              {bodyRows.map((row, rIdx) => {
                const isEven = rIdx % 2 === 1;
                const rowBg = isEven
                  ? isDark
                    ? 'rgba(255, 255, 255, 0.03)'
                    : '#F8FAFC'
                  : 'transparent';

                return (
                  <View
                    key={`tr-${rIdx}`}
                    style={[
                      styles.mdTableRow,
                      styles.mdTableBodyRow,
                      isDark && styles.mdTableBodyRowDark,
                      { backgroundColor: rowBg },
                    ]}
                  >
                    {row.map((cell, cIdx) => (
                      <View
                        key={`td-${rIdx}-${cIdx}`}
                        style={[
                          styles.mdTableCellContainer,
                          cIdx > 0 && (isDark ? styles.mdTableCellBorderLeftDark : styles.mdTableCellBorderLeft),
                        ]}
                      >
                        <Text
                          style={[
                            styles.mdTableCellText,
                            { color: bodyTextColor, textAlign: alignments[cIdx] || 'left' },
                          ]}
                        >
                          {cell}
                        </Text>
                      </View>
                    ))}
                  </View>
                );
              })}
            </View>
          </ScrollView>
        );
        continue;
      }
    }

    // 3. Títulos H1 a H6 (# até ######)
    const headerMatch = line.match(/^(#{1,6})\s*(.*)/);
    if (headerMatch) {
      const level = headerMatch[1].length;
      const headerText = headerMatch[2].replace(/\*\*/g, '').trim();
      if (headerText) {
        if (level === 1) {
          elements.push(
            <Text key={`h1-${idx}`} style={[styles.mdH1, { color: primaryTextColor }]}>
              {headerText}
            </Text>
          );
        } else {
          elements.push(
            <Text key={`h2-${idx}`} style={[styles.mdH2, { color: corTema }]}>
              {headerText}
            </Text>
          );
        }
      }
      continue;
    }

    // 4. Blockquote / Dica de Ouro (> ...)
    if (line.startsWith('>')) {
      const calloutText = line.replace(/^>\s*/, '').replace(/\*\*/g, '').trim();
      elements.push(
        <View
          key={`callout-${idx}`}
          style={[
            styles.mdCallout,
            isDark && styles.mdCalloutDark,
          ]}
        >
          <MaterialCommunityIcons name="lightbulb-on-outline" size={18} color="#D97706" style={{ marginTop: 2 }} />
          <Text style={[styles.mdCalloutText, isDark && styles.mdCalloutTextDark]}>{calloutText}</Text>
        </View>
      );
      continue;
    }

    // 5. Lista numerada (1. , 1) )
    const numMatch = line.match(/^(\d+)[\.\)]\s+(.*)/);
    if (numMatch) {
      const num = numMatch[1];
      const stepText = numMatch[2].replace(/\*\*/g, '').trim();
      elements.push(
        <View key={`step-${idx}`} style={styles.mdStepRow}>
          <View style={[styles.mdStepBadge, { backgroundColor: corTema }]}>
            <Text style={styles.mdStepBadgeText}>{num}</Text>
          </View>
          <Text style={[styles.mdStepText, { color: bodyTextColor }]}>{stepText}</Text>
        </View>
      );
      continue;
    }

    // 6. Lista com marcadores (- , * , • )
    const bulletMatch = line.match(/^[-*•]\s+(.*)/);
    if (bulletMatch) {
      const bulletText = bulletMatch[1].replace(/\*\*/g, '').trim();
      elements.push(
        <View key={`bullet-${idx}`} style={styles.mdBulletRow}>
          <Text style={[styles.mdBulletDot, { color: corTema }]}>•</Text>
          <Text style={[styles.mdBulletText, { color: bodyTextColor }]}>{bulletText}</Text>
        </View>
      );
      continue;
    }

    // 7. Parágrafo comum
    const paragraphText = line
      .replace(/\*\*/g, '')
      .replace(/^#{1,6}\s*/, '')
      .trim();
    if (paragraphText) {
      elements.push(
        <Text key={`p-${idx}`} style={[styles.mdParagraph, { color: bodyTextColor }]}>
          {paragraphText}
        </Text>
      );
    }
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
  mdDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 8,
  },
  mdDividerDark: {
    backgroundColor: '#334155',
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
  mdCalloutDark: {
    backgroundColor: '#451A03',
    borderLeftColor: '#F59E0B',
  },
  mdCalloutTextDark: {
    color: '#FDE68A',
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
  // Estilos da Tabela
  mdTableScroll: {
    marginVertical: 6,
  },
  mdTableContent: {
    paddingVertical: 2,
  },
  mdTableContainer: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  mdTableContainerDark: {
    borderColor: '#334155',
  },
  mdTableRow: {
    flexDirection: 'row',
  },
  mdTableHeaderRow: {
    backgroundColor: '#F1F5F9',
    borderBottomWidth: 1,
    borderBottomColor: '#CBD5E1',
  },
  mdTableHeaderRowDark: {
    backgroundColor: '#1E293B',
    borderBottomColor: '#334155',
  },
  mdTableBodyRow: {
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  mdTableBodyRowDark: {
    borderBottomColor: '#334155',
  },
  mdTableCellContainer: {
    paddingVertical: 7,
    paddingHorizontal: 10,
    minWidth: 80,
    justifyContent: 'center',
  },
  mdTableCellBorderLeft: {
    borderLeftWidth: 1,
    borderLeftColor: '#E2E8F0',
  },
  mdTableCellBorderLeftDark: {
    borderLeftWidth: 1,
    borderLeftColor: '#334155',
  },
  mdTableCellText: {
    fontSize: 12,
    lineHeight: 16,
  },
  mdTableHeaderText: {
    fontWeight: '700',
    fontSize: 12,
  },
});
