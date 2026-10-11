import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { NavigationContainer } from '@react-navigation/native';

import { queryClient } from './src/lib/queryClient';
import { AuthProvider } from './src/contexts/AuthContext';
import MainStack from './src/routes/MainStack';
import { navigationRef } from './src/routes/navigationRef';
import { useNotifications } from './src/hooks/useNotifications';

function AppContent() {
  useNotifications();

  return (
    <NavigationContainer ref={navigationRef}>
      <MainStack />
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}