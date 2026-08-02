import { UserRole } from '../../types/saas';

export interface AuthValidationResult {
  isAuthenticated: boolean;
  isTenantValid: boolean;
  isSubscriptionActive: boolean;
  redirectPath?: string;
}

export class AuthMiddleware {
  static validateSession(
    isAuthenticated: boolean,
    role: UserRole,
    tenantStatus: 'active' | 'trial' | 'expired' | 'suspended'
  ): AuthValidationResult {
    if (!isAuthenticated) {
      return { isAuthenticated: false, isTenantValid: false, isSubscriptionActive: false, redirectPath: '/login' };
    }

    if (role === 'super_admin') {
      return { isAuthenticated: true, isTenantValid: true, isSubscriptionActive: true };
    }

    if (tenantStatus === 'suspended') {
      return { isAuthenticated: true, isTenantValid: false, isSubscriptionActive: false, redirectPath: '/tenant-suspended' };
    }

    if (tenantStatus === 'expired') {
      return { isAuthenticated: true, isTenantValid: true, isSubscriptionActive: false, redirectPath: '/subscription-expired' };
    }

    return { isAuthenticated: true, isTenantValid: true, isSubscriptionActive: true };
  }
}
