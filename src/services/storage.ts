import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_USERS_KEY, STORAGE_SESSION_KEY } from '../constants';
import { RegisteredUser, Session } from '../types';

export const getRegisteredUsers = async (): Promise<RegisteredUser[]> => {
  const storedUsers = await AsyncStorage.getItem(STORAGE_USERS_KEY);
  return storedUsers ? JSON.parse(storedUsers) : [];
};

export const saveRegisteredUsers = async (users: RegisteredUser[]): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
};

export const getSession = async (): Promise<Session | null> => {
  const storedSession = await AsyncStorage.getItem(STORAGE_SESSION_KEY);
  return storedSession ? JSON.parse(storedSession) : null;
};

export const saveSession = async (session: Session): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(session));
};

export const clearSession = async (): Promise<void> => {
  await AsyncStorage.removeItem(STORAGE_SESSION_KEY);
};

export const clearAllData = async (): Promise<void> => {
  await AsyncStorage.removeItem(STORAGE_USERS_KEY);
  await AsyncStorage.removeItem(STORAGE_SESSION_KEY);
};
