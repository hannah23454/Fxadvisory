import { ObjectId } from 'mongodb'
import { getDatabase } from '@/lib/db/mongodb'
import type { User } from '@/shared/types/models'

const col = async () => (await getDatabase()).collection<User>('users')

export const userRepository = {
  async findByEmail(email: string) {
    return (await col()).findOne({ email })
  },

  async findById(id: ObjectId) {
    return (await col()).findOne({ _id: id })
  },

  async create(data: Omit<User, '_id'>) {
    const result = await (await col()).insertOne(data as User)
    return { ...data, _id: result.insertedId }
  },

  async update(id: ObjectId, updates: Partial<User>) {
    return (await col()).updateOne({ _id: id }, { $set: updates })
  },

  async findAll() {
    return (await col()).find({}).toArray()
  },

  async deleteById(id: ObjectId) {
    return (await col()).deleteOne({ _id: id })
  },
}
