import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  NativeModules, 
  ScrollView, 
  SafeAreaView,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { AuthNavigationModule: NativeAuthModule } = NativeModules;

interface RegisteredUser {
  email: string;
  name: string;
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
}

const SESSION_DURATION_MS = 5 * 60 * 1000;
const STORAGE_USERS_KEY = '@registered_users';
const STORAGE_SESSION_KEY = '@auth_session';

export default function App() {
  // 1. Core States
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0); // in seconds
  const [logs, setLogs] = useState<LogEntry[]>([]);

  // Helper to add system logs for display
  const addLog = (message: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs(prev => [{ id: Math.random().toString(), time: timeStr, message }, ...prev]);
  };

  // 2. Load persistent data from AsyncStorage on startup
  useEffect(() => {
    const initializeData = async () => {
      addLog('Initializing application...');
      try {
        // Load Registered Users
        const storedUsers = await AsyncStorage.getItem(STORAGE_USERS_KEY);
        let users: RegisteredUser[] = [];
        if (storedUsers) {
          users = JSON.parse(storedUsers);
          addLog(`Loaded ${users.length} registered users from AsyncStorage.`);
        } else {
          // Setup default mock users if none exist yet
          users = [
            { email: 'shifa@gmail.com', name: 'Shifa Ur Rehman' },
            { email: 'demo@example.com', name: 'Demo Tester' }
          ];
          await AsyncStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
          addLog('AsyncStorage was empty. Saved default testing users.');
        }
        setRegisteredUsers(users);

        // Load Session
        const storedSession = await AsyncStorage.getItem(STORAGE_SESSION_KEY);
        if (storedSession) {
          const loadedSession: Session = JSON.parse(storedSession);
          const now = Date.now();
          
          // Check if session loaded from storage is already expired
          if (loadedSession.expireTime > now) {
            setSession(loadedSession);
            setTimeLeft(Math.ceil((loadedSession.expireTime - now) / 1000));
            addLog(`Restored active session for: ${loadedSession.email}`);
          } else {
            await AsyncStorage.removeItem(STORAGE_SESSION_KEY);
            addLog('Stored session was expired, cleared it.');
          }
        }
      } catch (error: any) {
        addLog(`Error initializing data: ${error.message}`);
      }
    };

    initializeData();
  }, []);

  // 3. Keep timer running and check session expiry
  useEffect(() => {
    if (!session) {
      setTimeLeft(0);
      return;
    }

    const interval = setInterval(async () => {
      const now = Date.now();
      const remainingMs = session.expireTime - now;

      if (remainingMs <= 0) {
        // Expired! Clear session
        setSession(null);
        await AsyncStorage.removeItem(STORAGE_SESSION_KEY);
        addLog(`Session for ${session.email} expired automatically!`);
        Alert.alert('Session Expired', 'Your 30-minute session has ended. You have been logged out.');
        clearInterval(interval);
      } else {
        setTimeLeft(Math.ceil(remainingMs / 1000));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [session]);

  // 4. Auth Actions
  const handleOpenLogin = async () => {
    addLog('Calling Native Login Bridge...');
    try {
      // Pass registered users to Login Screen (Native Compose Activity)
      const result = await NativeAuthModule.navigateToLogin(JSON.stringify(registeredUsers));
      
      if (result) {
        if (result.email) {
          // Logged in! Find user name
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
          await AsyncStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(newSession));
          addLog(`Logged in successfully: ${result.email}`);
        } else if (result.action === 'signup') {
          addLog('Redirecting to Signup screen...');
          // Fast-redirect helper
          setTimeout(() => {
            handleOpenSignup();
          }, 300);
        }
      } else {
        addLog('Login canceled by user.');
      }
    } catch (e: any) {
      addLog(`Login bridge error: ${e.message}`);
    }
  };

  const handleOpenSignup = async () => {
    addLog('Calling Native Signup Bridge...');
    try {
      // Pass existing emails to Signup Screen (Native Compose Activity)
      const emailsList = registeredUsers.map(u => u.email);
      const result = await NativeAuthModule.navigateToSignup(emailsList);

      if (result) {
        if (result.email && result.name) {
          // 1. Add new user to registered list
          const newUser: RegisteredUser = {
            email: result.email,
            name: result.name
          };
          const updatedUsers = [...registeredUsers, newUser];
          setRegisteredUsers(updatedUsers);
          await AsyncStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(updatedUsers));
          addLog(`New user registered: ${result.email}`);

          // 2. Start session
          const now = Date.now();
          const newSession: Session = {
            email: result.email,
            name: result.name,
            loginTime: now,
            expireTime: now + SESSION_DURATION_MS
          };
          setSession(newSession);
          await AsyncStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(newSession));
          addLog(`Logged in immediately as: ${result.email}`);
        } else if (result.action === 'login') {
          addLog('Redirecting to Login screen...');
          setTimeout(() => {
            handleOpenLogin();
          }, 300);
        }
      } else {
        addLog('Signup canceled by user.');
      }
    } catch (e: any) {
      addLog(`Signup bridge error: ${e.message}`);
    }
  };

  const handleLogout = async () => {
    if (session) {
      const email = session.email;
      setSession(null);
      await AsyncStorage.removeItem(STORAGE_SESSION_KEY);
      addLog(`User ${email} logged out manually.`);
    }
  };

  // Fast forward for testing session expiration (sets it to expire in 15 seconds)
  const handleFastForward = async () => {
    if (!session) return;
    const now = Date.now();
    const newSession: Session = {
      ...session,
      expireTime: now + 15 * 1000
    };
    setSession(newSession);
    await AsyncStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(newSession));
    addLog('Time advanced. Session will expire in 15 seconds!');
  };

  // Reset database for testing
  const handleClearDatabase = async () => {
    setRegisteredUsers([]);
    setSession(null);
    await AsyncStorage.removeItem(STORAGE_USERS_KEY);
    await AsyncStorage.removeItem(STORAGE_SESSION_KEY);
    addLog('Cleared all users and active sessions.');
    Alert.alert('Cleared', 'Database has been fully reset.');
  };

  // Format countdown text (MM:SS)
  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.appHeader}>
        <Text style={styles.appTitle}>SecureAuth Portal</Text>
        <Text style={styles.appSubtitle}>stateless native screens + AsyncStorage in JS</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        {/* SECTION 1: AUTH STATUS */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>Authentication Status</Text>

          {session ? (
            <View style={styles.authBox}>
              <Text style={styles.statusLabel}>Logged In As:</Text>
              <Text style={styles.userDisplay}>{session.name} ({session.email})</Text>
              
              <View style={styles.timerDisplayBox}>
                <Text style={styles.timerTitle}>Session Expiration Countdown:</Text>
                <Text style={[styles.timerCountdown, timeLeft < 60 && styles.textRed]}>
                  {formatCountdown(timeLeft)}
                </Text>
                <Text style={styles.timerHelper}>Session expires automatically after 30 minutes.</Text>
              </View>

              <View style={styles.actionRow}>
                <TouchableOpacity style={[styles.button, styles.buttonRed]} onPress={handleLogout}>
                  <Text style={styles.buttonText}>Log Out</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, styles.buttonOrange]} onPress={handleFastForward}>
                  <Text style={styles.buttonText}>⚡ Speed Up (15s)</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.authBox}>
              <Text style={styles.loggedOutLabel}>Status: Not Logged In</Text>
              
              <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={handleOpenLogin}>
                <Text style={styles.buttonText}>Open Native Login</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.button, styles.buttonOutline]} onPress={handleOpenSignup}>
                <Text style={styles.buttonOutlineText}>Open Native Signup</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* SECTION 2: REGISTERED USERS */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>Registered Users (Stored in AsyncStorage)</Text>
          
          <View style={styles.databaseBox}>
            {registeredUsers.length === 0 ? (
              <Text style={styles.noUsersText}>No registered users in database.</Text>
            ) : (
              registeredUsers.map((user, idx) => (
                <View key={user.email} style={[styles.userItemRow, idx === registeredUsers.length - 1 && styles.noBorder]}>
                  <Text style={styles.userItemName}>{user.name}</Text>
                  <Text style={styles.userItemEmail}>{user.email}</Text>
                </View>
              ))
            )}
          </View>

          <TouchableOpacity style={[styles.buttonSmall, styles.buttonSmallRed]} onPress={handleClearDatabase}>
            <Text style={styles.buttonSmallText}>Clear Registered Users Database</Text>
          </TouchableOpacity>
        </View>

        {/* SECTION 3: SYSTEM CONSOLE LOGS */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionHeader}>Console Logs (Trace actions)</Text>
          <View style={styles.logsBox}>
            <ScrollView nestedScrollEnabled>
            {logs.length === 0 ? (
              <Text style={styles.noUsersText}>No actions traced yet.</Text>
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
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingTop: 30,
  },
  appHeader: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  appTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
  },
  appSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  scrollContainer: {
    padding: 16,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
  statusLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    textTransform: 'uppercase',
  },
  userDisplay: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 2,
    marginBottom: 16,
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
  timerTitle: {
    fontSize: 12,
    color: '#6B7280',
  },
  timerCountdown: {
    fontSize: 28,
    fontWeight: '800',
    color: '#4B5563',
    marginVertical: 6,
  },
  timerHelper: {
    fontSize: 11,
    color: '#9CA3AF',
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
  databaseBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 6,
    padding: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 12,
  },
  userItemRow: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  userItemName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1F2937',
  },
  userItemEmail: {
    fontSize: 12,
    color: '#6B7280',
  },
  noUsersText: {
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
  buttonSmallText: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '600',
  },
  logsBox: {
    backgroundColor: '#1F2937',
    borderRadius: 6,
    padding: 10,
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
  textRed: {
    color: '#EF4444',
  },
});
