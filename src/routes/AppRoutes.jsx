import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Cadastro from '../pages/Cadastro.jsx'
import Login from '../pages/Login.jsx'
import Principal from '../pages/Principal.jsx'
import PrivateRoute from '../components/PrivateRoute.jsx'

// Arquivo exclusivo das rotas: cada rota representa uma página.
function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/principal"
          element={
            <PrivateRoute>
              <Principal />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes
