export const ENV = {
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  appUrl: import.meta.env.APP_URL || 'http://localhost:3000',
  mode: import.meta.env.MODE,
};
