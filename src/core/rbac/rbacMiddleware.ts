import { UserRole } from '../../types/saas';

export type Permission = 
  | 'manage_all_tenants'
  | 'manage_tenant_settings'
  | 'manage_members'
  | 'collect_daily_payments'
  | 'view_reports'
  | 'manage_employees'
  | 'view_member_profile'
  | 'manage_gateways';

const PERMISSION_MATRIX: Record<UserRole, Permission[]> = {
  super_admin: [
    'manage_all_tenants',
    'manage_tenant_settings',
    'manage_members',
    'collect_daily_payments',
    'view_reports',
    'manage_employees',
    'view_member_profile',
    'manage_gateways'
  ],
  org_admin: [
    'manage_tenant_settings',
    'manage_members',
    'collect_daily_payments',
    'view_reports',
    'manage_employees',
    'view_member_profile'
  ],
  manager: [
    'manage_members',
    'collect_daily_payments',
    'view_reports',
    'view_member_profile'
  ],
  employee: [
    'collect_daily_payments',
    'view_member_profile'
  ],
  member: [
    'view_member_profile'
  ],
  guest: []
};

export class RBACMiddleware {
  static hasPermission(role: UserRole, permission: Permission): boolean {
    const permissions = PERMISSION_MATRIX[role] || [];
    return permissions.includes(permission);
  }

  static getPermissionsForRole(role: UserRole): Permission[] {
    return PERMISSION_MATRIX[role] || [];
  }
}
