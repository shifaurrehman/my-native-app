import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Session } from '../types';

interface AuthStatusCardProps {
  session: Session | null;
  timeLeft: number;
  onLogout: () => void;
  onFastForward: () => void;
  onOpenLogin: () => void;
  onOpenSignup: () => void;
  theme: 'light' | 'dark';
}

export const AuthStatusCard: React.FC<AuthStatusCardProps> = ({
  session,
  timeLeft,
  onLogout,
  onFastForward,
  onOpenLogin,
  onOpenSignup,
  theme,
}) => {
  const isDark = theme === 'dark';

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={[styles.sectionCard, isDark && styles.sectionCardDark]}>
      <Text style={[styles.sectionHeader, isDark && styles.sectionHeaderDark]}>
        1. Authentication Status
      </Text>

      {session ? (
        <View style={styles.authBox}>
          <Text style={[styles.statusLabel, isDark && styles.statusLabelDark]}>
            Logged In As:
          </Text>
          <Text style={[styles.userDisplay, isDark && styles.userDisplayDark]}>
            {session.name} ({session.email})
          </Text>

          <View style={[styles.timerDisplayBox, isDark && styles.timerDisplayBoxDark]}>
            <Text style={[styles.timerTitle, isDark && styles.timerTitleDark]}>
              Session Expiration Countdown:
            </Text>
            <Text
              style={[
                styles.timerCountdown,
                isDark && styles.timerCountdownDark,
                timeLeft < 60 && styles.textRed,
              ]}
            >
              {formatCountdown(timeLeft)}
            </Text>
            <Text style={[styles.timerHelper, isDark && styles.timerHelperDark]}>
              Session expires automatically after 5 minutes.
            </Text>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.button, styles.buttonRed]}
              onPress={onLogout}
            >
              <Text style={styles.buttonText}>Log Out</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.buttonOrange]}
              onPress={onFastForward}
            >
              <Text style={styles.buttonText}>⚡ Speed Up (15s)</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.authBox}>
          <Text style={[styles.loggedOutLabel, isDark && styles.loggedOutLabelDark]}>
            Status: Not Logged In
          </Text>

          <TouchableOpacity
            style={[styles.button, styles.buttonBlue]}
            onPress={onOpenLogin}
          >
            <Text style={styles.buttonText}>Open Native Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, isDark ? styles.buttonOutlineDark : styles.buttonOutline]}
            onPress={onOpenSignup}
          >
            <Text style={[isDark ? styles.buttonOutlineTextDark : styles.buttonOutlineText]}>
              Open Native Signup
            </Text>
          </TouchableOpacity>
        </View>
      )}
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
  authBox: {
    paddingVertical: 4,
  },
  loggedOutLabel: {
    fontSize: 16,
    color: '#DC2626',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  loggedOutLabelDark: {
    color: '#EF4444',
  },
  statusLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    textTransform: 'uppercase',
  },
  statusLabelDark: {
    color: '#9CA3AF',
  },
  userDisplay: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 2,
    marginBottom: 16,
  },
  userDisplayDark: {
    color: '#E5E7EB',
  },
  timerDisplayBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  timerDisplayBoxDark: {
    backgroundColor: '#111827',
    borderColor: '#374151',
  },
  timerTitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  timerTitleDark: {
    color: '#9CA3AF',
  },
  timerCountdown: {
    fontSize: 28,
    fontWeight: '800',
    color: '#4B5563',
    marginVertical: 6,
  },
  timerCountdownDark: {
    color: '#E5E7EB',
  },
  timerHelper: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  timerHelperDark: {
    color: '#6B7280',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  button: {
    flex: 1,
    height: 44,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
  },
  buttonBlue: {
    backgroundColor: '#3B82F6',
    width: '100%',
  },
  buttonOutline: {
    borderWidth: 1,
    borderColor: '#3B82F6',
    width: '100%',
  },
  buttonOutlineDark: {
    borderWidth: 1,
    borderColor: '#60A5FA',
    width: '100%',
    height: 44,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
  },
  buttonRed: {
    backgroundColor: '#EF4444',
  },
  buttonOrange: {
    backgroundColor: '#F59E0B',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  buttonOutlineText: {
    color: '#3B82F6',
    fontWeight: 'bold',
    fontSize: 14,
  },
  buttonOutlineTextDark: {
    color: '#60A5FA',
    fontWeight: 'bold',
    fontSize: 14,
  },
  textRed: {
    color: '#EF4444',
  },
});
