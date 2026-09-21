import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from '../screens/Welcome';
import CharacterScreen from '../screens/Character';
import NameScreen from '../screens/Name';
import AgeScreen from '../screens/Age';
import IntentScreen from '../screens/Intent';
import FeedbackScreen from '../screens/Feedback';
import DoneScreen from '../screens/Done';

const Stack = createNativeStackNavigator();

// Fluxo: Welcome -> Character -> Name -> Age -> Intent -> Feedback -> Done.
// O cabeçalho padrão fica desligado: cada tela desenha o próprio (ProgressHeader).
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Character" component={CharacterScreen} />
        <Stack.Screen name="Name" component={NameScreen} />
        <Stack.Screen name="Age" component={AgeScreen} />
        <Stack.Screen name="Intent" component={IntentScreen} />
        <Stack.Screen name="Feedback" component={FeedbackScreen} />
        <Stack.Screen name="Done" component={DoneScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
