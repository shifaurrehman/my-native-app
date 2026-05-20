export interface RegisteredUser {
  email: string;
  name: string;
}

export interface Session {
  email: string;
  name: string;
  loginTime: number;
  expireTime: number;
}

export interface LogEntry {
  id: string;
  time: string;
  message: string;
}
