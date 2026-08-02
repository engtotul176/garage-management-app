export type EmployeeStatus = 'active' | 'suspended' | 'deleted';

export interface EmployeeRecord {
  id: string;
  employeeCode: string;
  tenantId: string;
  tenantName: string;
  fullName: string;
  photoUrl: string;
  phone: string;
  email: string;
  nid?: string;
  address: string;
  designation: string;
  department: string;
  roleId: string;
  roleName: string;
  username: string;
  passwordHash?: string;
  status: EmployeeStatus;
  joiningDate: string;
  lastLogin?: string;
  createdAt?: string;
  updatedAt?: string;
  isDeleted?: boolean;
  deletedAt?: string;
}

export interface RoleDefinition {
  id: string;
  roleCode: string;
  nameBangla: string;
  nameEnglish: string;
  description: string;
  tenantId: string; // 'global' or org-specific tenantId
  isSystemRole: boolean;
  permissions: string[]; // List of permission keys
  createdAt?: string;
  updatedAt?: string;
}

export interface PermissionDefinition {
  key: string;
  nameBangla: string;
  nameEnglish: string;
  category: 'core' | 'finance' | 'communication' | 'admin';
  description: string;
}

export interface EmployeeActivityLog {
  id: string;
  tenantId: string;
  employeeId: string;
  employeeName: string;
  action: string;
  details: string;
  ipAddress?: string;
  timestamp: string;
}

export interface LoginHistoryRecord {
  id: string;
  tenantId: string;
  employeeId: string;
  employeeName: string;
  roleName: string;
  loginTime: string;
  ipAddress?: string;
  deviceInfo?: string;
  status: 'success' | 'failed';
}
