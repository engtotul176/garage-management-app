import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  ShieldCheck, 
  Sliders, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Ban, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Lock, 
  Key, 
  FileText, 
  History, 
  Smartphone, 
  Mail, 
  MapPin, 
  Briefcase, 
  Building2, 
  Calendar, 
  X, 
  Check, 
  Upload, 
  ShieldAlert, 
  Plus, 
  ChevronRight, 
  UserCheck, 
  Clock, 
  RefreshCw,
  Sparkles,
  Info
} from 'lucide-react';
import { 
  EmployeeRecord, 
  RoleDefinition, 
  EmployeeActivityLog, 
  LoginHistoryRecord, 
  EmployeeStatus 
} from '../../types/employee';
import { EmployeeService } from '../../services/employeeService';
import { ALL_EMPLOYEE_PERMISSIONS, DEFAULT_SYSTEM_ROLES } from '../../data/defaultRoles';

export const EmployeeRoleManagementSystem: React.FC = () => {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'employees' | 'roles' | 'security_test' | 'audit_logs'>('employees');

  // Data States
  const [employees, setEmployees] = useState<EmployeeRecord[]>([]);
  const [roles, setRoles] = useState<RoleDefinition[]>(DEFAULT_SYSTEM_ROLES);
  const [activityLogs, setActivityLogs] = useState<EmployeeActivityLog[]>([]);
  const [loginHistory, setLoginHistory] = useState<LoginHistoryRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');

  // Modals & Drawers
  const [isEmpModalOpen, setIsEmpModalOpen] = useState<boolean>(false);
  const [editingEmployee, setEditingEmployee] = useState<EmployeeRecord | null>(null);
  const [selectedProfileEmployee, setSelectedProfileEmployee] = useState<EmployeeRecord | null>(null);

  const [isRoleModalOpen, setIsRoleModalOpen] = useState<boolean>(false);
  const [editingRole, setEditingRole] = useState<RoleDefinition | null>(null);

  // Security Simulator Test State
  const [simulatedRole, setSimulatedRole] = useState<string>('cash_collector');

  // Form State for Employee
  const [empForm, setEmpForm] = useState<Partial<EmployeeRecord>>({
    fullName: '',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    phone: '',
    email: '',
    nid: '',
    address: '',
    designation: 'কর্মচারী',
    department: 'অপারেশনস',
    roleId: 'cash_collector',
    roleName: 'ক্যাশ কালেক্টর (Cash Collector)',
    username: '',
    passwordHash: '12345678',
    status: 'active',
    joiningDate: new Date().toISOString().split('T')[0]
  });

  // Form State for Custom Role
  const [roleForm, setRoleForm] = useState<Partial<RoleDefinition>>({
    roleCode: '',
    nameBangla: '',
    nameEnglish: '',
    description: '',
    permissions: ['dashboard', 'daily_collection', 'receipt']
  });

  // ----------------------------------------------------
  // REALTIME FIRESTORE SUBSCRIPTIONS
  // ----------------------------------------------------
  useEffect(() => {
    setLoading(true);

    // 1. Subscribe Employees
    const unsubEmp = EmployeeService.subscribeEmployees('org_bismillah_001', (data) => {
      setEmployees(data);
      setLoading(false);
    });

    // 2. Subscribe Roles
    const unsubRoles = EmployeeService.subscribeRoles('org_bismillah_001', (data) => {
      setRoles(data);
    });

    // 3. Subscribe Audit Logs
    const unsubLogs = EmployeeService.subscribeActivityLogs('org_bismillah_001', (data) => {
      setActivityLogs(data);
    });

    // 4. Subscribe Login History
    const unsubLogin = EmployeeService.subscribeLoginHistory('org_bismillah_001', (data) => {
      setLoginHistory(data);
    });

    return () => {
      unsubEmp();
      unsubRoles();
      unsubLogs();
      unsubLogin();
    };
  }, []);

  // ----------------------------------------------------
  // HANDLERS: EMPLOYEE CRUD
  // ----------------------------------------------------

  const handleOpenCreateEmp = () => {
    setEditingEmployee(null);
    const autoCode = `EMP-2026-${Math.floor(100 + Math.random() * 900)}`;
    setEmpForm({
      employeeCode: autoCode,
      fullName: '',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      phone: '',
      email: '',
      nid: '',
      address: '',
      designation: 'কর্মচারী',
      department: 'অপারেশনস',
      roleId: roles[2]?.id || 'cash_collector',
      roleName: roles[2]?.nameBangla || 'ক্যাশ কালেক্টর (Cash Collector)',
      username: `emp_${Math.floor(1000 + Math.random() * 9000)}`,
      passwordHash: '12345678',
      status: 'active',
      joiningDate: new Date().toISOString().split('T')[0]
    });
    setIsEmpModalOpen(true);
  };

  const handleOpenEditEmp = (emp: EmployeeRecord) => {
    setEditingEmployee(emp);
    setEmpForm(emp);
    setIsEmpModalOpen(true);
  };

  const handleSaveEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!empForm.fullName || !empForm.phone) {
      alert('এমপ্লয়ির নাম এবং মোবাইল নম্বর প্রদান আবশ্যক!');
      return;
    }

    const matchedRole = roles.find(r => r.id === empForm.roleId);

    const recordToSave: Partial<EmployeeRecord> = {
      ...empForm,
      roleName: matchedRole ? matchedRole.nameBangla : empForm.roleName
    };

    if (editingEmployee) {
      recordToSave.id = editingEmployee.id;
    }

    await EmployeeService.saveEmployee(recordToSave, 'অর্গানাইজেশন এডমিন');
    setIsEmpModalOpen(false);
  };

  const handleToggleStatus = async (emp: EmployeeRecord) => {
    const actionText = emp.status === 'active' ? 'সাসপেন্ড' : 'একটিভ';
    if (window.confirm(`আপনি কি নিশ্চিতভাবে "${emp.fullName}" কে ${actionText} করতে চান?`)) {
      await EmployeeService.toggleEmployeeStatus(
        emp.id, 
        emp.status, 
        emp.tenantId, 
        emp.fullName, 
        'অর্গানাইজেশন এডমিন'
      );
    }
  };

  const handleSoftDelete = async (emp: EmployeeRecord) => {
    if (window.confirm(`আপনি কি নিশ্চিতভাবে "${emp.fullName}" এর অ্যাকাউন্ট সফট-ডিলিট করতে চান?`)) {
      await EmployeeService.softDeleteEmployee(
        emp.id, 
        emp.tenantId, 
        emp.fullName, 
        'অর্গানাইজেশন এডমিন'
      );
    }
  };

  // ----------------------------------------------------
  // HANDLERS: ROLE & PERMISSION MATRIX
  // ----------------------------------------------------

  const handleOpenCreateRole = () => {
    setEditingRole(null);
    setRoleForm({
      roleCode: `ROLE-CUST-${Math.floor(10 + Math.random() * 90)}`,
      nameBangla: '',
      nameEnglish: '',
      description: '',
      permissions: ['dashboard', 'daily_collection', 'receipt']
    });
    setIsRoleModalOpen(true);
  };

  const handleOpenEditRole = (role: RoleDefinition) => {
    setEditingRole(role);
    setRoleForm(role);
    setIsRoleModalOpen(true);
  };

  const handleTogglePermissionForRoleInMatrix = async (role: RoleDefinition, permKey: string) => {
    const isEnabled = role.permissions.includes(permKey);
    const updatedPerms = isEnabled 
      ? role.permissions.filter(p => p !== permKey)
      : [...role.permissions, permKey];

    const updatedRole: RoleDefinition = {
      ...role,
      permissions: updatedPerms
    };

    await EmployeeService.saveRole(updatedRole, 'অর্গানাইজেশন এডমিন');
  };

  const handleSaveRoleForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleForm.nameBangla || !roleForm.roleCode) {
      alert('রোলের নাম ও রোল কোড পূরণ করুন!');
      return;
    }

    const roleToSave: RoleDefinition = {
      id: editingRole ? editingRole.id : `role_cust_${Date.now()}`,
      roleCode: roleForm.roleCode!,
      nameBangla: roleForm.nameBangla!,
      nameEnglish: roleForm.nameEnglish || roleForm.nameBangla!,
      description: roleForm.description || '',
      tenantId: 'org_bismillah_001',
      isSystemRole: editingRole ? editingRole.isSystemRole : false,
      permissions: roleForm.permissions || ['dashboard']
    };

    await EmployeeService.saveRole(roleToSave, 'অর্গানাইজেশন এডমিন');
    setIsRoleModalOpen(false);
  };

  const handleDeleteRole = async (role: RoleDefinition) => {
    if (role.isSystemRole) {
      alert('সিস্টেম ডিফল্ট রোল ডিলিট করা সম্ভব নয়!');
      return;
    }
    if (window.confirm(`আপনি কি কাস্টম রোল "${role.nameBangla}" ডিলিট করতে চান?`)) {
      await EmployeeService.deleteRole(role.id, role.nameBangla, role.tenantId, 'অর্গানাইজেশন এডমিন');
    }
  };

  const togglePermissionInRoleForm = (permKey: string) => {
    setRoleForm(prev => {
      const current = prev.permissions || [];
      if (current.includes(permKey)) {
        return { ...prev, permissions: current.filter(p => p !== permKey) };
      } else {
        return { ...prev, permissions: [...current, permKey] };
      }
    });
  };

  // ----------------------------------------------------
  // FILTERED EMPLOYEES
  // ----------------------------------------------------
  const filteredEmployees = employees.filter(e => {
    const matchesSearch = e.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          e.phone.includes(searchTerm) ||
                          e.employeeCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || e.roleId === roleFilter;
    const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || e.department === departmentFilter;

    return matchesSearch && matchesRole && matchesStatus && matchesDepartment;
  });

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 font-medium">
        এমপ্লয়ি ও রোল ম্যানেজমেন্ট ডাটা লোড হচ্ছে...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-5 rounded-2xl text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold tracking-tight">এমপ্লয়ি ও রোল পারমিশন ম্যানেজমেন্ট სისტেম</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/30 border border-blue-400/30 text-blue-200 text-xs font-semibold">
              Organization Level Auth
            </span>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl">
            সংস্থার কর্মচারীদের একাউন্ট তৈরি, রোল পারমিশন নির্ধারণ, অ্যাকাউন্ট স্থগিতকরণ, অ্যাক্টিভিটি অডিট লগ এবং রোল অনুযায়ী পেজ অ্যাক্সেস সিকিউরিটি ফিল্টারিং।
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleOpenCreateEmp}
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <UserPlus className="w-4 h-4" />
            <span>নতুন এমপ্লয়ি যোগ করুন</span>
          </button>

          <button
            onClick={handleOpenCreateRole}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>কাস্টম রোল তৈরি</span>
          </button>
        </div>
      </div>

      {/* Subtabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1 text-xs font-bold">
        <button
          onClick={() => setActiveTab('employees')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'employees'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>এমপ্লয়ি তালিকা ও প্রোফাইল ({employees.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('roles')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'roles'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>রোল পারমিশন ম্যাট্রিক্স ({roles.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('security_test')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'security_test'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
          }`}
        >
          <Lock className="w-4 h-4 text-amber-300" />
          <span>রোল সিকিউরিটি ও পেজ ব্লক টেস্ট</span>
        </button>

        <button
          onClick={() => setActiveTab('audit_logs')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'audit_logs'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
          }`}
        >
          <History className="w-4 h-4" />
          <span>অডিট লগ ও লগইন হিস্ট্রি ({activityLogs.length})</span>
        </button>
      </div>

      {/* =====================================================================
          TAB 1: EMPLOYEE DIRECTORY & MANAGEMENT
         ===================================================================== */}
      {activeTab === 'employees' && (
        <div className="space-y-4">
          
          {/* Filters Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="নাম, আইডি বা মোবাইল দিয়ে খুঁজুন..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="all">সকল রোল ({roles.length})</option>
              {roles.map(r => (
                <option key={r.id} value={r.id}>{r.nameBangla}</option>
              ))}
            </select>

            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="all">সকল ডিপার্টমেন্ট</option>
              <option value="অপারেশনস">অপারেশনস</option>
              <option value="ফাইন্যান্স">ফাইন্যান্স</option>
              <option value="একাউন্টস">একাউন্টস</option>
              <option value="এডমিন">এডমিন</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              <option value="all">সকল স্ট্যাটাস</option>
              <option value="active">একটিভ স্টাফ</option>
              <option value="suspended">সাসপেন্ডেড স্টাফ</option>
            </select>
          </div>

          {/* Employee Directory Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold">
                  <tr>
                    <th className="p-3.5">কর্মচারী প্রোফাইল</th>
                    <th className="p-3.5">ডিজিগনেশন ও ডিপার্টমেন্ট</th>
                    <th className="p-3.5">অ্যাসাইনকৃত রোল</th>
                    <th className="p-3.5">ইউজারনেম</th>
                    <th className="p-3.5">যোগদানের তারিখ</th>
                    <th className="p-3.5">স্ট্যাটাস</th>
                    <th className="p-3.5 text-right">ম্যানেজমেন্ট</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
                  {filteredEmployees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={emp.photoUrl}
                            alt={emp.fullName}
                            className="w-10 h-10 rounded-full object-cover border-2 border-blue-500/30 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                              {emp.fullName}
                              <span className="text-[10px] font-mono text-blue-600 bg-blue-50 dark:bg-blue-950 px-1.5 py-0.2 rounded border border-blue-200">
                                {emp.employeeCode}
                              </span>
                            </p>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">{emp.phone}</p>
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <p className="font-bold text-slate-900 dark:text-white">{emp.designation}</p>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{emp.department}</span>
                      </td>

                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded text-[11px] font-extrabold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200">
                          {emp.roleName}
                        </span>
                      </td>

                      <td className="p-3.5 font-mono text-slate-800 dark:text-slate-200 font-bold">
                        @{emp.username}
                      </td>

                      <td className="p-3.5 font-mono text-slate-600 dark:text-slate-400">
                        {emp.joiningDate}
                      </td>

                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          emp.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-rose-50 text-rose-700 border-rose-300 dark:bg-rose-950 dark:text-rose-300'
                        }`}>
                          {emp.status === 'active' ? 'একটিভ' : 'সাসপেন্ডেড'}
                        </span>
                      </td>

                      <td className="p-3.5 text-right space-x-1.5">
                        <button
                          onClick={() => setSelectedProfileEmployee(emp)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-blue-600 rounded-lg transition-all"
                          title="প্রোফাইল বিবরণ"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleOpenEditEmp(emp)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg transition-all"
                          title="সম্পাদনা"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleToggleStatus(emp)}
                          className={`p-1.5 rounded-lg transition-all ${
                            emp.status === 'active'
                              ? 'bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-950 dark:text-emerald-300'
                          }`}
                          title={emp.status === 'active' ? 'সাসপেন্ড করুন' : 'একটিভ করুন'}
                        >
                          <Ban className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleSoftDelete(emp)}
                          className="p-1.5 bg-rose-100 hover:bg-rose-200 dark:bg-rose-950 text-rose-700 dark:text-rose-300 rounded-lg transition-all"
                          title="সফট ডিলিট"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* =====================================================================
          TAB 2: ROLE & PERMISSION MATRIX
         ===================================================================== */}
      {activeTab === 'roles' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-600" />
                অর্গানাইজেশন রোল পারমিশন ম্যাট্রিক্স
              </h3>
              <p className="text-xs text-slate-500">
                প্রতিটি নির্দিষ্ট রোলের জন্য কোন কোন মেনু ও ফিচার প্রবেশযোগ্য থাকবে তা অন/অফ করুন
              </p>
            </div>

            <button
              onClick={handleOpenCreateRole}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন কাস্টম রোল</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold">
                <tr>
                  <th className="p-3.5">ফিচারের নাম</th>
                  {roles.map(r => (
                    <th key={r.id} className="p-3.5 text-center min-w-[120px]">
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-900 dark:text-white">{r.nameBangla}</p>
                        <span className="text-[9px] font-mono text-blue-600 block">
                          {r.isSystemRole ? '[সিস্টেম রোল]' : '[কাস্টম রোল]'}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
                {ALL_EMPLOYEE_PERMISSIONS.map((perm) => (
                  <tr key={perm.key} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-3.5">
                      <p className="font-bold text-slate-900 dark:text-white">{perm.nameBangla}</p>
                      <p className="text-[10px] text-slate-400">{perm.description}</p>
                    </td>

                    {roles.map((role) => {
                      const isAllowed = role.permissions.includes(perm.key);
                      return (
                        <td key={role.id} className="p-3.5 text-center">
                          <button
                            onClick={() => handleTogglePermissionForRoleInMatrix(role, perm.key)}
                            className={`p-1.5 rounded-xl transition-all inline-flex items-center justify-center ${
                              isAllowed
                                ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 dark:bg-emerald-950 dark:text-emerald-300'
                                : 'bg-slate-100 text-slate-400 hover:bg-slate-200 dark:bg-slate-800'
                            }`}
                            title={isAllowed ? 'পারমিশন তুলে নিন' : 'পারমিশন দিন'}
                          >
                            {isAllowed ? <CheckCircle2 className="w-5 h-5 text-emerald-600" /> : <XCircle className="w-5 h-5 text-slate-400" />}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* =====================================================================
          TAB 3: SECURITY & PAGE BLOCK ACCESS SIMULATOR
         ===================================================================== */}
      {activeTab === 'security_test' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-xs">
            
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-500" />
                  রোল ভিত্তিক সিকিউরিটি ও পেজ এক্সেস টেস্ট ফিল্টার
                </h3>
                <p className="text-xs text-slate-500">
                  যেকোনো একটি রোল নির্বাচন করে দেখুন উক্ত রোলের ব্যবহারকারী কোন কোন পেজ ও মেনু ব্যবহার করতে পারবেন এবং কোনটিতে ব্লক খাবেন।
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">রোল সিলেক্ট করুন:</span>
                <select
                  value={simulatedRole}
                  onChange={(e) => setSimulatedRole(e.target.value)}
                  className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-blue-500 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-300 focus:outline-none"
                >
                  {roles.map(r => (
                    <option key={r.id} value={r.id}>{r.nameBangla}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Test Simulation Grid */}
            {(() => {
              const currentSimRole = roles.find(r => r.id === simulatedRole) || roles[0];
              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Allowed Pages */}
                  <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl space-y-3">
                    <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>অনুমোদিত পেজ ও সাইডবার মেনুসমূহ ({currentSimRole.permissions.length} টি)</span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      {ALL_EMPLOYEE_PERMISSIONS.filter(p => currentSimRole.permissions.includes(p.key)).map((p) => (
                        <div key={p.key} className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                          <span className="font-bold text-slate-800 dark:text-slate-200">{p.nameBangla}</span>
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-900/60 px-2 py-0.5 rounded">
                            FULL ACCESS
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Blocked Pages */}
                  <div className="p-4 bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 rounded-2xl space-y-3">
                    <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold text-xs">
                      <ShieldAlert className="w-4 h-4 text-rose-600" />
                      <span>ব্লকড পেজসমূহ (অনুমতি নেই - {ALL_EMPLOYEE_PERMISSIONS.length - currentSimRole.permissions.length} টি)</span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      {ALL_EMPLOYEE_PERMISSIONS.filter(p => !currentSimRole.permissions.includes(p.key)).map((p) => (
                        <div key={p.key} className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-rose-200 dark:border-rose-800 flex items-center justify-between opacity-80">
                          <span className="font-bold text-slate-500 line-through">{p.nameBangla}</span>
                          <span className="text-[10px] font-bold text-rose-600 bg-rose-100 dark:bg-rose-900/60 px-2 py-0.5 rounded">
                            ACCESS BLOCKED
                          </span>
                        </div>
                      ))}

                      {ALL_EMPLOYEE_PERMISSIONS.filter(p => !currentSimRole.permissions.includes(p.key)).length === 0 && (
                        <p className="text-xs text-slate-500 italic p-2">এই রোলের জন্য কোনো ব্লকড পেজ নেই (এডমিন একসেস)।</p>
                      )}
                    </div>
                  </div>

                </div>
              );
            })()}

          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 4: AUDIT ACTIVITY LOGS & LOGIN HISTORY
         ===================================================================== */}
      {activeTab === 'audit_logs' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Audit Activity Logs */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-xs">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <History className="w-4 h-4 text-blue-600" />
              এমপ্লয়ি অডিট অ্যাক্টিভিটি লগ (Audit Log)
            </h3>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {activityLogs.map((log) => (
                <div key={log.id} className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-900 dark:text-white">
                    <span className="font-bold text-blue-600">{log.action}</span>
                    <span className="text-[10px] font-mono text-slate-400">{new Date(log.timestamp).toLocaleString('bn-BD')}</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 font-medium">{log.details}</p>
                  <p className="text-[10px] text-slate-400 font-mono">আইপি: {log.ipAddress || '103.112.227.14'}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Login History */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-xs">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Key className="w-4 h-4 text-emerald-600" />
              লগইন ডিভাইস ও সেশন ইতিহাস (Login History)
            </h3>

            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
              {loginHistory.map((hist) => (
                <div key={hist.id} className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">{hist.employeeName}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      লগইন সফল
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-mono">{hist.roleName} • {hist.deviceInfo}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{new Date(hist.loginTime).toLocaleString('bn-BD')}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* =====================================================================
          ADD / EDIT EMPLOYEE MODAL
         ===================================================================== */}
      {isEmpModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full p-6 space-y-5 border border-slate-200 dark:border-slate-800 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-600" />
                {editingEmployee ? 'এমপ্লয়ি তথ্য পরিবর্তন' : 'নতুন এমপ্লয়ি রেজিস্ট্রেশন'}
              </h3>
              <button onClick={() => setIsEmpModalOpen(false)} className="p-1 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSaveEmployee} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">এমপ্লয়ি কোড (Auto)</label>
                  <input
                    type="text"
                    value={empForm.employeeCode || ''}
                    readOnly
                    className="w-full p-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold text-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">পূর্ণ নাম *</label>
                  <input
                    type="text"
                    required
                    value={empForm.fullName || ''}
                    onChange={(e) => setEmpForm({ ...empForm, fullName: e.target.value })}
                    placeholder="যেমন: মোঃ কামরুল ইসলাম"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">মোবাইল নম্বর *</label>
                  <input
                    type="text"
                    required
                    value={empForm.phone || ''}
                    onChange={(e) => setEmpForm({ ...empForm, phone: e.target.value })}
                    placeholder="017XXXXXXXX"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">ইমেইল ঠিকানা</label>
                  <input
                    type="email"
                    value={empForm.email || ''}
                    onChange={(e) => setEmpForm({ ...empForm, email: e.target.value })}
                    placeholder="emp@domain.com"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">এনআইডি নম্বর (NID)</label>
                  <input
                    type="text"
                    value={empForm.nid || ''}
                    onChange={(e) => setEmpForm({ ...empForm, nid: e.target.value })}
                    placeholder="1990XXXXXXXXXX"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">ডিজিগনেশন / পদবী</label>
                  <input
                    type="text"
                    value={empForm.designation || ''}
                    onChange={(e) => setEmpForm({ ...empForm, designation: e.target.value })}
                    placeholder="যেমন: ক্যাশিয়ার / সুপারভাইজার"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">ডিপার্টমেন্ট</label>
                  <select
                    value={empForm.department || 'অপারেশনস'}
                    onChange={(e) => setEmpForm({ ...empForm, department: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  >
                    <option value="অপারেশনস">অপারেশনস</option>
                    <option value="ফাইন্যান্স">ফাইন্যান্স</option>
                    <option value="একাউন্টস">একাউন্টস</option>
                    <option value="এডমিন">এডমিন</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">অ্যাসাইনকৃত রোল *</label>
                  <select
                    value={empForm.roleId || 'cash_collector'}
                    onChange={(e) => setEmpForm({ ...empForm, roleId: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-blue-600"
                  >
                    {roles.map(r => (
                      <option key={r.id} value={r.id}>{r.nameBangla}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">ইউজারনেম</label>
                  <input
                    type="text"
                    value={empForm.username || ''}
                    onChange={(e) => setEmpForm({ ...empForm, username: e.target.value })}
                    placeholder="username"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">পাসওয়ার্ড</label>
                  <input
                    type="password"
                    value={empForm.passwordHash || ''}
                    onChange={(e) => setEmpForm({ ...empForm, passwordHash: e.target.value })}
                    placeholder="••••••••"
                    className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">ঠিকানা</label>
                <textarea
                  rows={2}
                  value={empForm.address || ''}
                  onChange={(e) => setEmpForm({ ...empForm, address: e.target.value })}
                  placeholder="বাসা নং, রোড, থানা, জেলা"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEmpModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md"
                >
                  সংরক্ষণ করুন
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* =====================================================================
          EMPLOYEE PROFILE DRAWER / VIEW MODAL
         ===================================================================== */}
      {selectedProfileEmployee && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 space-y-5 border border-slate-200 dark:border-slate-800 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                এমপ্লয়ি প্রোফাইল কার্ড
              </h3>
              <button onClick={() => setSelectedProfileEmployee(null)} className="p-1 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="text-center space-y-2">
              <img
                src={selectedProfileEmployee.photoUrl}
                alt={selectedProfileEmployee.fullName}
                className="w-20 h-20 rounded-full mx-auto object-cover border-4 border-blue-500/20"
              />
              <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                {selectedProfileEmployee.fullName}
              </h4>
              <span className="px-3 py-1 bg-blue-50 dark:bg-blue-950 text-blue-600 font-extrabold text-xs rounded-full border border-blue-200 inline-block">
                {selectedProfileEmployee.roleName}
              </span>
            </div>

            <div className="space-y-2 text-xs border-t border-slate-100 dark:border-slate-800 pt-3">
              <div className="flex justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <span className="text-slate-400 font-bold">এমপ্লয়ি কোড:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{selectedProfileEmployee.employeeCode}</span>
              </div>

              <div className="flex justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <span className="text-slate-400 font-bold">মোবাইল:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{selectedProfileEmployee.phone}</span>
              </div>

              <div className="flex justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <span className="text-slate-400 font-bold">এনআইডি (NID):</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{selectedProfileEmployee.nid || 'N/A'}</span>
              </div>

              <div className="flex justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <span className="text-slate-400 font-bold">যোগদানের তারিখ:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{selectedProfileEmployee.joiningDate}</span>
              </div>

              <div className="flex justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <span className="text-slate-400 font-bold">সর্বশেষ লগইন:</span>
                <span className="font-mono font-bold text-emerald-600">{selectedProfileEmployee.lastLogin}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedProfileEmployee(null)}
              className="w-full py-2 bg-slate-900 text-white font-bold text-xs rounded-xl"
            >
              বন্ধ করুন
            </button>

          </div>
        </div>
      )}

      {/* =====================================================================
          CREATE / EDIT CUSTOM ROLE MODAL
         ===================================================================== */}
      {isRoleModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 space-y-5 border border-slate-200 dark:border-slate-800 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-600" />
                {editingRole ? 'রোল সম্পাদনা' : 'নতুন কাস্টম রোল তৈরি'}
              </h3>
              <button onClick={() => setIsRoleModalOpen(false)} className="p-1 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSaveRoleForm} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">রোল কোড *</label>
                <input
                  type="text"
                  required
                  value={roleForm.roleCode || ''}
                  onChange={(e) => setRoleForm({ ...roleForm, roleCode: e.target.value })}
                  placeholder="যেমন: ROLE-CUST-01"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">রোলের নাম (বাংলা) *</label>
                <input
                  type="text"
                  required
                  value={roleForm.nameBangla || ''}
                  onChange={(e) => setRoleForm({ ...roleForm, nameBangla: e.target.value })}
                  placeholder="যেমন: অ্যাসিস্ট্যান্ট ক্যাশিয়ার"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">বিবরণ</label>
                <textarea
                  rows={2}
                  value={roleForm.description || ''}
                  onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                  placeholder="এই রোলের দায়িত্বের পরিধি"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-2">ফিচার পারমিশন সিলেক্ট করুন:</label>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {ALL_EMPLOYEE_PERMISSIONS.map(p => {
                    const checked = (roleForm.permissions || []).includes(p.key);
                    return (
                      <label key={p.key} className={`p-2 rounded-xl border flex items-center gap-2 cursor-pointer ${
                        checked ? 'bg-purple-50 border-purple-300 dark:bg-purple-950/40' : 'bg-slate-50 border-slate-200 dark:bg-slate-800'
                      }`}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => togglePermissionInRoleForm(p.key)}
                          className="rounded text-purple-600 focus:ring-purple-500"
                        />
                        <span className="font-bold text-[11px] truncate">{p.nameBangla}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsRoleModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md"
                >
                  রোল সংরক্ষণ করুন
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
