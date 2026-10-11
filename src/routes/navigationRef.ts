import { createNavigationContainerRef } from '@react-navigation/native';
import { RootStackParamList } from './types';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

/**
 * Função utilitária para navegar globalmente a partir de listeners (ex: Notificações Nativas).
 */
export function navigateGlobal<RouteName extends keyof RootStackParamList>(
  name: RouteName,
  params?: RootStackParamList[RouteName]
) {
  if (navigationRef.isReady()) {
    // @ts-expect-error - React Navigation v7 tipagem polimórfica de rotas aninhadas
    navigationRef.navigate(name, params);
  }
}
