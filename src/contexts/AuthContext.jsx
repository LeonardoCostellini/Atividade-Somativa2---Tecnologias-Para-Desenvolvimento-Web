import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../services/firebase.js'

const AuthContext = createContext({ user: null, carregando: true })

// Descobre, em tempo real, quem é o usuário autenticado (ou se não há ninguém).
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    if (!auth) {
      setCarregando(false)
      return
    }
    const cancelar = onAuthStateChanged(auth, (usuarioFirebase) => {
      setUser(usuarioFirebase)
      setCarregando(false) // o Firebase já terminou de verificar a sessão
    })
    return cancelar
  }, [])

  return (
    <AuthContext.Provider value={{ user, carregando }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
