"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import api from "../../services/api"
import "./login.css"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await api.post("/login", { email, password })

      // Salva o token no localStorage
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user))

      // Redireciona para a página de registro (dashboard)
      navigate("/dashboard")
    } catch (error) {
      console.error("Erro no login:", error)
      setError(error.response?.data?.message || "Erro ao fazer login")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h1>Login</h1>

        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <p className="auth-link">
          Não tem uma conta? <Link to="/signup">Cadastre-se aqui</Link>
        </p>
      </form>
    </div>
  )
}
