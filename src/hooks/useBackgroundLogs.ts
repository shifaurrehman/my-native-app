import { useState, useEffect, useCallback } from 'react';
import BackgroundLogger from '../../modules/background-logger';
import { Session } from '../types';

export const useBackgroundLogs = (
  session: Session | null,
  addLog: (message: string) => void
) => {
  const [bgLogs, setBgLogs] = useState<string[]>([]);

  // 1. Load initial logs from native SharedPreferences on mount
  useEffect(() => {
    const loadInitialLogs = async () => {
      try {
        const storedBgLogs = await BackgroundLogger.getBackgroundLogs();
        if (storedBgLogs) {
          setBgLogs(JSON.parse(storedBgLogs));
        }
      } catch (error: any) {
        addLog(`Error loading initial background logs: ${error.message}`);
      }
    };
    loadInitialLogs();
  }, [addLog]);

  // 2. Setup event listener for Expo Module background task logged time events
  useEffect(() => {
    const subscription = BackgroundLogger.addListener('onTimeLogged', (event: { time: string }) => {
      setBgLogs(prev => [event.time, ...prev]);
      addLog(`Background Task: Saved current time: ${event.time}`);
    });

    return () => {
      subscription.remove();
    };
  }, [addLog]);

  // 3. Start/Stop native background task based on session status
  useEffect(() => {
    const toggleBackgroundService = async () => {
      if (session) {
        addLog('Starting Expo Module background task (10s logger)...');
        try {
          await BackgroundLogger.startBackgroundService();
          
          // Fetch any existing saved logs from native SharedPreferences via Expo Module
          const storedBgLogs = await BackgroundLogger.getBackgroundLogs();
          setBgLogs(JSON.parse(storedBgLogs));
        } catch (error: any) {
          addLog(`Error starting background task: ${error.message}`);
        }
      } else {
        addLog('Stopping Expo Module background task...');
        try {
          await BackgroundLogger.stopBackgroundService();
          // DO NOT clear logs state on logout so they can still be viewed
        } catch (error: any) {
          addLog(`Error stopping background task: ${error.message}`);
        }
      }
    };

    toggleBackgroundService();
  }, [session, addLog]);

  // 4. Clear native background task logs via Expo Module
  const clearBgLogs = useCallback(async () => {
    try {
      await BackgroundLogger.clearBackgroundLogs();
      setBgLogs([]);
      addLog('Cleared native background time logs via Expo Module.');
    } catch (e: any) {
      addLog(`Error clearing background logs: ${e.message}`);
    }
  }, [addLog]);

  return {
    bgLogs,
    clearBgLogs
  };
};
