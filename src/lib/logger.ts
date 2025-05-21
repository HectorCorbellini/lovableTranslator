// Simple logger service. Replace or extend for production use.
export const logger = {
  debug: (...args: any[]) => {
    if (import.meta.env.DEV) {
      console.debug(...args);
    }
  },
  info: (...args: any[]) => {
    console.info(...args);
  },
  error: (...args: any[]) => {
    console.error(...args);
  },
};
