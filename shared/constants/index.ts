// Currency pairs supported across the platform
export const SUPPORTED_PAIRS = [
  'AUD/USD', 'AUD/EUR', 'AUD/GBP', 'AUD/JPY', 'AUD/NZD',
] as const

export type SupportedPair = typeof SUPPORTED_PAIRS[number]

// Default user preferences applied on first login
export const DEFAULT_CURRENCIES = ['AUD', 'USD', 'EUR'] as const
export const DEFAULT_TOPICS     = ['market-updates', 'policy-changes'] as const
export const DEFAULT_INTERESTS  = ['hedging', 'forwards'] as const

// Poll storage key (localStorage)
export const POLL_VOTE_KEY = 'insights-poll-vote'
export const POLL_ID       = 'insights-weekly-poll'

// API response codes
export const HTTP = {
  OK:           200,
  CREATED:      201,
  BAD_REQUEST:  400,
  UNAUTHORIZED: 401,
  FORBIDDEN:    403,
  NOT_FOUND:    404,
  SERVER_ERROR: 500,
} as const

// Airtable source labels
export const LEAD_SOURCES = {
  HEDGE_PIECE:     'Hedge Piece Signup',
  NEWSLETTER:      'Newsletter Signup',
  DASHBOARD:       'Dashboard Access Request',
  MARKET_INSIGHTS: 'Market Insights Request',
  HEDGE_REQUEST:   'Hedge Piece Request',
} as const
