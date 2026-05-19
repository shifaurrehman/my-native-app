import type { StyleProp, ViewStyle } from 'react-native';

export type OnLoadEventPayload = {
  url: string;
};

export type BackgroundLoggerModuleEvents = {
  onTimeLogged: (event: TimeLoggedEventPayload) => void;
};

export type TimeLoggedEventPayload = {
  time: string;
};

export type BackgroundLoggerViewProps = {
  url: string;
  onLoad: (event: { nativeEvent: OnLoadEventPayload }) => void;
  style?: StyleProp<ViewStyle>;
};
