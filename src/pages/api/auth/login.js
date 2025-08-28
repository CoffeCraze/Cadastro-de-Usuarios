import prisma from '../../../lib/prisma'
import { comparePasswords, generateToken } from '../../../lib/auth'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' })
  }

  const { email, password } = req.body

  try {
    // 1. Busca usuário
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas' })
    }

    // 2. Verifica senha
    const isValid = await comparePasswords(password, user.password)
    if (!isValid) {
      return res.status(401).json({ message: 'Credenciais inválidas' })
    }

    // 3. Gera token
    const token = generateToken(user.id)

    // 4. Retorna resposta
    res.status(200).json({
      token,
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