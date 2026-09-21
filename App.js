import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FormProvider } from './src/contexts/FormContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <FormProvider>
        <StatusBar style="dark" />
        <AppNavigator />
      </FormProvider>
    </SafeAreaProvider>
  );
}
