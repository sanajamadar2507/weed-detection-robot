import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { SplashScreen } from '../screens/SplashScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { BottomTabNavigator } from './BottomTabNavigator';
import { ResultScreen } from '../screens/ResultScreen';
import { DetailsScreen } from '../screens/DetailsScreen';
import { AboutScreen } from '../screens/AboutScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
      <Stack.Screen
        name="Result"
        component={ResultScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={{ animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
    </Stack.Navigator>
  );
};
