import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthService } from '../services/auth';
import { useSession } from './useSession';
import { LoginCredentials } from '../types/auth';
import { LoginSchema, formatZodError, LoginFormData } from '../utils/schemas';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../routes/types';
import { getAuthErrorMessage } from '../utils/apiError';

const INITIAL_LOGIN_FORM: LoginFormData = {
  email: '',
  senha: '',
};

function useLoginMutation() {
  const queryClient = useQueryClient();
  const { setSession } = useSession();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => AuthService.login(credentials),
    onSuccess: (data) => {
      setSession(data);
      queryClient.invalidateQueries();
    },
  });
}

export function useLoginForm(navigation?: NativeStackNavigationProp<AuthStackParamList, 'Login'>) {
  const { mutate: login, isPending, error, reset } = useLoginMutation();

  const [form, setForm] = useState<LoginFormData>(INITIAL_LOGIN_FORM);
  const [validacaoErro, setValidacaoErro] = useState<string | null>(null);

  const updateField = <K extends keyof LoginFormData>(key: K, value: LoginFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (validacaoErro) {
      setValidacaoErro(null);
    }
    if (error) {
      reset();
    }
  };

  const handleLogin = useCallback(() => {
    if (validacaoErro) {
      setValidacaoErro(null);
    }
    if (error) {
      reset();
    }

    const validacao = LoginSchema.safeParse(form);
    if (!validacao.success) {
      setValidacaoErro(formatZodError(validacao.error));
      return;
    }

    login({ email: validacao.data.email, senha: validacao.data.senha });
  }, [form, login, validacaoErro, error, reset]);

  const handleNavigateToRegister = useCallback(() => {
    navigation?.navigate('Register');
  }, [navigation]);

  const handleGoBack = useCallback(() => {
    navigation?.goBack();
  }, [navigation]);

  const mensagemErro = validacaoErro || (error ? getAuthErrorMessage(error) : null);

  return {
    form,
    updateField,
    handleLogin,
    handleNavigateToRegister,
    handleGoBack,
    mensagemErro,
    isPending,
  };
}
