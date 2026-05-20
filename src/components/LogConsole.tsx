import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { LogEntry } from '../types';

interface LogConsoleProps {
  logs: LogEntry[];
  sectionNumber: number;
  onClearLogs: () => void;
  theme: 'light' | 'dark';
}

export const LogConsole: React.FC<LogConsoleProps> = ({
  logs,
  sectionNumber,
  onClearLogs,
  theme,
}) => {
  const isDark = theme === 'dark';

  return (
    <View style={[styles.sectionCard, isDark && styles.sectionCardDark]}>
      <Text style={[styles.sectionHeader, isDark && styles.sectionHeaderDark]}>
        {sectionNumber}. Console Logs (Trace actions)
      </Text>
      <View style={styles.logsBox}>
        <ScrollView nestedScrollEnabled style={styles.scrollView}>
          {logs.length === 0 ? (
            <Text style={styles.noLogsText}>No actions traced yet.</Text>
          ) : (
            logs.map(log => (
              <View key={log.id} style={styles.logItem}>
                <Text style={styles.logTime}>[{log.time}]</Text>
                <Text style={styles.logText}>{log.message}</Text>
              </View>
            ))
          )}
        </ScrollView>
      </View>

      <TouchableOpacity
        style={[
          styles.buttonSmall,
          isDark ? styles.buttonSmallRedDark : styles.buttonSmallRed,
          { marginTop: 8 }
        ]}
        onPress={onClearLogs}
      >
        <Text style={[styles.buttonSmallText, isDark && styles.buttonSmallTextDark]}>
          Clear Console Logs
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
  logsBox: {
    backgroundColor: '#111827',
    borderRadius: 6,
    padding: 10,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  scrollView: {
    maxHeight: 150,
  },
  logItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  logTime: {
    color: '#9CA3AF',
    fontSize: 11,
    marginRight: 6,
    fontFamily: 'monospace',
  },
  logText: {
    color: '#E5E7EB',
    fontSize: 11,
    flex: 1,
  },
  noLogsText: {
    color: '#9CA3AF',
    fontSize: 11,
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
