import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  email: string;
  password: string;
  name: string;
  role: 'user' | 'admin';
  // Personal
  phone?: string;
  position?: string;
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced' | 'professional';
  areasOfInterest?: string[];
  // Business
  company?: string;
  industry?: string;
  businessContact?: string;
  businessPreferences?: string;
  active: boolean;
  createdAt: Date;
  lastLogin?: Date;
  updatedAt?: Date;
}

export type RiskBand = 'Very Conservative' | 'Conservative' | 'Balanced' | 'Growth' | 'Aggressive';

export interface RiskProfile {
  _id?: ObjectId;
  userId: ObjectId;
  capacityAnswers: number[];   // 4 answers, 1–5
  willingnessAnswers: number[]; // 4 answers, 1–5
  capacityScore: number;
  willingnessScore: number;
  band: RiskBand;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreferences {
  _id?: ObjectId;
  userId: ObjectId;
  currencies: string[];
  topics: string[];
  interests: string[];
  feedLayout: {
    liveRates: boolean;
    marketNews: boolean;
    newsletters: boolean;
    rssFeed: boolean;
    hedgingDocs: boolean;
    products: boolean;
  };
  notifications: {
    email: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
  };
  updatedAt: Date;
}

export interface MarketContent {
  _id?: ObjectId;
  title: string;
  content: string;
  type: 'commentary' | 'newsletter' | 'policy' | 'product';
  visibility: 'public' | 'members-only';
  author: string;
  publishedAt: Date;
  updatedAt: Date;
  tags: string[];
  currencies: string[];
  attachments?: {
    name: string;
    url: string;
    type: string;
  }[];
}

export interface TradeUpload {
  _id?: ObjectId;
  userId: ObjectId;
  fileName: string;
  fileUrl: string;
  uploadType: 'hedge' | 'competitor';
  status: 'pending' | 'processing' | 'completed' | 'error';
  bracketGroupSubmitted: boolean;
  submittedAt?: Date;
  trades: {
    currency: string;
    amount: number;
    rate: number;
    date: Date;
    type: 'forward' | 'option' | 'swap';
  }[];
  createdAt: Date;
  notes?: string;
}

export interface Analytics {
  _id?: ObjectId;
  userId: ObjectId;
  eventType: 'view' | 'download' | 'booking' | 'message';
  resourceType: 'currency' | 'article' | 'document' | 'page';
  resourceId?: string;
  metadata: Record<string, any>;
  timestamp: Date;
}

export interface BookingRequest {
  _id?: ObjectId;
  userId: ObjectId;
  type: '15min-consult' | 'pricing' | 'loom-meeting';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  requestedDate?: Date;
  confirmedDate?: Date;
  notes?: string;
  createdAt: Date;
}

export interface Message {
  _id?: ObjectId;
  fromUserId: ObjectId;
  toUserId?: ObjectId;
  fromRole: 'user' | 'admin';
  subject: string;
  content: string;
  read: boolean;
  createdAt: Date;
}

export type FxVolumeRange =
  | '<1M'
  | '1M–5M'
  | '5M–10M'
  | '10M–20M'
  | '20M–40M'
  | '40M–80M'
  | '80M–150M'
  | '150M–200M'
  | '200M+';

export type FxProviderType = 'Non-Bank' | 'Bank' | 'Both Bank & Non-Bank';

export interface HedgePolicyRequest {
  _id?: ObjectId;
  email: string;
  userId?: ObjectId;
  fxVolume: FxVolumeRange;
  fxProvider: FxProviderType;
  status: 'pending' | 'sent' | 'accessed';
  emailSent: boolean;
  accessGranted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
