
/**
 * Enhanced data logging utility
 * @param data Any data to log
 * @param tag Optional tag to categorize logs
 */
export const logData = (data: any, tag?: string): void => {
  const timestamp = new Date().toISOString();
  const tagString = tag ? `[${tag}]` : '';
  console.log(`[Data Logger ${timestamp}]${tagString}:`, data);
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
