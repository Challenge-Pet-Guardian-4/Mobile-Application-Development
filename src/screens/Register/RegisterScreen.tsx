import React from 'react';
import { View, StyleSheet, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../routes/types';
import { AuthHeader } from '../../components/AuthHeader';
import { useRegisterForm } from '../../hooks/useRegisterForm';
import { RegisterForm } from './components/RegisterForm';
import { useThemedStyles } from '../../contexts/ThemeContext';
import { AppTheme } from '../../constants/theme';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Register'>;
};

export default function RegisterScreen({ navigation }: Props) {
  const styles = useThemedStyles(createStyles);
  const registerState = useRegisterForm(navigation);

  return (
    <KeyboardAvoidingView
      style={styles.mainContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.contentWrapper}>
          <AuthHeader
            title="Criar Conta"
            subtitle="Preencha seus dados para conectar sua família ao PetGuardian"
            onBack={registerState.handleGoBack}
            showIcon={false}
          />

          <RegisterForm registerState={registerState} />
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