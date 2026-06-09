import { ScrollView, StyleSheet, Text } from 'react-native'
import React from 'react'
import { globalStyles } from '../styles/global'
import { useTheme } from '../hooks/useThemeMode'

const MusicPlayerScreen = () => {
  const theme = useTheme();
  return (
    <ScrollView contentContainerStyle={[globalStyles.container, { backgroundColor: theme.background }]}>
      <Text>MusicPlayerScreen</Text>
    </ScrollView>
  )
}

export default MusicPlayerScreen

const styles = StyleSheet.create({})