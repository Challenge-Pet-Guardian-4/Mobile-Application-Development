import { Alert } from 'react-native';

export interface ConfirmarAcaoOptions {
  textoConfirmar?: string;
  textoCancelar?: string;
  destrutivo?: boolean;
}

/**
 * Exibe um diálogo de confirmação nativo padronizado com estilo destrutivo ou padrão.
 */
export function confirmarAcao(
  titulo: string,
  mensagem: string,
  onConfirmar: () => void,
  opcoes?: ConfirmarAcaoOptions
): void {
  const {
    textoConfirmar = 'Confirmar',
    textoCancelar = 'Cancelar',
    destrutivo = true,
  } = opcoes ?? {};

  Alert.alert(titulo, mensagem, [
    { text: textoCancelar, style: 'cancel' },
    {
      text: textoConfirmar,
      style: destrutivo ? 'destructive' : 'default',
      onPress: onConfirmar,
    },
  ]);
}
