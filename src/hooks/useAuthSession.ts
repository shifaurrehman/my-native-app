import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { RegisteredUser, Session } from '../types';
import { SESSION_DURATION_MS } from '../constants';
import * as storage from '../services/storage';
import * as authBridge from '../services/authBridge';

export const useAuthSession = (addLog: (message: string) => void) => {
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // 1. Initialize persistent data on mount
  useEffect(() => {
    const initializeData = async () => {
      addLog('Initializing application data...');
      try {
        // Load Registered Users
        let users = await storage.getRegisteredUsers();
        if (users.length > 0) {
          addLog(`Loaded ${users.length} registered users from AsyncStorage.`);
        } else {
          // Setup default mock users if none exist yet
          users = [
            { email: 'shifa@gmail.com', name: 'Shifa Ur Rehman' },
            { email: 'demo@example.com', name: 'Demo Tester' }
          ];
          await storage.saveRegisteredUsers(users);
          addLog('AsyncStorage was empty. Saved default testing users.');
        }
        setRegisteredUsers(users);

        // Load Session
        const storedSession = await storage.getSession();
        if (storedSession) {
          const now = Date.now();
          if (storedSession.expireTime > now) {
            setSession(storedSession);
            setTimeLeft(Math.ceil((storedSession.expireTime - now) / 1000));
            addLog(`Restored active session for: ${storedSession.email}`);
          } else {
            await storage.clearSession();
            addLog('Stored session was expired, cleared it.');
          }
        }
      } catch (error: any) {
        addLog(`Error initializing data: ${error.message}`);
      }
    };

    initializeData();
  }, [addLog]);

  // 2. Keep timer running and check session expiry
  useEffect(() => {
    if (!session) {
      setTimeLeft(0);
      return;
    }

    const interval = setInterval(async () => {
      const now = Date.now();
      const remainingMs = session.expireTime - now;

      if (remainingMs <= 0) {
        setSession(null);
        await storage.clearSession();
        addLog(`Session for ${session.email} expired automatically!`);
        Alert.alert('Session Expired', 'Your session has ended. You have been logged out.');
        clearInterval(interval);
      } else {
        setTimeLeft(Math.ceil(remainingMs / 1000));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [session, addLog]);

  // Forward declarations for cross-references
  let handleOpenLogin: () => Promise<void>;
  let handleOpenSignup: () => Promise<void>;

  handleOpenLogin = async () => {
    addLog('Calling Native Login Bridge...');
    try {
      // Get the freshest state of registered users
      const users = await storage.getRegisteredUsers();
      const result = await authBridge.navigateToLogin(users);

      if (result) {
        if (result.email) {
          const user = users.find(u => u.email.toLowerCase() === result.email!.toLowerCase());
          const userName = user ? user.name : 'User';

          const now = Date.now();
          const newSession: Session = {
            email: result.email,
            name: userName,
            loginTime: now,
            expireTime: now + SESSION_DURATION_MS
          };

          setSession(newSession);
          await storage.saveSession(newSession);
          addLog(`Logged in successfully: ${result.email}`);
        } else if (result.action === 'signup') {
          addLog('Redirecting to Signup screen...');
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

  handleOpenSignup = async () => {
    addLog('Calling Native Signup Bridge...');
    try {
      const users = await storage.getRegisteredUsers();
      const emailsList = users.map(u => u.email);
      const result = await authBridge.navigateToSignup(emailsList);

      if (result) {
        if (result.email && result.name) {
          const newUser: RegisteredUser = {
            email: result.email,
            name: result.name
          };
          const updatedUsers = [...users, newUser];
          setRegisteredUsers(updatedUsers);
          await storage.saveRegisteredUsers(updatedUsers);
          addLog(`New user registered: ${result.email}`);

          const now = Date.now();
          const newSession: Session = {
            email: result.email,
            name: result.name,
            loginTime: now,
            expireTime: now + SESSION_DURATION_MS
          };
          setSession(newSession);
          await storage.saveSession(newSession);
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

  const handleLogout = useCallback(async () => {
    if (session) {
      const email = session.email;
      setSession(null);
      await storage.clearSession();
      addLog(`User ${email} logged out manually.`);
    }
  }, [session, addLog]);

  const handleFastForward = useCallback(async () => {
    if (!session) return;
    const now = Date.now();
    const newSession: Session = {
      ...session,
      expireTime: now + 15 * 1000 // 15 seconds
    };
    setSession(newSession);
    await storage.saveSession(newSession);
    addLog('Time advanced. Session will expire in 15 seconds!');
  }, [session, addLog]);

  const handleClearDatabase = useCallback(async () => {
    setRegisteredUsers([]);
    setSession(null);
    await storage.clearAllData();
    addLog('Cleared all users and active sessions.');
    Alert.alert('Cleared', 'Database has been fully reset.');
  }, [addLog]);

  return {
    registeredUsers,
    session,
    timeLeft,
    handleOpenLogin,
    handleOpenSignup,
    handleLogout,
    handleFastForward,
    handleClearDatabase
  };
};
