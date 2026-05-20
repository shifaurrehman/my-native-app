import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';

interface BackgroundLogsListProps {
  bgLogs: string[];
  onClearBgLogs: () => void;
  theme: 'light' | 'dark';
}

export const BackgroundLogsList: React.FC<BackgroundLogsListProps> = ({
  bgLogs,
  onClearBgLogs,
  theme,
}) => {
  const isDark = theme === 'dark';

  return (
    <View style={[styles.sectionCard, isDark && styles.sectionCardDark]}>
      <Text style={[styles.sectionHeader, isDark && styles.sectionHeaderDark]}>
        2. Native Background Logs (Expo Module - Every 10s)
      </Text>

      <View style={styles.bgLogsBox}>
        {bgLogs.length === 0 ? (
          <Text style={styles.noLogsText}>
            Waiting for first 10s background log tick...
          </Text>
        ) : (
          <ScrollView nestedScrollEnabled style={styles.scrollView}>
            {bgLogs.map((logTime, index) => (
              <View key={index} style={styles.bgLogItemRow}>
                <Text style={styles.bgLogBullet}>⏱️</Text>
                <Text style={styles.bgLogTime}>{logTime}</Text>
                <Text style={styles.bgLogDesc}>
                  - Saved to SharedPreferences & Emitted
                </Text>
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.buttonSmall,
          isDark ? styles.buttonSmallRedDark : styles.buttonSmallRed,
          { marginTop: 8 }
        ]}
        onPress={onClearBgLogs}
      >
        <Text style={[styles.buttonSmallText, isDark && styles.buttonSmallTextDark]}>
          Clear Background Time Logs
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionCardDark: {
    backgroundColor: '#1F2937',
    borderColor: '#374151',
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 6,
  },
  sectionHeaderDark: {
    color: '#F9FAFB',
    borderBottomColor: '#374151',
  },
  bgLogsBox: {
    backgroundColor: '#111827',
    borderRadius: 6,
    padding: 10,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  scrollView: {
    maxHeight: 120,
  },
  bgLogItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
  },
  bgLogBullet: {
    marginRight: 6,
    fontSize: 12,
  },
  bgLogTime: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#10B981',
    fontFamily: 'monospace',
  },
  bgLogDesc: {
    fontSize: 11,
    color: '#9CA3AF',
    marginLeft: 6,
  },
  noLogsText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 10,
  },
  buttonSmall: {
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSmallRed: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  buttonSmallRedDark: {
    backgroundColor: '#3F1F21',
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  buttonSmallText: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '600',
  },
  buttonSmallTextDark: {
    color: '#FCA5A5',
  },
});
