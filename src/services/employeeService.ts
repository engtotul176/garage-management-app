import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  limit, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import { 
  EmployeeRecord, 
  RoleDefinition, 
  EmployeeActivityLog, 
  LoginHistoryRecord, 
  EmployeeStatus 
} from '../types/employee';
import { DEFAULT_SYSTEM_ROLES } from '../data/defaultRoles';

const EMPLOYEES_COLLECTION = 'employees';
const ROLES_COLLECTION = 'roles';
const ACTIVITY_COLLECTION = 'employee_activity';
const LOGIN_HISTORY_COLLECTION = 'login_history';

// Mock Employees initial fallback data for clean experience if Firestore is empty
const INITIAL_MOCK_EMPLOYEES: EmployeeRecord[] = [
  {
    id: 'emp_101',
    employeeCode: 'EMP-2026-001',
    tenantId: 'org_bismillah_001',
    tenantName: 'বিসমিল্লাহ অটো চার্জিং গ্যারেজ',
    fullName: 'মোঃ রফিকুল ইসলাম',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    phone: '01711223344',
    email: 'rafiq@bismillah.com',
    nid: '19882691234567891',
    address: 'মিরপুর-১০, ঢাকা',
    designation: 'সিনিয়র ম্যানেজার',
    department: 'অপারেশনস',
    roleId: 'manager',
    roleName: 'ম্যানেজার (Manager)',
    username: 'rafiq_mgr',
    passwordHash: '••••••••',
    status: 'active',
    joiningDate: '2024-01-15',
    lastLogin: '2026-07-30 09:30 AM',
    createdAt: '2024-01-15T00:00:00Z',
    isDeleted: false
  },
  {
    id: 'emp_102',
    employeeCode: 'EMP-2026-002',
    tenantId: 'org_bismillah_001',
    tenantName: 'বিসমিল্লাহ অটো চার্জিং গ্যারেজ',
    fullName: 'মোঃ জসিম উদ্দিন',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    phone: '01819887766',
    email: 'jasim@bismillah.com',
    nid: '19922691234567112',
    address: 'কল্যাণপুর, ঢাকা',
    designation: 'ক্যাশ কালেকটর',
    department: 'ফাইন্যান্স',
    roleId: 'cash_collector',
    roleName: 'ক্যাশ কালেক্টর (Cash Collector)',
    username: 'jasim_collector',
    passwordHash: '••••••••',
    status: 'active',
    joiningDate: '2024-03-01',
    lastLogin: '2026-07-30 11:15 AM',
    createdAt: '2024-03-01T00:00:00Z',
    isDeleted: false
  },
  {
    id: 'emp_103',
    employeeCode: 'EMP-2026-003',
    tenantId: 'org_bismillah_001',
    tenantName: 'বিসমিল্লাহ অটো চার্জিং গ্যারেজ',
    fullName: 'মোসাম্মাৎ পারভীন আক্তার',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    phone: '01912334455',
    email: 'parveen@bismillah.com',
    nid: '19952691234567223',
    address: 'শেওড়াপাড়া, ঢাকা',
    designation: 'হিসাব রক্ষক',
    department: 'একাউন্টস',
    roleId: 'accountant',
    roleName: 'একাউন্ট্যান্ট (Accountant)',
    username: 'parveen_acc',
    passwordHash: '••••••••',
    status: 'suspended',
    joiningDate: '2024-06-10',
    lastLogin: '2026-07-20 02:45 PM',
    createdAt: '2024-06-10T00:00:00Z',
    isDeleted: false
  }
];

export class EmployeeService {

  // ----------------------------------------------------
  // 1. REALTIME EMPLOYEES LISTENER
  // ----------------------------------------------------

  /**
   * Realtime Listener for Employees
   */
  static subscribeEmployees(
    tenantId: string = 'org_bismillah_001',
    onSuccess: (employees: EmployeeRecord[]) => void,
    onError?: (err: Error) => void
  ): () => void {
    try {
      const colRef = collection(db, EMPLOYEES_COLLECTION);
      
      return onSnapshot(colRef, (snapshot) => {
        if (!snapshot.empty) {
          const docs = snapshot.docs
            .map(d => ({ id: d.id, ...d.data() } as EmployeeRecord))
            .filter(emp => !emp.isDeleted && (tenantId === 'all' || emp.tenantId === tenantId));
          
          if (docs.length > 0) {
            onSuccess(docs);
          } else {
            // Seed initial mock employees if empty
            this.seedInitialEmployees(tenantId).then(() => {
              onSuccess(INITIAL_MOCK_EMPLOYEES.filter(e => tenantId === 'all' || e.tenantId === tenantId));
            });
          }
        } else {
          // Seed mock employees
          this.seedInitialEmployees(tenantId).then(() => {
            onSuccess(INITIAL_MOCK_EMPLOYEES.filter(e => tenantId === 'all' || e.tenantId === tenantId));
          });
        }
      }, (err) => {
        console.warn('Employees listener warning, using fallback:', err);
        if (onError) onError(err);
        onSuccess(INITIAL_MOCK_EMPLOYEES.filter(e => tenantId === 'all' || e.tenantId === tenantId));
      });

    } catch (e) {
      console.warn('Employees subscription exception:', e);
      onSuccess(INITIAL_MOCK_EMPLOYEES.filter(e => tenantId === 'all' || e.tenantId === tenantId));
      return () => {};
    }
  }

  /**
   * Seed Mock Employees to Firestore if empty
   */
  private static async seedInitialEmployees(tenantId: string): Promise<void> {
    try {
      for (const emp of INITIAL_MOCK_EMPLOYEES) {
        const docRef = doc(db, EMPLOYEES_COLLECTION, emp.id);
        await setDoc(docRef, { ...emp, updatedAt: new Date().toISOString() }, { merge: true });
      }
    } catch (e) {
      console.warn('Error seeding mock employees:', e);
    }
  }

  /**
   * Save or Update Employee Record
   */
  static async saveEmployee(emp: Partial<EmployeeRecord>, actorName: string = 'Org Admin'): Promise<EmployeeRecord> {
    const isNew = !emp.id;
    const empId = emp.id || `emp_${Date.now()}`;
    const code = emp.employeeCode || `EMP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const nowStr = new Date().toISOString();

    const fullRecord: EmployeeRecord = {
      id: empId,
      employeeCode: code,
      tenantId: emp.tenantId || 'org_bismillah_001',
      tenantName: emp.tenantName || 'বিসমিল্লাহ অটো চার্জিং গ্যারেজ',
      fullName: emp.fullName || 'নতুন স্টাফ',
      photoUrl: emp.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      phone: emp.phone || '',
      email: emp.email || '',
      nid: emp.nid || '',
      address: emp.address || '',
      designation: emp.designation || 'কর্মচারী',
      department: emp.department || 'সাধারণ',
      roleId: emp.roleId || 'cash_collector',
      roleName: emp.roleName || 'ক্যাশ কালেক্টর (Cash Collector)',
      username: emp.username || `emp_${Date.now().toString().slice(-4)}`,
      passwordHash: emp.passwordHash || '••••••••',
      status: (emp.status as EmployeeStatus) || 'active',
      joiningDate: emp.joiningDate || new Date().toISOString().split('T')[0],
      lastLogin: emp.lastLogin || 'কখনও লগইন হয়নি',
      createdAt: emp.createdAt || nowStr,
      updatedAt: nowStr,
      isDeleted: false
    };

    try {
      const docRef = doc(db, EMPLOYEES_COLLECTION, empId);
      await setDoc(docRef, fullRecord, { merge: true });

      // Audit Log
      await this.logActivity(
        fullRecord.tenantId,
        fullRecord.id,
        fullRecord.fullName,
        isNew ? 'Employee Created' : 'Employee Details Updated',
        `কর্মচারী ${fullRecord.fullName} (${fullRecord.employeeCode}) এর প্রোফাইল ${actorName} কর্তৃক ${isNew ? 'তৈরি' : 'আপডেট'} করা হয়েছে।`
      );

    } catch (e) {
      console.warn('Error saving employee to Firestore:', e);
    }

    return fullRecord;
  }

  /**
   * Suspend or Activate Employee Status
   */
  static async toggleEmployeeStatus(
    empId: string, 
    currentStatus: EmployeeStatus, 
    tenantId: string,
    fullName: string,
    actorName: string = 'Org Admin'
  ): Promise<EmployeeStatus> {
    const newStatus: EmployeeStatus = currentStatus === 'active' ? 'suspended' : 'active';
    try {
      const docRef = doc(db, EMPLOYEES_COLLECTION, empId);
      await updateDoc(docRef, {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });

      // Audit log
      await this.logActivity(
        tenantId,
        empId,
        fullName,
        newStatus === 'suspended' ? 'Employee Suspended' : 'Employee Activated',
        `কর্মচারী ${fullName} এর স্ট্যাটাস ${newStatus === 'suspended' ? 'সাসপেন্ড' : 'একটিভ'} করা হয়েছে (${actorName} দ্বারা)।`
      );

    } catch (e) {
      console.warn(`Error toggling employee status for ${empId}:`, e);
    }

    return newStatus;
  }

  /**
   * Soft Delete Employee Record
   */
  static async softDeleteEmployee(
    empId: string, 
    tenantId: string,
    fullName: string,
    actorName: string = 'Org Admin'
  ): Promise<void> {
    try {
      const docRef = doc(db, EMPLOYEES_COLLECTION, empId);
      await updateDoc(docRef, {
        isDeleted: true,
        status: 'deleted',
        deletedAt: new Date().toISOString()
      });

      await this.logActivity(
        tenantId,
        empId,
        fullName,
        'Employee Soft Deleted',
        `কর্মচারী ${fullName} কে ${actorName} দ্বারা সিস্টেমে সফট ডিলিট করা হয়েছে।`
      );

    } catch (e) {
      console.warn(`Error soft deleting employee ${empId}:`, e);
    }
  }

  // ----------------------------------------------------
  // 2. ROLES & PERMISSIONS MANAGEMENT
  // ----------------------------------------------------

  /**
   * Realtime Listener for Roles (Combines default roles + Firestore custom roles)
   */
  static subscribeRoles(
    tenantId: string = 'org_bismillah_001',
    onSuccess: (roles: RoleDefinition[]) => void,
    onError?: (err: Error) => void
  ): () => void {
    try {
      const colRef = collection(db, ROLES_COLLECTION);
      return onSnapshot(colRef, (snapshot) => {
        let customRoles: RoleDefinition[] = [];
        if (!snapshot.empty) {
          customRoles = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as RoleDefinition));
        }

        // Merge default system roles and tenant custom roles
        const allRoles = [...DEFAULT_SYSTEM_ROLES, ...customRoles];
        onSuccess(allRoles);
      }, (err) => {
        console.warn('Roles listener warning, returning system default roles:', err);
        if (onError) onError(err);
        onSuccess(DEFAULT_SYSTEM_ROLES);
      });
    } catch (e) {
      console.warn('Roles subscription exception:', e);
      onSuccess(DEFAULT_SYSTEM_ROLES);
      return () => {};
    }
  }

  /**
   * Save or Update Custom Role
   */
  static async saveRole(role: RoleDefinition, actorName: string = 'Org Admin'): Promise<void> {
    try {
      const roleId = role.id || `role_custom_${Date.now()}`;
      const docRef = doc(db, ROLES_COLLECTION, roleId);
      await setDoc(docRef, {
        ...role,
        id: roleId,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      await this.logActivity(
        role.tenantId,
        'role_system',
        role.nameBangla,
        'Role Permissions Saved',
        `রোল "${role.nameBangla}" এর পারমিশন সেটিং ${actorName} দ্বারা আপডেট করা হয়েছে।`
      );

    } catch (e) {
      console.warn('Error saving custom role to Firestore:', e);
    }
  }

  /**
   * Delete Custom Role
   */
  static async deleteRole(roleId: string, roleName: string, tenantId: string, actorName: string = 'Org Admin'): Promise<void> {
    try {
      const docRef = doc(db, ROLES_COLLECTION, roleId);
      await deleteDoc(docRef);

      await this.logActivity(
        tenantId,
        'role_system',
        roleName,
        'Role Deleted',
        `কাস্টম রোল "${roleName}" কে ${actorName} দ্বারা ডিলিট করা হয়েছে।`
      );
    } catch (e) {
      console.warn(`Error deleting custom role ${roleId}:`, e);
    }
  }

  // ----------------------------------------------------
  // 3. AUDIT LOG & LOGIN HISTORY
  // ----------------------------------------------------

  /**
   * Log Activity to employee_activity Collection
   */
  static async logActivity(
    tenantId: string, 
    employeeId: string, 
    employeeName: string, 
    action: string, 
    details: string
  ): Promise<void> {
    try {
      const actId = `act_${Date.now()}_${Math.floor(Math.random()*1000)}`;
      const logDoc: EmployeeActivityLog = {
        id: actId,
        tenantId,
        employeeId,
        employeeName,
        action,
        details,
        ipAddress: '103.112.227.14',
        timestamp: new Date().toISOString()
      };

      await setDoc(doc(db, ACTIVITY_COLLECTION, actId), logDoc);
    } catch (e) {
      console.warn('Error writing audit activity log:', e);
    }
  }

  /**
   * Record Login History Event
   */
  static async recordLogin(
    tenantId: string,
    employeeId: string,
    employeeName: string,
    roleName: string,
    status: 'success' | 'failed' = 'success'
  ): Promise<void> {
    try {
      const loginId = `log_${Date.now()}`;
      const record: LoginHistoryRecord = {
        id: loginId,
        tenantId,
        employeeId,
        employeeName,
        roleName,
        loginTime: new Date().toISOString(),
        ipAddress: '103.112.227.14',
        deviceInfo: 'Chrome / Windows 11 (Desktop)',
        status
      };

      await setDoc(doc(db, LOGIN_HISTORY_COLLECTION, loginId), record);
    } catch (e) {
      console.warn('Error recording login history:', e);
    }
  }

  /**
   * Realtime Listener for Audit Activity Logs
   */
  static subscribeActivityLogs(
    tenantId: string = 'org_bismillah_001',
    onSuccess: (logs: EmployeeActivityLog[]) => void
  ): () => void {
    try {
      const colRef = collection(db, ACTIVITY_COLLECTION);
      return onSnapshot(colRef, (snapshot) => {
        if (!snapshot.empty) {
          const logs = snapshot.docs
            .map(d => ({ id: d.id, ...d.data() } as EmployeeActivityLog))
            .filter(l => tenantId === 'all' || l.tenantId === tenantId)
            .sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          onSuccess(logs);
        } else {
          // Fallback mock logs
          const mockLogs: EmployeeActivityLog[] = [
            {
              id: 'act_101',
              tenantId,
              employeeId: 'emp_101',
              employeeName: 'মোঃ রফিকুল ইসলাম',
              action: 'Employee Created',
              details: 'নতুন কর্মচারীর প্রোফাইল তৈরি ও ক্যাশ কালেকটর রোল প্রদান',
              timestamp: '2026-07-30T10:15:00Z'
            },
            {
              id: 'act_102',
              tenantId,
              employeeId: 'emp_103',
              employeeName: 'মোসাম্মাৎ পারভীন আক্তার',
              action: 'Employee Suspended',
              details: 'সাময়িকভাবে ইউজার একাউন্ট স্থগিত করা হয়েছে',
              timestamp: '2026-07-29T14:20:00Z'
            }
          ];
          onSuccess(mockLogs);
        }
      }, (err) => {
        console.warn('Activity log listener error:', err);
      });
    } catch (e) {
      console.warn('Activity log subscription failed:', e);
      return () => {};
    }
  }

  /**
   * Realtime Listener for Login History
   */
  static subscribeLoginHistory(
    tenantId: string = 'org_bismillah_001',
    onSuccess: (history: LoginHistoryRecord[]) => void
  ): () => void {
    try {
      const colRef = collection(db, LOGIN_HISTORY_COLLECTION);
      return onSnapshot(colRef, (snapshot) => {
        if (!snapshot.empty) {
          const list = snapshot.docs
            .map(d => ({ id: d.id, ...d.data() } as LoginHistoryRecord))
            .filter(h => tenantId === 'all' || h.tenantId === tenantId)
            .sort((a,b) => new Date(b.loginTime).getTime() - new Date(a.loginTime).getTime());
          onSuccess(list);
        } else {
          // Mock login history
          const mockHistory: LoginHistoryRecord[] = [
            {
              id: 'log_1',
              tenantId,
              employeeId: 'emp_101',
              employeeName: 'মোঃ রফিকুল ইসলাম',
              roleName: 'ম্যানেজার (Manager)',
              loginTime: '2026-07-30T09:30:00Z',
              ipAddress: '103.112.227.14',
              deviceInfo: 'Chrome / Windows 11',
              status: 'success'
            },
            {
              id: 'log_2',
              tenantId,
              employeeId: 'emp_102',
              employeeName: 'মোঃ জসিম উদ্দিন',
              roleName: 'ক্যাশ কালেক্টর (Cash Collector)',
              loginTime: '2026-07-30T11:15:00Z',
              ipAddress: '103.112.227.18',
              deviceInfo: 'Mobile Chrome / Android 14',
              status: 'success'
            }
          ];
          onSuccess(mockHistory);
        }
      }, (err) => {
        console.warn('Login history listener error:', err);
      });
    } catch (e) {
      console.warn('Login history subscription failed:', e);
      return () => {};
    }
  }
}
