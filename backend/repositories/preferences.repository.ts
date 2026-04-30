import { ObjectId } from 'mongodb'
import { getDatabase } from '@/lib/db/mongodb'
import type { UserPreferences } from '@/shared/types/models'

const col = async () => (await getDatabase()).collection<UserPreferences>('preferences')

export const preferencesRepository = {
  async findByUserId(userId: ObjectId) {
    return (await col()).findOne({ userId })
  },

  async create(data: Omit<UserPreferences, '_id'>) {
    const result = await (await col()).insertOne(data as UserPreferences)
    return { ...data, _id: result.insertedId }
  },

  async update(userId: ObjectId, updates: Partial<UserPreferences>) {
    return (await col()).updateOne({ userId }, { $set: updates })
  },
}
