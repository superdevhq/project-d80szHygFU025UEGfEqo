
/**
 * Simple console log utility function
 * @param message The message to log
 * @param level Optional log level (default: 'info')
 */
export const logMessage = (message: string, level: 'info' | 'warn' | 'error' = 'info'): void => {
  const emoji = level === 'info' ? 'ℹ️' : level === 'warn' ? '⚠️' : '❌';
  console.log(`[Logger ${emoji}]: ${message}`);
};

/**
 * Log a success message
 * @param message The success message to log
 */
export const logSuccess = (message: string): void => {
  console.log(`[Logger ✅]: ${message}`);
};

/**
 * Log a group of related messages
 * @param groupName Name of the log group
 * @param callback Function containing logs to group
 */
export const logGroup = (groupName: string, callback: () => void): void => {
  console.group(`[Logger 📋]: ${groupName}`);
  callback();
  console.groupEnd();
};

/**
 * Log with color styling
 * @param message Message to log
 * @param color CSS color string
 */
export const logColored = (message: string, color: string): void => {
  console.log(`%c[Logger]: ${message}`, `color: ${color}; font-weight: bold;`);
};

/**
 * Create a logger instance with a specific context
 * @param context Context name for this logger
 * @returns Object with logging methods
 */
export const createContextLogger = (context: string) => {
  return {
    info: (message: string) => logMessage(`[${context}] ${message}`, 'info'),
    warn: (message: string) => logMessage(`[${context}] ${message}`, 'warn'),
    error: (message: string) => logMessage(`[${context}] ${message}`, 'error'),
    success: (message: string) => logSuccess(`[${context}] ${message}`),
  };
};
