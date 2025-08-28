import express from "express"
import cors from "cors"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const app = express()
const PORT = 3001
const JWT_SECRET = "your-secret-key-change-in-production"

// Simulando um banco de dados em memória
const users = []
let nextId = 1

app.use(cors())
app.use(express.json())

// Rota de registro
app.post("/usuarios", async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Validações
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios" })
    }

    // Verifica se email já existe
    const existingUser = users.find((user) => user.email === email)
    if (existingUser) {
      return res.status(400).json({ message: "Email já cadastrado" })
    }

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(password, 10)

    // Cria o usuário
    const newUser = {
      id: nextId++,
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    }

    users.push(newUser)

    // Retorna o usuário sem a senha
    const { password: _, ...userWithoutPassword } = newUser
    res.status(201).json(userWithoutPassword)
  } catch (error) {
    console.error("Erro no registro:", error)
    res.status(500).json({ message: "Erro interno do servidor" })
  }
})

// Rota de login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Validações
    if (!email || !password) {
      return res.status(400).json({ message: "Email e senha são obrigatórios" })
    }

    // Busca o usuário
    const user = users.find((u) => u.email === email)
    if (!user) {
      return res.status(401).json({ message: "Credenciais inválidas" })
    }

    // Verifica a senha
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({ message: "Credenciais inválidas" })
    }

    // Gera o token JWT
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "24h" })

    // Retorna o token e dados do usuário
    const { password: _, ...userWithoutPassword } = user
    res.json({
      token,
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("Erro no login:", error)
    res.status(500).json({ message: "Erro interno do servidor" })
  }
})

// Rota para listar usuários
app.get("/usuarios", (req, res) => {
  const usersWithoutPasswords = users.map(({ password, ...user }) => user)
  res.json(usersWithoutPasswords)
})

// Rota para deletar usuário
app.delete("/usuarios/:id", (req, res) => {
  const id = Number.parseInt(req.params.id)
  const userIndex = users.findIndex((user) => user.id === id)

  if (userIndex === -1) {
    return res.status(404).json({ message: "Usuário não encontrado" })
  }

  users.splice(userIndex, 1)
  res.json({ message: "Usuário deletado com sucesso" })
})

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
