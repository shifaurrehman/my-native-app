import { registerWebModule, NativeModule } from 'expo';

import { BackgroundLoggerModuleEvents } from './BackgroundLogger.types';

class BackgroundLoggerModule extends NativeModule<BackgroundLoggerModuleEvents> {
  async startBackgroundService(): Promise<boolean> {
    return true;
  }
  async stopBackgroundService(): Promise<boolean> {
    return true;
  }
  async getBackgroundLogs(): Promise<string> {
    return '[]';
  }
  async clearBackgroundLogs(): Promise<boolean> {
    return true;
  }
}

export default registerWebModule(BackgroundLoggerModule, 'BackgroundLoggerModule');
