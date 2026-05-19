import React, { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  NativeModules, 
  ScrollView, 
  SafeAreaView,
  Dimensions,
  Alert
} from 'react-native';

const { AuthNavigationModule: NativeAuthModule } = NativeModules;

interface RegisteredUser {
  email: string;
  name: string;
  password?: string;
}

interface Session {
  email: string;
  name: string;
  loginTime: number;
  expireTime: number;
}

interface LogEntry {
  id: string;
  time: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

const SESSION_DURATION_MS = 30 * 60 * 1000; // 30 minutes

export default function App() {
  // State for mock registration database (stored in JS side)
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([
    { email: 'shifa@gmail.com', name: 'Shifa Ur Rehman', password: '123' },
    { email: 'demo@example.com', name: 'Demo Tester', password: '123' }
  ]);

  // Session state
  const [session, setSession] = useState<Session | null>(null);
  
  // Timer state
  const [timeLeft, setTimeLeft] = useState<number>(0); // in seconds
  
  // Logging for testing console
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const scrollViewRef = useRef<ScrollView>(null);

  // Helper to add system log
  const addLog = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const newLog: LogEntry = {
      id: Math.random().toString(),
      time: timeStr,
      message,
      type
    };
    setLogs(prev => [newLog, ...prev].slice(0, 30)); // limit to 30 logs
  };

  // Initialize App Log
  useEffect(() => {
    addLog('App initialized. Demo users loaded.', 'info');
  }, []);

  // Timer interval to check session expiration
  useEffect(() => {
    if (!session) {
      setTimeLeft(0);
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const remainingMs = session.expireTime - now;

      if (remainingMs <= 0) {
        setSession(null);
        addLog(`Session for ${session.email} expired automatically after 30 minutes!`, 'warning');
        Alert.alert('Session Expired', 'Your 30-minute session has expired. You have been logged out.');
        clearInterval(interval);
      } else {
        setTimeLeft(Math.ceil(remainingMs / 1000));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [session]);

  // Launch Native Login
  const handleOpenLogin = async () => {
    addLog('Opening Native Login Screen...', 'info');
    try {
      // Pass the complete list of registered users as a JSON string to the native screen
      const result = await NativeAuthModule.navigateToLogin(JSON.stringify(registeredUsers));
      
      if (result) {
        if (result.email) {
          const user = registeredUsers.find(u => u.email.toLowerCase() === result.email.toLowerCase());
          const userName = user ? user.name : 'User';
          
          const now = Date.now();
          const newSession: Session = {
            email: result.email,
            name: userName,
            loginTime: now,
            expireTime: now + SESSION_DURATION_MS
          };
          
          setSession(newSession);
          setTimeLeft(30 * 60);
          addLog(`User ${result.email} logged in successfully via Native Login.`, 'success');
        } else if (result.action === 'signup') {
          addLog('User requested navigation from Login to Signup.', 'info');
          // Automatically navigate to Signup
          setTimeout(() => {
            handleOpenSignup();
          }, 300);
        }
      } else {
        addLog('Native Login canceled/closed.', 'warning');
      }
    } catch (e: any) {
      addLog(`Error during Native Login: ${e.message}`, 'error');
    }
  };

  // Launch Native Signup
  const handleOpenSignup = async () => {
    addLog('Opening Native Signup Screen...', 'info');
    try {
      // Pass only the emails array to the signup screen for duplicate check
      const emailsList = registeredUsers.map(u => u.email);
      const result = await NativeAuthModule.navigateToSignup(emailsList);

      if (result) {
        if (result.email && result.name) {
          // Add the newly registered user on the JS side
          const newUser: RegisteredUser = {
            email: result.email,
            name: result.name,
            password: '123' // Mock password for subsequent logins
          };
          
          setRegisteredUsers(prev => [...prev, newUser]);
          
          // Log them in immediately
          const now = Date.now();
          const newSession: Session = {
            email: result.email,
            name: result.name,
            loginTime: now,
            expireTime: now + SESSION_DURATION_MS
          };
          
          setSession(newSession);
          setTimeLeft(30 * 60);
          addLog(`Registered & Logged In: ${result.email} (${result.name})`, 'success');
        } else if (result.action === 'login') {
          addLog('User requested navigation from Signup to Login.', 'info');
          // Automatically navigate to Login
          setTimeout(() => {
            handleOpenLogin();
          }, 300);
        }
      } else {
        addLog('Native Signup canceled/closed.', 'warning');
      }
    } catch (e: any) {
      addLog(`Error during Native Signup: ${e.message}`, 'error');
    }
  };

  // Manual Logout
  const handleLogout = () => {
    if (session) {
      const email = session.email;
      setSession(null);
      addLog(`User ${email} logged out manually.`, 'info');
    }
  };

  // Fast-Forward Session (Leaves 15 seconds)
  const handleFastForward = () => {
    if (!session) return;
    const now = Date.now();
    const newSession: Session = {
      ...session,
      expireTime: now + 15 * 1000 // sets session to expire in 15 seconds
    };
    setSession(newSession);
    setTimeLeft(15);
    addLog('Fast-forwarded time. Session will expire in 15 seconds!', 'warning');
  };

  // Clear database for testing
  const handleClearDatabase = () => {
    setRegisteredUsers([]);
    setSession(null);
    addLog('Mock user database cleared!', 'error');
    Alert.alert('Database Cleared', 'All registered users and active sessions have been wiped.');
  };

  // Inject a dummy user
  const handleInjectDummy = () => {
    const randomId = Math.floor(Math.random() * 1000);
    const dummy: RegisteredUser = {
      email: `test${randomId}@gmail.com`,
      name: `Tester ${randomId}`,
      password: '123'
    };
    setRegisteredUsers(prev => [...prev, dummy]);
    addLog(`Injected dummy user: ${dummy.email}`, 'info');
  };

  // Format time remaining
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  // Calculate session progress percentage
  const getProgressPercentage = () => {
    if (!session) return 0;
    const total = 30 * 60; // 30 minutes in seconds
    return Math.max(0, Math.min(100, (timeLeft / total) * 100));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🔑 SecurePortal</Text>
        <Text style={styles.headerSubtitle}>Hybrid Native-JS Mock Auth Flow</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* SESSION STATUS CARD */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Session Status</Text>
          
          {session ? (
            <View style={styles.loggedInContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {session.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </Text>
              </View>

              <Text style={styles.welcomeText}>Welcome, {session.name}!</Text>
              <Text style={styles.emailText}>{session.email}</Text>
              
              <View style={[styles.badge, styles.activeBadge]}>
                <View style={styles.pulseDot} />
                <Text style={styles.activeBadgeText}>ACTIVE SESSION</Text>
              </View>

              <View style={styles.timerContainer}>
                <Text style={styles.timerLabel}>Time Remaining</Text>
                <Text style={[styles.timerText, timeLeft < 60 && styles.timerTextWarning]}>
                  {formatTime(timeLeft)}
                </Text>
                <View style={styles.progressBarBg}>
                  <View style={[
                    styles.progressBarFill, 
                    { width: `${getProgressPercentage()}%` },
                    timeLeft < 60 && styles.progressBarFillWarning
                  ]} />
                </View>
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity 
                  style={[styles.btn, styles.btnDanger]} 
                  onPress={handleLogout}
                >
                  <Text style={styles.btnText}>Log Out</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[styles.btn, styles.btnWarning]} 
                  onPress={handleFastForward}
                >
                  <Text style={styles.btnText}>⚡ Speed Up (15s)</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.loggedOutContainer}>
              <View style={[styles.badge, styles.inactiveBadge]}>
                <Text style={styles.inactiveBadgeText}>NO ACTIVE SESSION</Text>
              </View>
              
              <Text style={styles.infoText}>
                Authenticate using Native Android Screens (Jetpack Compose) integrated with JS state persistence.
              </Text>

              <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={handleOpenLogin}>
                <Text style={styles.btnText}>🔑 Open Native Login</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.btn, styles.btnSecondary]} onPress={handleOpenSignup}>
                <Text style={styles.btnText}>📝 Open Native Signup</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* TEST CONTROL CONSOLE */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🛠️ Testing Console</Text>
          
          <Text style={styles.sectionLabel}>Mock Registered Users ({registeredUsers.length})</Text>
          <View style={styles.usersBox}>
            {registeredUsers.length === 0 ? (
              <Text style={styles.emptyText}>No users registered. Sign up to add one.</Text>
            ) : (
              registeredUsers.map((user, idx) => (
                <View key={user.email} style={[styles.userRow, idx === registeredUsers.length - 1 && styles.lastUserRow]}>
                  <View>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userEmail}>{user.email}</Text>
                  </View>
                  <View style={styles.pwdBadge}>
                    <Text style={styles.pwdText}>pwd: {user.password}</Text>
                  </View>
                </View>
              ))
            )}
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.btnSmall, styles.btnSmallPrimary]} onPress={handleInjectDummy}>
              <Text style={styles.btnSmallText}>➕ Inject Random User</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btnSmall, styles.btnSmallDanger]} onPress={handleClearDatabase}>
              <Text style={styles.btnSmallText}>🗑️ Clear DB</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* SYSTEM ACTIVITY LOG */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📜 System Activity Logs</Text>
          <View style={styles.logsBox}>
            {logs.length === 0 ? (
              <Text style={styles.emptyText}>No events recorded yet.</Text>
            ) : (
              logs.map(log => (
                <View key={log.id} style={styles.logRow}>
                  <Text style={styles.logTime}>[{log.time}]</Text>
                  <Text style={[
                    styles.logMsg, 
                    log.type === 'success' && styles.logSuccess,
                    log.type === 'warning' && styles.logWarning,
                    log.type === 'error' && styles.logError,
                  ]}>
                    {log.message}
                  </Text>
                </View>
              ))
            )}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const colors = {
  bg: '#0F172A',       // slate-900
  cardBg: '#1E293B',   // slate-800
  cardBorder: '#334155', // slate-700
  text: '#F8FAFC',     // slate-50
  textMuted: '#94A3B8',// slate-400
  primary: '#6366F1',  // indigo-500
  secondary: '#475569',// slate-600
  success: '#10B981',  // emerald-500
  warning: '#F59E0B',  // amber-500
  error: '#EF4444',    // red-500
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    paddingTop: 16,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
    letterSpacing: 0.2,
  },
  loggedOutContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
    marginVertical: 16,
  },
  loggedInContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: colors.text,
  },
  avatarText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  emailText: {
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 2,
    marginBottom: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 20,
  },
  activeBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: colors.success,
  },
  activeBadgeText: {
    color: colors.success,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
    marginRight: 6,
  },
  inactiveBadge: {
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  inactiveBadgeText: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  timerContainer: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.3)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  timerLabel: {
    fontSize: 12,
    color: colors.textMuted,
    textTransform: 'uppercase',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  timerText: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.primary,
    marginVertical: 4,
    fontFamily: 'Courier', // Monospace layout
  },
  timerTextWarning: {
    color: colors.error,
  },
  progressBarBg: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    marginTop: 8,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 3,
  },
  progressBarFillWarning: {
    backgroundColor: colors.error,
  },
  buttonRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    gap: 12,
  },
  btn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 6,
    flexDirection: 'row',
  },
  btnPrimary: {
    backgroundColor: colors.primary,
    width: '100%',
  },
  btnSecondary: {
    backgroundColor: colors.secondary,
    width: '100%',
  },
  btnDanger: {
    backgroundColor: colors.error,
  },
  btnWarning: {
    backgroundColor: colors.warning,
  },
  btnText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  usersBox: {
    backgroundColor: 'rgba(15, 23, 42, 0.3)',
    borderRadius: 12,
    padding: 8,
    marginBottom: 16,
    maxHeight: 180,
  },
  userRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  lastUserRow: {
    borderBottomWidth: 0,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  userEmail: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 1,
  },
  pwdBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  pwdText: {
    fontSize: 10,
    fontFamily: 'Courier',
    color: colors.textMuted,
  },
  emptyText: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
    paddingVertical: 20,
    fontStyle: 'italic',
  },
  btnSmall: {
    flex: 1,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnSmallPrimary: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  btnSmallDanger: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: colors.error,
  },
  btnSmallText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  logsBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    borderRadius: 12,
    padding: 12,
    maxHeight: 180,
  },
  logRow: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'flex-start',
  },
  logTime: {
    fontSize: 11,
    color: colors.textMuted,
    fontFamily: 'Courier',
    marginRight: 6,
  },
  logMsg: {
    flex: 1,
    fontSize: 11.5,
    color: colors.textMuted,
    lineHeight: 16,
  },
  logSuccess: {
    color: colors.success,
  },
  logWarning: {
    color: colors.warning,
  },
  logError: {
    color: colors.error,
  },
});
