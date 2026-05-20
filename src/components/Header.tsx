import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

interface HeaderProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, onToggleTheme }) => {
  const isDark = theme === 'dark';

  return (
    <View style={[styles.appHeader, isDark && styles.appHeaderDark]}>
      <View style={styles.titleContainer}>
        <Text style={[styles.appTitle, isDark && styles.appTitleDark]}>
          SecureAuth Portal
        </Text>
        <Text style={[styles.appSubtitle, isDark && styles.appSubtitleDark]}>
          stateless native screens + Expo Module background task
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.themeButton, isDark && styles.themeButtonDark]}
        onPress={onToggleTheme}
        activeOpacity={0.7}
      >
        <Text style={[styles.themeButtonText, isDark && styles.themeButtonTextDark]}>
          {isDark ? '☀️ Light' : '🌙 Dark'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  appHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  appHeaderDark: {
    backgroundColor: '#1F2937',
    borderBottomColor: '#374151',
  },
  titleContainer: {
    flex: 1,
    marginRight: 10,
  },
  appTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
  },
  appTitleDark: {
    color: '#F9FAFB',
  },
  appSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  appSubtitleDark: {
    color: '#9CA3AF',
  },
  themeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeButtonDark: {
    backgroundColor: '#374151',
    borderColor: '#4B5563',
  },
  themeButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  themeButtonTextDark: {
    color: '#F9FAFB',
  },
});
