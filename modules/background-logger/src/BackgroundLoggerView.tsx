import { requireNativeView } from 'expo';
import * as React from 'react';

import { BackgroundLoggerViewProps } from './BackgroundLogger.types';

const NativeView: React.ComponentType<BackgroundLoggerViewProps> =
  requireNativeView('BackgroundLogger');

export default function BackgroundLoggerView(props: BackgroundLoggerViewProps) {
  return <NativeView {...props} />;
}
