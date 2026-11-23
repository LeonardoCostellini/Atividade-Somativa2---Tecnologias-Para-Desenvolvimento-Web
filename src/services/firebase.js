import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Os valores vêm do arquivo .env (veja .env.example). Nada é fixo no código.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

// true somente se as credenciais obrigatórias foram preenchidas
export const firebaseConfigurado = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId
)

const app = initializeApp(firebaseConfig)

// Sem credenciais, getAuth() lança erro e derruba a página inteira (tela branca).
// Por isso só inicializamos quando o .env está preenchido; a tela mostra um aviso.
export const auth = firebaseConfigurado ? getAuth(app) : null // Firebase Authentication
export const db = firebaseConfigurado ? getFirestore(app) : null // Cloud Firestore
