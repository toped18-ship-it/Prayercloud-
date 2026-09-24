
import React from 'react';
import { useAuth } from '../../lib/AuthContext';
import { Permission } from '../../types/auth';
import { UserRole } from '../../types';

interface PermissionGateProps {
  children: React.ReactNode;
  permission?: Permission;
  roles?: UserRole[];
  fallback?: React.ReactNode;
  key?: React.Key;
}

export function PermissionGate({ 
  children, 
  permission, 
  roles, 
  fallback = null 
}: PermissionGateProps) {
  const { hasPermission, hasRole } = useAuth();

  if (permission && hasPermission(permission)) {
    return <>{children}</>;
  }

  if (roles && hasRole(roles)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}

import { Navigate, useLocation } from 'react-router-dom';
import { DashboardSkeleton, CardsGridSkeleton, TableSkeleton, ChatSkeleton } from '../ui/SkeletonLoader';

interface RequireAuthProps {
  children: React.ReactNode;
  permission?: Permission;
  roles?: UserRole[];
  fallback?: React.ReactNode;
}

export function RequireAuth({ children, permission, roles, fallback }: RequireAuthProps) {
  const { user, isLoading, hasPermission, hasRole } = useAuth();
  const location = useLocation();

  if (isLoading) {
    if (fallback) return <>{fallback}</>;
    
    // Choose appropriate skeleton loader based on destination route
    const path = location.pathname.toLowerCase();
    if (path.includes('countries') || path.includes('missionary-hub') || path.includes('resources')) {
      return <CardsGridSkeleton />;
    }
    if (path.includes('chat')) {
      return <ChatSkeleton />;
    }
    if (path.includes('admin') || path.includes('users') || path.includes('audit')) {
      return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <TableSkeleton />
        </div>
      );
    }
    return <DashboardSkeleton />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (permission && !hasPermission(permission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (roles && !hasRole(roles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
