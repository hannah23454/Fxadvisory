import { ObjectId } from 'mongodb'
import { preferencesRepository } from '@/backend/repositories/preferences.repository'
import { DEFAULT_CURRENCIES, DEFAULT_TOPICS, DEFAULT_INTERESTS } from '@/shared/constants'
import type { UserPreferences } from '@/shared/types/models'

export const preferencesService = {
  async getOrCreate(userId: ObjectId): Promise<UserPreferences> {
    const existing = await preferencesRepository.findByUserId(userId)
    if (existing) return existing

    const defaults: Omit<UserPreferences, '_id'> = {
      userId,
      currencies:  [...DEFAULT_CURRENCIES],
      topics:      [...DEFAULT_TOPICS],
      interests:   [...DEFAULT_INTERESTS],
      feedLayout:  { liveRates: true, marketNews: true, newsletters: true, rssFeed: true, hedgingDocs: true, products: true },
      notifications: { email: true, frequency: 'daily' },
      updatedAt:   new Date(),
    }
    return preferencesRepository.create(defaults)
  },

  async update(userId: ObjectId, updates: Partial<UserPreferences>) {
    return preferencesRepository.update(userId, { ...updates, updatedAt: new Date() })
  },
}
