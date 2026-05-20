import { NativeModules } from 'react-native';
import { RegisteredUser } from '../types';

const { AuthNavigationModule: NativeAuthModule } = NativeModules;

export interface NativeLoginResult {
  email?: string;
  action?: 'signup';
}

export interface NativeSignupResult {
  email?: string;
  name?: string;
  action?: 'login';
}

export const navigateToLogin = async (registeredUsers: RegisteredUser[]): Promise<NativeLoginResult | null> => {
  if (!NativeAuthModule) {
    throw new Error('AuthNavigationModule native module is not available');
  }
  const resultStr = await NativeAuthModule.navigateToLogin(JSON.stringify(registeredUsers));
  return resultStr ? resultStr : null;
};

export const navigateToSignup = async (emailsList: string[]): Promise<NativeSignupResult | null> => {
  if (!NativeAuthModule) {
    throw new Error('AuthNavigationModule native module is not available');
  }
  const resultStr = await NativeAuthModule.navigateToSignup(emailsList);
  return resultStr ? resultStr : null;
};
