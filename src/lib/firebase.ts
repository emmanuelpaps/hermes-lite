import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, initializeFirestore, Firestore } from 'firebase/firestore';

// Proyecto Oficial Firebase: Tecza Admin Financiero (tecza-admin-26)
export const firebaseConfig = {
  projectId: 'tecza-admin-26',
  appId: '1:94232816696:web:54587698a0cf9114e00acd',
  storageBucket: 'tecza-admin-26.firebasestorage.app',
  apiKey: 'AIzaSyBzMQi3EFzBCLai0-IfHEOwMtLBdIjDAig',
  authDomain: 'tecza-admin-26.firebaseapp.com',
  messagingSenderId: '94232816696',
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

function initDb(): Firestore {
  // En funciones Serverless (Vercel), forzar HTTP Long-Polling evita que los sockets gRPC
  // queden congelados entre invocaciones tibias (Error Code 14 UNAVAILABLE).
  if (typeof window === 'undefined') {
    try {
      return initializeFirestore(app, {
        experimentalForceLongPolling: true,
      });
    } catch {
      return getFirestore(app);
    }
  }
  return getFirestore(app);
}

export const db = initDb();
export default app;
