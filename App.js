import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FormProvider } from './src/contexts/FormContext';
import AppNavigator from './src/navigation/AppNavigator';
import { useResponseSync } from './src/hooks/useResponseSync';

export default function App() {
  useResponseSync();

  return (
    <SafeAreaProvider>
      <FormProvider>
        <StatusBar style="dark" />
        <AppNavigator />
      </FormProvider>
    </SafeAreaProvider>
  );
}
