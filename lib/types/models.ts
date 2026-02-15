import { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  email: string;
  password: string;
  name: string;
  role: 'user' | 'admin';
  company?: string;
  position?: string;
  phone?: string;
  active: boolean;
  createdAt: Date;
  lastLogin?: Date;
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
