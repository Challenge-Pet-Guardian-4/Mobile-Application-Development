import { useCallback } from 'react';
import { AiMessage } from '../types/ai';
import { useAiSessions, useCarregarSessaoIa, useExcluirSessaoIa } from './useAiAssistant';

interface UseAiHistoryParams {
  petId?: number;
  visible: boolean;
  activeSessionId?: string;
  onSelectSession: (sessionId: string, mensagens: AiMessage[]) => void;
  onNewChat: () => void;
  onClose: () => void;
}

export function useAiHistory({
  petId,
  visible,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onClose,
}: UseAiHistoryParams) {
  const { data: sessoes = [], isLoading } = useAiSessions(petId, visible);
  const carregarSessao = useCarregarSessaoIa();
  const excluirSessao = useExcluirSessaoIa(petId);

  const selecionarSessao = useCallback(
    (sessionId: string) => {
      carregarSessao.mutate(sessionId, {
        onSuccess: (mensagens) => {
          onSelectSession(sessionId, mensagens);
          onClose();
        },
      });
    },
    [carregarSessao, onSelectSession, onClose]
  );

  const removerSessao = useCallback(
    (sessionId: string) => {
      excluirSessao.mutate(sessionId, {
        onSuccess: () => {
          if (sessionId === activeSessionId) {
            onNewChat();
          }
        },
      });
    },
    [excluirSessao, activeSessionId, onNewChat]
  );

  const iniciarNovaConversa = useCallback(() => {
    onNewChat();
    onClose();
  }, [onNewChat, onClose]);

  return {
    sessoes,
    isLoading,
    loadingSessionId: carregarSessao.isPending ? carregarSessao.variables ?? null : null,
    selecionarSessao,
    removerSessao,
    iniciarNovaConversa,
  };
}
