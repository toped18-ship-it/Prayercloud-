
import { UserRole } from './index';

export type Permission = 
  | 'view_dashboard'
  | 'view_countries'
  | 'manage_countries'
  | 'view_missionary_hub'
  | 'submit_reports'
  | 'view_reports'
  | 'manage_users'
  | 'access_admin_panel'
  | 'post_prayer_requests'
  | 'moderate_requests';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  'Super Admin': [
    'view_dashboard', 'view_countries', 'manage_countries', 
    'view_missionary_hub', 'submit_reports', 'view_reports', 
    'manage_users', 'access_admin_panel', 'post_prayer_requests', 'moderate_requests'
  ],
  'Admin': [
    'view_dashboard', 'view_countries', 'manage_countries', 
    'view_missionary_hub', 'submit_reports', 'view_reports', 
    'manage_users', 'access_admin_panel', 'post_prayer_requests', 'moderate_requests'
  ],
  'Missionary': [
    'view_dashboard', 'view_countries', 'view_missionary_hub', 
    'submit_reports', 'view_reports', 'post_prayer_requests'
  ],
  'Pastor': [
    'view_dashboard', 'view_countries', 'view_reports', 
    'post_prayer_requests'
  ],
  'Evangelist': [
    'view_dashboard', 'view_countries', 'post_prayer_requests'
  ],
  'Prayer Warrior': [
    'view_dashboard', 'view_countries', 'post_prayer_requests'
  ],
  'Intercessor': [
    'view_dashboard', 'view_countries', 'post_prayer_requests'
  ]
};
