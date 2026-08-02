import firebaseConfigJson from '../../firebase-applet-config.json';

export interface FirebaseClientConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  firestoreDatabaseId?: string;
}

export const getFirebaseConfig = (): FirebaseClientConfig => {
  const env: Record<string, string> = {};

  if (typeof process !== 'undefined' && process.env) {
    Object.assign(env, process.env);
  }

  try {
    const metaEnv = Function('return import.meta.env')();
    if (metaEnv) {
      Object.assign(env, metaEnv);
    }
  } catch {
    // Ignore in CJS environment
  }

  return {
    apiKey: env.VITE_FIREBASE_API_KEY || firebaseConfigJson.apiKey,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfigJson.authDomain,
    projectId: env.VITE_FIREBASE_PROJECT_ID || firebaseConfigJson.projectId,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfigJson.storageBucket,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfigJson.messagingSenderId,
    appId: env.VITE_FIREBASE_APP_ID || firebaseConfigJson.appId,
    firestoreDatabaseId: env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || firebaseConfigJson.firestoreDatabaseId,
  };
};
