import { NativeModule, requireNativeModule } from 'expo';

import { BackgroundLoggerModuleEvents } from './BackgroundLogger.types';

declare class BackgroundLoggerModule extends NativeModule<BackgroundLoggerModuleEvents> {
  startBackgroundService(): Promise<boolean>;
  stopBackgroundService(): Promise<boolean>;
  getBackgroundLogs(): Promise<string>;
  clearBackgroundLogs(): Promise<boolean>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<BackgroundLoggerModule>('BackgroundLogger');
