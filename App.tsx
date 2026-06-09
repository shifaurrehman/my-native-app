import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ScreenNames } from './src/constants/screens';
import HomeScreen from './src/screens/HomeScreen';
import LocationTrackingScreen from './src/screens/LocationTrackingScreen';
import MusicPlayerScreen from './src/screens/MusicPlayerScreen';
import CalorieCalculatorScreen from './src/screens/CalorieCalculatorScreen';
import { useTheme } from './src/hooks/useThemeMode';

export type RootStackParamList = {
    Home: undefined;
    LocationTracking: undefined;
    MusicPlayer: undefined;
    CalorieCalculator: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();


const RootStack = () => {
    const theme = useTheme();
    return (
        <Stack.Navigator id="root" initialRouteName={ScreenNames.Home} screenOptions={{
            animation: 'slide_from_right',
            headerShown: true,
            headerTitleAlign: 'center',
            headerStyle: {
                backgroundColor: theme.surface,
            },
            headerTintColor: theme.text,
            headerTitleStyle: {
                fontWeight: '600',
                fontSize: 17,
            },
        }}>
            <Stack.Screen name={ScreenNames.Home} options={{ title: "Home" }} component={HomeScreen} />
            <Stack.Screen name={ScreenNames.LocationTracking} options={{ title: "Location Tracking" }} component={LocationTrackingScreen} />
            <Stack.Screen name={ScreenNames.MusicPlayer} options={{ title: "Music Player" }} component={MusicPlayerScreen} />
            <Stack.Screen name={ScreenNames.CalorieCalculator} options={{ title: "Calorie Calculator" }} component={CalorieCalculatorScreen} />
        </Stack.Navigator>
    )
}

const App = () => {
    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <RootStack />
            </NavigationContainer>
        </SafeAreaProvider>
    );
};

export default App;
