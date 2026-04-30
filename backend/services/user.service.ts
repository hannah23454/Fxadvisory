import bcrypt from 'bcryptjs'
import { ObjectId } from 'mongodb'
import { userRepository } from '@/backend/repositories/user.repository'
import type { User } from '@/shared/types/models'

export const userService = {
  async createUser(data: Pick<User, 'name' | 'email' | 'password' | 'company'>) {
    const existing = await userRepository.findByEmail(data.email)
    if (existing) throw new Error('Email already registered')
    const hashed = await bcrypt.hash(data.password, 12)
    return userRepository.create({ ...data, password: hashed, role: 'user', active: true, createdAt: new Date() })
  },

  async verifyCredentials(email: string, password: string) {
    const user = await userRepository.findByEmail(email)
    if (!user) return null
    const valid = await bcrypt.compare(password, user.password)
    return valid ? user : null
  },

  async getUserById(id: string) {
    return userRepository.findById(new ObjectId(id))
  },

  async updateLastLogin(id: string) {
    return userRepository.update(new ObjectId(id), { lastLogin: new Date() })
  },
}
