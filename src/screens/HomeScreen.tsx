import { ScrollView, StyleSheet, View } from 'react-native'
import React from 'react'
import { globalStyles } from '../styles/global'
import { useTheme } from '../hooks/useThemeMode'
import FeatureCard from '../components/FeatureCard'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../App'
import { ScreenNames } from '../constants/screens'

type HomeNavigationProps =  NativeStackNavigationProp<RootStackParamList, 'Home'>

const HomeScreen = () => {
  const theme = useTheme();
  const navigation = useNavigation<HomeNavigationProps>();
  const handleLocationTrackingPress = () => {
    navigation.navigate(ScreenNames.LocationTracking);
  }
  const handleMusicPlayerPress = () => {
    navigation.navigate(ScreenNames.MusicPlayer);
  }
  const handleCalorieCalculatorPress = () => {
    navigation.navigate(ScreenNames.CalorieCalculator);
  }
  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
    <ScrollView contentContainerStyle={[globalStyles.container, { backgroundColor: theme.background }]}>
      <FeatureCard title="Location Tracking" onPress={handleLocationTrackingPress} />
      <FeatureCard title="Music Player" onPress={handleMusicPlayerPress} />
      <FeatureCard title="Calorie Calculator" onPress={handleCalorieCalculatorPress} />
    </ScrollView>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})