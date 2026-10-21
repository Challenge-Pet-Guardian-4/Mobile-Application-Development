import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AiService } from '../services/ai';
import { queryKeys } from '../lib/queryKeys';
import { AiChatSession, AiMessage } from '../types/ai';
import { PetResponse } from '../types/pet';

export function useAiWarmup() {
  useEffect(() => {
    AiService.ping();
  }, []);
}

export function useAiInsights(pet?: PetResponse) {
  return useQuery({
    queryKey: queryKeys.ai.insights(pet?.id),
    queryFn: () => AiService.getInsightsDoPet(pet),
    enabled: !!pet,
  });
}

function gerarNovoSessionId(): string {
  return `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export function useAiChat(pet?: PetResponse) {
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [sessionId, setSessionId] = useState<string>(gerarNovoSessionId);

  // Inicia o chat limpo e gera novo sessionId ao trocar de pet
  useEffect(() => {
    setMessages([]);
    setSessionId(gerarNovoSessionId());
  }, [pet?.id]);

  const sendMutation = useMutation({
    mutationFn: (variables: { text: string; historico: AiMessage[]; sessionId: string }) =>
      AiService.enviarMensagem(variables.text, pet, variables.historico, variables.sessionId),
    onSuccess: (response) => {
      setMessages((prev) => [...prev, response]);
    },
    onError: () => {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'assistant',
          text: '⚠️ Não foi possível se comunicar com os servidores da Guardian AI no momento. Isso pode ocorrer por oscilações temporárias de conexão ou inicialização do serviço em nuvem. Por favor, tente enviar sua mensagem novamente em instantes.',
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    },
  });

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) {
        return;
      }

      const userMsg: AiMessage = {
        id: `user_${Date.now()}`,
        sender: 'user',
        text: trimmed,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };

      const historicoContexto = messages;
      setMessages((prev) => [...prev, userMsg]);
      sendMutation.mutate({ text: trimmed, historico: historicoContexto, sessionId });
    },
    [sendMutation, messages, sessionId]
  );

  const carregarSessao = useCallback((novoSessaoId: string, mensagensSessao: AiMessage[]) => {
    setSessionId(novoSessaoId);
    setMessages(mensagensSessao);
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    setSessionId(gerarNovoSessionId());
  }, []);

  return {
    messages,
    sessionId,
    sendMessage,
    carregarSessao,
    clearChat,
    isLoading: sendMutation.isPending,
  };
}

export function useAiSessions(petId?: number, enabled = true) {
  return useQuery({
    queryKey: queryKeys.ai.sessions(petId),
    queryFn: () => AiService.getSessoesDoPet(petId),
    enabled: enabled && !!petId,
    staleTime: 0, // sempre revalida ao abrir o histórico (novas conversas aparecem na hora)
  });
}

export function useCarregarSessaoIa() {
  return useMutation({
    mutationFn: (sessionId: string) => AiService.getMensagensDaSessao(sessionId),
  });
}

export function useExcluirSessaoIa(petId?: number) {
  const queryClient = useQueryClient();
  const sessionsKey = queryKeys.ai.sessions(petId);

  return useMutation({
    mutationFn: (sessionId: string) => AiService.excluirSessao(sessionId),
    // Remoção otimista: a conversa some da lista imediatamente
    onMutate: async (sessionId) => {
      await queryClient.cancelQueries({ queryKey: sessionsKey });
      queryClient.setQueryData<AiChatSession[]>(sessionsKey, (atual) =>
        atual?.filter((sessao) => sessao.sessionId !== sessionId)
      );
    },
    // Reconcilia com o servidor (restaura a lista se a exclusão falhou)
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: sessionsKey });
    },
  });
}
