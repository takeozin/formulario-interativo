import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '../screens/Splash';
import WelcomeScreen from '../screens/Welcome';
import CharacterScreen from '../screens/Character';
import NameScreen from '../screens/Name';
import AgeScreen from '../screens/Age';
import IntentScreen from '../screens/Intent';
import QueueScreen from '../screens/Queue';
import FeedbackScreen from '../screens/Feedback';
import DoneScreen from '../screens/Done';
import { AdminLoginScreen, AdminPanelScreen } from '../screens/Admin';

const Stack = createNativeStackNavigator();

// Fluxo de jogo: Intent -> Queue -> Feedback -> Done.
// O cabeçalho padrão fica desligado: cada tela desenha o próprio (ProgressHeader).
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
        <Stack.Screen name="AdminPanel" component={AdminPanelScreen} />
        <Stack.Screen name="Character" component={CharacterScreen} />
        <Stack.Screen name="Name" component={NameScreen} />
        <Stack.Screen name="Age" component={AgeScreen} />
        <Stack.Screen name="Intent" component={IntentScreen} />
        <Stack.Screen name="Queue" component={QueueScreen} />
        <Stack.Screen name="Feedback" component={FeedbackScreen} />
        <Stack.Screen name="Done" component={DoneScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
