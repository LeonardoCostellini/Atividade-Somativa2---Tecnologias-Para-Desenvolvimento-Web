import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'

// Protege páginas: sem usuário autenticado, volta para o Login.
function PrivateRoute({ children }) {
  const { user, carregando } = useAuth()

  if (carregando) {
    return (
      <div className="tela-carregando" role="status">
        <span className="spinner" /> Verificando sessão…
      </div>
    )
  }
  return user ? children : <Navigate to="/login" replace />
}

export default PrivateRoute
