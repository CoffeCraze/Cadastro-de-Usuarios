"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import "./dashboard.css"
import api from "../../services/api"

function Dashboard() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [currentUser, setCurrentUser] = useState(null)
  const navigate = useNavigate()

  const inputName = useRef()
  const inputEmail = useRef()
  const inputPassword = useRef()

  // Verifica se o usuário está logado
  useEffect(() => {
    const token = localStorage.getItem("token")
    const user = localStorage.getItem("user")

    if (!token) {
      navigate("/")
      return
    }

    if (user) {
      setCurrentUser(JSON.parse(user))
    }

    getUsers()
  }, [navigate])

  async function getUsers() {
    try {
      const response = await api.get("/usuarios")
      setUsers(Array.isArray(response.data) ? response.data : [])
    } catch (error) {
      console.error("Erro ao buscar usuários:", error)
      setError("Erro ao carregar usuários")
      setUsers([])
    }
  }

  function validateEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/
    return regex.test(email)
  }

  async function createUser() {
    const name = inputName.current.value.trim()
    const email = inputEmail.current.value.trim()
    const password = inputPassword.current.value.trim()

    // Validação dos campos
    if (!name || !email || !password) {
      setError("Preencha todos os campos!")
      return
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres!")
      return
    }

    if (!validateEmail(email)) {
      setError("Por favor, use um email @gmail.com válido")
      return
    }

    try {
      setLoading(true)
      setError("")
      setSuccess("")

      await api.post("/usuarios", {
        name,
        email,
        password,
      })

      // Limpa os campos
      inputName.current.value = ""
      inputEmail.current.value = ""
      inputPassword.current.value = ""

      setSuccess("Usuário cadastrado com sucesso!")

      // Atualiza a lista de usuários
      await getUsers()
    } catch (error) {
      console.error("Erro ao criar usuário:", error)
      setError(error.response?.data?.message || "Erro ao criar usuário")
    } finally {
      setLoading(false)
    }
  }

  async function deleteUser(id) {
    if (!window.confirm("Tem certeza que deseja excluir este usuário?")) return

    try {
      await api.delete(`/usuarios/${id}`)
      setSuccess("Usuário deletado com sucesso!")
      await getUsers()
    } catch (error) {
      console.error("Erro ao deletar usuário:", error)
      setError("Erro ao deletar usuário")
    }
  }

  function logout() {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/")
  }

  return (
    <div className="container">
      <div className="header">
        <div className="welcome">
          <h1>Dashboard</h1>
          {currentUser && <p>Bem-vindo, {currentUser.name}!</p>}
        </div>
        <button onClick={logout} className="logout-btn">
          Sair
        </button>
      </div>

      <div className="content">
        <div className="form-section">
          <h2>Cadastrar Novo Usuário</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              createUser()
            }}
          >
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <input type="text" placeholder="Nome" ref={inputName} required />
            <input
              type="email"
              placeholder="exemplo@gmail.com"
              ref={inputEmail}
              required
              pattern="[a-zA-Z0-9._%+-]+@gmail\.com"
              title="Por favor, use um email @gmail.com"
            />
            <input
              type="password"
              placeholder="Senha (mínimo 6 caracteres)"
              ref={inputPassword}
              required
              minLength="6"
            />

            <button type="submit" disabled={loading}>
              {loading ? "Cadastrando..." : "Cadastrar"}
            </button>
          </form>
        </div>

        <div className="users-section">
          <h2>Usuários Cadastrados ({users.length})</h2>
          <div className="users">
            {Array.isArray(users) && users.length > 0 ? (
              users.map((user) => (
                <div key={user.id} className="card">
                  <div className="user-info">
                    <p className="user-name">
                      <strong>{user.name}</strong>
                    </p>
                    <p className="user-email">{user.email}</p>
                    <p className="user-date">Cadastrado em: {new Date(user.createdAt).toLocaleDateString("pt-BR")}</p>
                  </div>
                  <button onClick={() => deleteUser(user.id)} className="delete-btn" title="Deletar usuário">
                    🗑️
                  </button>
                </div>
              ))
            ) : (
              <p className="no-users">Nenhum usuário cadastrado</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
