import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

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
export const db = getFirestore(app);
export default app;
