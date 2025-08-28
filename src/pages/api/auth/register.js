import prisma from '../../../lib/prisma'
import { hashPassword } from '../../../lib/auth'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' })
  }

  const { email, password, name } = req.body

  try {
    // 1. Verifica se usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return res.status(400).json({ message: 'Email já cadastrado' })
    }

    // 2. Criptografa senha
    const hashedPassword = await hashPassword(password)

    // 3. Cria usuário
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    })

    // 4. Retorna resposta (sem senha)
    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    })
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor' })
  }
}