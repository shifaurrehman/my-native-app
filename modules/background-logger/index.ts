// Reexport the native module. On web, it will be resolved to BackgroundLoggerModule.web.ts
// and on native platforms to BackgroundLoggerModule.ts
export { default } from './src/BackgroundLoggerModule';
export { default as BackgroundLoggerView } from './src/BackgroundLoggerView';
export * from  './src/BackgroundLogger.types';
