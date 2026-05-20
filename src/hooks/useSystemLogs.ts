import { useState, useCallback } from 'react';
import { LogEntry } from '../types';

export const useSystemLogs = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const addLog = useCallback((message: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs(prev => [
      { id: Math.random().toString(), time: timeStr, message },
      ...prev
    ].slice(0, 30));
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  return {
    logs,
    addLog,
    clearLogs
  };
};
