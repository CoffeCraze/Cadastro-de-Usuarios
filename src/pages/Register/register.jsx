"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import "./register.css"
import Trash from "../../assets/trash.svg"
import api from "../../services/api"

function Register() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const navigate = useNavigate()

  const inputName = useRef()
  const inputEmail = useRef()
  const inputPassword = useRef()

  // Verifica se o usuário está logado
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      navigate("/")
      return
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
        <h1>Cadastro de Usuários</h1>
        <button onClick={logout} className="logout-btn">
          Sair
        </button>
      </div>

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
        <input type="password" placeholder="Senha (mínimo 6 caracteres)" ref={inputPassword} required minLength="6" />

        <button type="submit" disabled={loading}>
          {loading ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>

      <div className="users">
        <h2>Usuários Cadastrados ({users.length})</h2>
        {Array.isArray(users) && users.length > 0 ? (
          users.map((user) => (
            <div key={user.id} className="card">
              <div className="user-info">
                <p className="user-name">
                  Nome: <span>{user.name}</span>
                </p>
                <p className="user-email">
                  Email: <span>{user.email}</span>
                </p>
              </div>
              <button onClick={() => deleteUser(user.id)} className="delete-btn" title="Deletar usuário">
                <img src={Trash || "/placeholder.svg"} alt="Deletar" />
              </button>
            </div>
          ))
        ) : (
          <p className="no-users">Nenhum usuário cadastrado</p>
        )}
      </div>
    </div>
  )
}

export default Register
