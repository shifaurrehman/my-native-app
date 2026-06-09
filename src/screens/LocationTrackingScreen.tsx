import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { globalStyles } from '../styles/global'
import { useTheme } from '../hooks/useThemeMode'
import CustomButton from '../components/location-tracking/CustomButton'

const LocationTrackingScreen = () => {
  const theme = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView contentContainerStyle={[globalStyles.container, { backgroundColor: theme.background }]}>
        <Text>LocationTrackingScreen</Text>
        <CustomButton title='Start Tracking' onPress={() => {}} />
      </ScrollView>
    </View>
  )
}

export default LocationTrackingScreen

const styles = StyleSheet.create({})