import React from 'react';
import { StyleSheet, View, ScrollView, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Hooks
import { useSystemLogs } from './hooks/useSystemLogs';
import { useAuthSession } from './hooks/useAuthSession';
import { useBackgroundLogs } from './hooks/useBackgroundLogs';
import { useThemeMode } from './hooks/useThemeMode';

// Components
import { Header } from './components/Header';
import { AuthStatusCard } from './components/AuthStatusCard';
import { BackgroundLogsList } from './components/BackgroundLogsList';
import { RegisteredUsersList } from './components/RegisteredUsersList';
import { LogConsole } from './components/LogConsole';

export default function App() {
  const { logs, addLog, clearLogs } = useSystemLogs();
  const { theme, toggleTheme } = useThemeMode();
  
  const {
    registeredUsers,
    session,
    timeLeft,
    handleOpenLogin,
    handleOpenSignup,
    handleLogout,
    handleFastForward,
    handleClearDatabase,
  } = useAuthSession(addLog);

  const { bgLogs, clearBgLogs } = useBackgroundLogs(session, addLog);

  const isDark = theme === 'dark';

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Header theme={theme} onToggleTheme={toggleTheme} />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* SECTION 1: AUTH STATUS */}
        <AuthStatusCard
          session={session}
          timeLeft={timeLeft}
          onLogout={handleLogout}
          onFastForward={handleFastForward}
          onOpenLogin={handleOpenLogin}
          onOpenSignup={handleOpenSignup}
          theme={theme}
        />

        {/* SECTION 2: NATIVE BACKGROUND TIMELOGS */}
        <BackgroundLogsList
          bgLogs={bgLogs}
          onClearBgLogs={clearBgLogs}
          theme={theme}
        />

        {/* SECTION 3: REGISTERED USERS */}
        <RegisteredUsersList
          registeredUsers={registeredUsers}
          onClearDatabase={handleClearDatabase}
          sectionNumber={3}
          theme={theme}
        />

        {/* SECTION 4: SYSTEM CONSOLE LOGS */}
        <LogConsole
          logs={logs}
          sectionNumber={4}
          onClearLogs={clearLogs}
          theme={theme}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 30,
  },
  containerDark: {
    backgroundColor: '#111827',
  },
  scrollContainer: {
    padding: 16,
  },
});
