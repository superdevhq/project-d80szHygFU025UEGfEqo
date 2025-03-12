
/**
 * Enhanced data logging utility
 * @param data Any data to log
 * @param tag Optional tag to categorize logs
 * @param logLevel Optional log level (default: 'info')
 */
export const logData = (data: any, tag?: string, logLevel: 'info' | 'warn' | 'error' | 'debug' = 'info'): void => {
  const timestamp = new Date().toISOString();
  const tagString = tag ? `[${tag}]` : '';
  const levelEmoji = {
    'info': 'ℹ️',
    'warn': '⚠️',
    'error': '❌',
    'debug': '🔍'
  }[logLevel];
  
  console[logLevel === 'error' ? 'error' : logLevel === 'warn' ? 'warn' : 'log'](
    `[Data Logger ${levelEmoji} ${timestamp}]${tagString}:`, 
    data
  );
};

/**
 * Measure execution time of a function
 * @param fn Function to measure
 * @param args Arguments to pass to the function
 * @returns The result of the function
 */
export const timeExecution = <T, A extends any[]>(fn: (...args: A) => T, ...args: A): T => {
  const start = performance.now();
  const result = fn(...args);
  const end = performance.now();
  console.log(`[Timer]: Function executed in ${(end - start).toFixed(2)}ms`);
  return result;
};

/**
 * Debounce a function call
 * @param fn Function to debounce
 * @param delay Delay in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(fn: T, delay: number): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delay);
  };
};

/**
 * Throttle a function call
 * @param fn Function to throttle
 * @param limit Time limit in milliseconds
 * @returns Throttled function
 */
export const throttle = <T extends (...args: any[]) => any>(fn: T, limit: number): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;
  
  return function(...args: Parameters<T>) {
    const now = Date.now();
    if (now - lastCall >= limit) {
      fn(...args);
      lastCall = now;
    }
  };
};

/**
 * Retry a function multiple times until it succeeds
 * @param fn Function to retry
 * @param maxAttempts Maximum number of attempts
 * @param delay Delay between attempts in milliseconds
 * @returns Promise resolving to the function result
 */
export const retry = async <T>(
  fn: () => Promise<T>, 
  maxAttempts: number = 3, 
  delay: number = 500
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      console.log(`[Retry ${attempt}/${maxAttempts}]: Failed - ${lastError.message}`);
      
      if (attempt < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError!;
};

/**
 * OpenAI API configuration
 */
export const openAIConfig = {
  apiKey: process.env.OPENAI_API_KEY || 'your-default-key-here',
  model: 'gpt-4-turbo',
  temperature: 0.7,
  maxTokens: 2000
};

/**
 * Update OpenAI API key
 * @param newApiKey The new API key to use
 */
export const updateOpenAIApiKey = (newApiKey: string): void => {
  if (!newApiKey || newApiKey.trim() === '') {
    throw new Error('API key cannot be empty');
  }
  
  if (typeof window !== 'undefined') {
    // Store in localStorage for client-side persistence
    localStorage.setItem('openai_api_key', newApiKey);
    logData('OpenAI API key updated and stored in localStorage', 'OpenAI', 'info');
  }
  
  // Update the runtime configuration
  openAIConfig.apiKey = newApiKey;
};

/**
 * Get the current OpenAI API key
 * @returns The current API key
 */
export const getOpenAIApiKey = (): string => {
  if (typeof window !== 'undefined') {
    // Try to get from localStorage first
    const storedKey = localStorage.getItem('openai_api_key');
    if (storedKey) {
      return storedKey;
    }
  }
  
  return openAIConfig.apiKey;
};
