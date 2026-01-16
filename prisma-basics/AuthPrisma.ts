import { prisma } from "./lib/prisma"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import "dotenv/config"
import { SignupInput, SigninInput } from "./schemas/auth-schema"

const JWT_SECRET = process.env.JWT_SECRET!

export async function signup(data: SignupInput) {
  const hashedPassword = await bcrypt.hash(data.password, 10)

  const user = await prisma.authUser.create({
    data: {
      email: data.email,
      password: hashedPassword,
      name: data.name,
    },
  })

  return user
}

export async function signin(data: SigninInput) {
  const user = await prisma.authUser.findUnique({
    where: { email: data.email },
  })

  if (!user) throw new Error("User not found")

  const ok = await bcrypt.compare(data.password, user.password)
  if (!ok) throw new Error("Wrong password")

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: "7d" }
  )

  return { user, token }
}
