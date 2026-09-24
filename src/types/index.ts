export interface Country {
  id: string;
  name: string;
  flag: string;
  population: number;
  religion: string;
  christianPercentage: number;
  unreachedPercentage: number;
  unreachedGroupsCount: number;
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Extreme';
  prayerPoints: string[];
  historicalContext?: string;
}

export interface UPG {
  id: string;
  countryId: string;
  name: string;
  population: number;
  language: string;
  religion: string;
  status: 'Unreached' | 'Reached' | 'Partially Reached';
}

export type UserRole = 'Super Admin' | 'Admin' | 'Missionary' | 'Pastor' | 'Evangelist' | 'Prayer Warrior' | 'Intercessor';

export interface User {
  uid: string;
  fullName: string;
  username: string;
  email: string;
  role: UserRole;
  country: string;
}

export interface PrayerRequest {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  category: string;
  urgency: 'Low' | 'Normal' | 'High' | 'Urgent';
  prayedCount: number;
  createdAt: string;
}
