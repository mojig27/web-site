type LogLevel = 'info' | 'warn' | 'error';

interface LogPayload {
  message: string;
  level: LogLevel;
  [key: string]: any;
}

export const logToServer = async (payload: LogPayload) => {
  try {
    await fetch('/api/logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...payload,
        timestamp: new Date().toISOString(),
        userAgent: window.navigator.userAgent,
        url: window.location.href
      })
    });
  } catch (error) {
    console.error('Failed to send log:', error);
  }
};