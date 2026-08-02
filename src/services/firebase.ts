import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getFirebaseConfig } from '../config/firebase.config';

const config = getFirebaseConfig();

const app: FirebaseApp = getApps().length === 0 ? initializeApp(config) : getApp();

export const auth: Auth = getAuth(app);

export const db: Firestore = config.firestoreDatabaseId 
  ? getFirestore(app, config.firestoreDatabaseId)
  : getFirestore(app);

export const storage: FirebaseStorage = getStorage(app);

export default app;
