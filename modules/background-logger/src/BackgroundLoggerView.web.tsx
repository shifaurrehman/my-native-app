import * as React from 'react';

import { BackgroundLoggerViewProps } from './BackgroundLogger.types';

export default function BackgroundLoggerView(props: BackgroundLoggerViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
