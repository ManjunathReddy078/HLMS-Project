// Mock configuration for HLIMS until real credentials are provided
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "MOCK_API_KEY",
  authDomain: "pesuimsr-hlims.firebaseapp.mock",
  projectId: "pesuimsr-hlims-mock",
  storageBucket: "pesuimsr-hlims-mock.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
