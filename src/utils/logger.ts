
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
