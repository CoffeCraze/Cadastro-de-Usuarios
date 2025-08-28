"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import api from "../../services/api"
import "./signup.css"

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/
    return regex.test(email)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Validações
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Todos os campos são obrigatórios!")
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem!")
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres!")
      setLoading(false)
      return
    }

    if (!validateEmail(formData.email)) {
      setError("Por favor, use um email @gmail.com válido")
      setLoading(false)
      return
    }

    try {
      await api.post("/usuarios", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      })

      alert("Cadastro realizado com sucesso! Faça login para continuar.")
      navigate("/")
    } catch (error) {
      console.error("Erro no cadastro:", error)
      setError(error.response?.data?.message || "Erro ao criar conta")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-form">
        <h1>Criar Conta</h1>

        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <input
            type="text"
            name="name"
            placeholder="Nome completo"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="exemplo@gmail.com"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
            pattern="[a-zA-Z0-9._%+-]+@gmail\.com"
            title="Por favor, use um email @gmail.com"
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            name="password"
            placeholder="Senha (mínimo 6 caracteres)"
            value={formData.password}
            onChange={handleChange}
            required
            disabled={loading}
            minLength="6"
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirme a senha"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            disabled={loading}
            minLength="6"
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Criando conta..." : "Criar Conta"}
        </button>

        <p className="auth-link">
          Já tem uma conta? <Link to="/">Faça login aqui</Link>
        </p>
      </form>
    </div>
  )
}
