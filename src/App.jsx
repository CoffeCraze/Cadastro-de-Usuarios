import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Dashboard from "./pages/Dashboard/dashboard.jsx"
import Login from "./pages/Login/login.jsx"
import Signup from "./pages/Signup/signup.jsx"

// Componente para proteger rotas
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token")
  return token ? children : <Navigate to="/" replace />
}

// Componente para redirecionar usuários logados
function PublicRoute({ children }) {
  const token = localStorage.getItem("token")
  return token ? <Navigate to="/dashboard" replace /> : children
}

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
