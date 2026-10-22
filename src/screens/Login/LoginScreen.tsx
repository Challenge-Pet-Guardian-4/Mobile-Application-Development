import React from 'react';
import { View, StyleSheet, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../routes/types';
import { AuthHeader } from '../../components/AuthHeader';
import { useLoginForm } from '../../hooks/useLoginForm';
import { LoginForm } from './components/LoginForm';
import { useThemedStyles } from '../../contexts/ThemeContext';
import { AppTheme } from '../../constants/theme';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'>;
};

export default function LoginScreen({ navigation }: Props) {
  const styles = useThemedStyles(createStyles);
  const loginState = useLoginForm(navigation);

  return (
    <KeyboardAvoidingView
      style={styles.mainContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.contentWrapper}>
          <AuthHeader
            title="PetGuardian"
            subtitle="Acesse sua conta para cuidar do seu pet em família"
            onBack={loginState.handleGoBack}
          />

          <LoginForm loginState={loginState} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    },
    contentWrapper: {
      width: '100%',
      maxWidth: 420,
    },
  });