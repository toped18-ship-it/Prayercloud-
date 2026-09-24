
export type SettingValue = string | number | boolean | null;

export interface SiteSettings {
  appName: string;
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  typography: string;
  darkMode: boolean;
  footerText: string;
  contactEmail: string;
  socialLinks: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  seo: {
    titleTemplate: string;
    description: string;
    keywords: string[];
  };
}

export interface HomepageSection {
  id: string;
  type: 'hero' | 'about' | 'featured' | 'stats' | 'testimonials' | 'prayer' | 'newsletter' | 'footer';
  title: string;
  subtitle?: string;
  content: string;
  order: number;
  isActive: boolean;
}

export interface SMTPConfig {
  host: string;
  port: number;
  username: string;
  encryption: 'tls' | 'ssl' | 'none';
  senderName: string;
  senderEmail: string;
}

export interface APIIntegration {
  id: string;
  name: string;
  provider: 'cloudinary' | 'firebase' | 'twilio' | 'joshua-project';
  apiKey: string;
  status: 'active' | 'inactive';
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  module: string;
  details: string;
  timestamp: string;
  ipAddress: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}
