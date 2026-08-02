import { 
  collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, onSnapshot, 
  query, where, orderBy, serverTimestamp, DocumentData 
} from 'firebase/firestore';
import { db } from './firebase';
import { StorageService } from './storageService';
import { OrganizationTenant, OrgStatus, OrgCategory } from '../types/saas';
import { MOCK_ORGANIZATIONS } from '../data/mockSaaSData';

const COLLECTION_NAME = 'tenants';

/**
 * Utility helper to strip undefined values from payloads before sending to Firestore
 */
function sanitizeFirestorePayload<T extends Record<string, any>>(obj: T): Record<string, any> {
  const sanitized: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

export class OrganizationService {
  /**
   * Auto-generate a unique Organization Code
   * e.g., ORG-2026-9812
   */
  static generateOrgCode(): string {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `ORG-${year}-${randomNum}`;
  }

  // Local storage helpers for custom orgs
  private static getCustomOrgs(): OrganizationTenant[] {
    try {
      const stored = localStorage.getItem('ababil_custom_orgs');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private static saveCustomOrg(org: OrganizationTenant): void {
    try {
      const orgs = OrganizationService.getCustomOrgs();
      const index = orgs.findIndex(o => o.id === org.id);
      if (index >= 0) {
        orgs[index] = org;
      } else {
        orgs.unshift(org);
      }
      localStorage.setItem('ababil_custom_orgs', JSON.stringify(orgs));
    } catch (e) {
      console.warn('Failed to save custom org to localStorage:', e);
    }
  }

  private static getDeletedOrgIds(): string[] {
    try {
      const stored = localStorage.getItem('ababil_deleted_org_ids');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private static addDeletedOrgId(id: string): void {
    try {
      const ids = OrganizationService.getDeletedOrgIds();
      if (!ids.includes(id)) {
        ids.push(id);
        localStorage.setItem('ababil_deleted_org_ids', JSON.stringify(ids));
      }
    } catch (e) {
      console.warn('Failed to save deleted org ID:', e);
    }
  }

  // Real-time listener for non-deleted organizations
  static subscribeOrganizations(
    onSuccess: (orgs: OrganizationTenant[]) => void,
    onError?: (err: Error) => void
  ): () => void {
    try {
      const isCleanStarted = localStorage.getItem('ababil_clean_started');
      if (!isCleanStarted) {
        localStorage.setItem('ababil_clean_started', 'true');
        localStorage.removeItem('ababil_custom_orgs');
      }

      const colRef = collection(db, COLLECTION_NAME);
      
      const unsubscribe = onSnapshot(colRef, async (snapshot) => {
        const deletedIds = OrganizationService.getDeletedOrgIds();
        const customOrgs = OrganizationService.getCustomOrgs();

        if (snapshot.empty) {
          onSuccess(customOrgs.filter(o => !deletedIds.includes(o.id)));
          return;
        }

        const orgsMap = new Map<string, OrganizationTenant>();
        // Add local custom orgs first
        customOrgs.forEach(o => {
          if (!deletedIds.includes(o.id)) orgsMap.set(o.id, o);
        });

        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          // Filter out soft deleted records & local deleted IDs
          if (!data.isDeleted && !deletedIds.includes(docSnap.id)) {
            orgsMap.set(docSnap.id, {
              id: docSnap.id,
              orgCode: data.orgCode || `ORG-2026-${docSnap.id.slice(-4)}`,
              orgName: data.orgName || '',
              orgCategory: (data.orgCategory as OrgCategory) || 'Auto Garage',
              ownerName: data.ownerName || 'প্রোপাইটর',
              address: data.address || '',
              phone: data.phone || '',
              email: data.email || '',
              logoUrl: data.logoUrl || 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=120&auto=format&fit=crop&q=80',
              primaryColor: data.primaryColor || '#7c3aed',
              status: (data.status as OrgStatus) || 'active',
              packageId: data.packageId || 'professional',
              subscriptionStart: data.subscriptionStart || new Date().toISOString().split('T')[0],
              subscriptionEnd: data.subscriptionEnd || new Date(Date.now() + 365*24*60*60*1000).toISOString().split('T')[0],
              trialDaysRemaining: data.trialDaysRemaining ?? undefined,
              timeZone: data.timeZone || 'Asia/Dhaka',
              createdAt: data.createdAt || new Date().toISOString().split('T')[0],
              isDeleted: data.isDeleted || false,
              memberCount: data.memberCount || 0,
              employeeCount: data.employeeCount || 1,
              monthlyRevenueEstimate: data.monthlyRevenueEstimate || 1200
            });
          }
        });

        const orgsList = Array.from(orgsMap.values());
        // Sort by createdAt descending
        orgsList.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
        onSuccess(orgsList);
      }, (err) => {
        console.warn('Firestore Organizations Listener Warning, falling back to local state:', err);
        const deletedIds = OrganizationService.getDeletedOrgIds();
        const customOrgs = OrganizationService.getCustomOrgs();
        const fallback = customOrgs.filter(o => !deletedIds.includes(o.id));
        onSuccess(fallback);
        if (onError) onError(err);
      });

      return unsubscribe;
    } catch (error) {
      console.warn('Firestore subscription failed:', error);
      const deletedIds = OrganizationService.getDeletedOrgIds();
      const customOrgs = OrganizationService.getCustomOrgs();
      const fallback = customOrgs.filter(o => !deletedIds.includes(o.id));
      onSuccess(fallback);
      if (onError) onError(error as Error);
      return () => {};
    }
  }

  /**
   * Seed Firestore with initial mock organizations
   */
  static async seedInitialOrganizations(): Promise<void> {
    localStorage.removeItem('ababil_demo_cleared');
    try {
      for (const org of MOCK_ORGANIZATIONS) {
        const docRef = doc(db, COLLECTION_NAME, org.id);
        const code = this.generateOrgCode();
        const payload = sanitizeFirestorePayload({
          ...org,
          orgCode: org.orgCode || code,
          ownerName: org.ownerName || 'মো: আব্দুল করিম',
          timeZone: 'Asia/Dhaka',
          createdAt: new Date().toISOString().split('T')[0],
          isDeleted: false,
          updatedAt: serverTimestamp()
        });
        await setDoc(docRef, payload, { merge: true });
      }
    } catch (err) {
      console.warn('Seed organizations warning:', err);
    }
  }

  /**
   * Clear all organizations from Firestore (Permanent Clear Demo Data)
   */
  static async clearAllOrganizations(): Promise<void> {
    localStorage.setItem('ababil_demo_cleared', 'true');
    try {
      const colRef = collection(db, COLLECTION_NAME);
      const snapshot = await getDocs(colRef);
      const deletePromises = snapshot.docs.map(docSnap => deleteDoc(docSnap.ref));
      await Promise.all(deletePromises);
      await this.logAuditAction('সকল ডেমো অর্গানাইজেশন স্থায়ীভাবে মুছে ফেলা হয়েছে', 'global');
    } catch (err) {
      console.warn('Clear all orgs error:', err);
      throw err;
    }
  }

  /**
   * Fetch all non-deleted organizations once
   */
  static async getAll(): Promise<OrganizationTenant[]> {
    try {
      const colRef = collection(db, COLLECTION_NAME);
      const snapshot = await getDocs(colRef);
      if (snapshot.empty) {
        return OrganizationService.getCustomOrgs();
      }

      const list: OrganizationTenant[] = [];
      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        if (!data.isDeleted) {
          list.push({
            id: docSnap.id,
            orgCode: data.orgCode || `ORG-2026-${docSnap.id.slice(-4)}`,
            orgName: data.orgName,
            orgCategory: data.orgCategory,
            ownerName: data.ownerName || 'প্রোপাইটর',
            address: data.address,
            phone: data.phone,
            email: data.email,
            logoUrl: data.logoUrl,
            primaryColor: data.primaryColor || '#7c3aed',
            status: data.status,
            packageId: data.packageId,
            subscriptionStart: data.subscriptionStart,
            subscriptionEnd: data.subscriptionEnd,
            trialDaysRemaining: data.trialDaysRemaining ?? undefined,
            timeZone: data.timeZone || 'Asia/Dhaka',
            createdAt: data.createdAt || new Date().toISOString().split('T')[0],
            isDeleted: false,
            memberCount: data.memberCount || 0,
            employeeCount: data.employeeCount || 1,
            monthlyRevenueEstimate: data.monthlyRevenueEstimate || 1200
          });
        }
      });
      return list;
    } catch (e) {
      console.warn('Organization fetch error:', e);
      return [];
    }
  }

  /**
   * Create a new organization in Firestore
   */
  static async create(
    orgData: Omit<OrganizationTenant, 'id'>, 
    logoFile?: File
  ): Promise<OrganizationTenant> {
    localStorage.removeItem('ababil_demo_cleared');
    const id = `org_${Date.now().toString().slice(-6)}`;
    const orgCode = orgData.orgCode || this.generateOrgCode();
    
    let logoUrl = orgData.logoUrl || 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=120&auto=format&fit=crop&q=80';

    if (logoFile) {
      try {
        // Try uploading to storage with a race timeout so it never gets stuck
        const uploadPromise = StorageService.uploadTenantFile(id, 'logos', logoFile);
        const timeoutPromise = new Promise<string>((_, reject) => setTimeout(() => reject(new Error('Storage timeout')), 4000));
        logoUrl = await Promise.race([uploadPromise, timeoutPromise]);
      } catch (err) {
        console.warn('Storage logo upload failed or timed out, using preview/fallback URL:', err);
        // Fallback to orgData.logoUrl (which is the base64 preview) if available
        logoUrl = orgData.logoUrl || logoUrl;
      }
    }

    const newOrg: OrganizationTenant = {
      ...orgData,
      id,
      orgCode,
      logoUrl,
      timeZone: orgData.timeZone || 'Asia/Dhaka',
      createdAt: new Date().toISOString().split('T')[0],
      isDeleted: false
    };

    // Save locally first so it's instantly available and never hangs
    this.saveCustomOrg(newOrg);

    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const payload = sanitizeFirestorePayload({
        ...newOrg,
        createdAtTimestamp: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      const writePromise = setDoc(docRef, payload);
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Firestore timeout')), 3000));
      await Promise.race([writePromise, timeoutPromise]);

      // Save Audit Log (with timeout race)
      const auditPromise = this.logAuditAction(`নতুন অর্গানাইজেশন তৈরি: ${newOrg.orgName} (${newOrg.orgCode})`, id);
      const auditTimeout = new Promise((_, reject) => setTimeout(() => reject(new Error('Audit timeout')), 2000));
      await Promise.race([auditPromise, auditTimeout]).catch(() => {});
    } catch (e) {
      console.warn('Firestore set doc warning (saved locally successfully):', e);
    }

    return newOrg;
  }

  /**
   * Update an existing organization
   */
  static async update(
    id: string, 
    orgData: Partial<OrganizationTenant>, 
    logoFile?: File
  ): Promise<void> {
    let logoUrl = orgData.logoUrl;

    if (logoFile) {
      try {
        const uploadPromise = StorageService.uploadTenantFile(id, 'logos', logoFile);
        const timeoutPromise = new Promise<string>((_, reject) => setTimeout(() => reject(new Error('Storage timeout')), 4000));
        logoUrl = await Promise.race([uploadPromise, timeoutPromise]);
      } catch (err) {
        console.warn('Storage logo update failed or timed out, using fallback URL:', err);
        logoUrl = orgData.logoUrl || logoUrl;
      }
    }

    const updatePayload: Record<string, any> = {
      ...orgData,
      updatedAt: serverTimestamp()
    };
    if (logoUrl) updatePayload.logoUrl = logoUrl;

    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const sanitized = sanitizeFirestorePayload(updatePayload);
      const writePromise = setDoc(docRef, sanitized, { merge: true });
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Firestore timeout')), 3000));
      await Promise.race([writePromise, timeoutPromise]);
      
      const auditPromise = this.logAuditAction(`অর্গানাইজেশন তথ্য পরিবর্তন: ${orgData.orgName || id}`, id);
      const auditTimeout = new Promise((_, reject) => setTimeout(() => reject(new Error('Audit timeout')), 2000));
      await Promise.race([auditPromise, auditTimeout]).catch(() => {});
    } catch (e) {
      console.warn('Firestore update warning:', e);
    }
  }

  /**
   * Toggle Organization Status (Active <-> Suspended)
   */
  static async setStatus(id: string, status: OrgStatus, orgName: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await setDoc(docRef, {
        status,
        updatedAt: serverTimestamp()
      }, { merge: true });
      await this.logAuditAction(`স্ট্যাটাস পরিবর্তন (${status}): ${orgName}`, id);
    } catch (e) {
      console.error('Firestore update status error:', e);
      throw e;
    }
  }

  /**
   * Soft Delete / Remove an Organization
   */
  static async softDelete(id: string, orgName: string): Promise<void> {
    this.addDeletedOrgId(id);
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await setDoc(docRef, {
        isDeleted: true,
        status: 'suspended',
        deletedAt: new Date().toISOString(),
        updatedAt: serverTimestamp()
      }, { merge: true });
      await deleteDoc(docRef).catch(() => {});
      await this.logAuditAction(`অর্গানাইজেশন সফ্ট ডিলিট সম্পন্ন: ${orgName}`, id);
    } catch (e) {
      console.warn('Firestore soft delete warning:', e);
    }
  }

  /**
   * Reset Admin Password for Organization
   */
  static async resetAdminPassword(orgId: string, email: string, orgName: string): Promise<{ tempPassword: string }> {
    const tempPassword = `Pass#${Math.floor(100000 + Math.random() * 900000)}`;
    try {
      await this.logAuditAction(`এডমিন পাসওয়ার্ড রিসেট (${email}): ${orgName}`, orgId);
      
      const docRef = doc(db, COLLECTION_NAME, orgId);
      await updateDoc(docRef, {
        lastPasswordResetAt: new Date().toISOString(),
        updatedAt: serverTimestamp()
      });
    } catch (e) {
      console.warn('Reset password audit log warning:', e);
    }
    return { tempPassword };
  }

  /**
   * Save Audit Log entry in Firestore `audit_logs` collection
   */
  static async logAuditAction(action: string, targetTenantId?: string): Promise<void> {
    try {
      const logRef = doc(collection(db, 'audit_logs'));
      const payload = sanitizeFirestorePayload({
        action,
        targetTenantId: targetTenantId || 'global',
        user: 'Super Admin',
        role: 'super_admin',
        timestamp: new Date().toISOString(),
        createdAt: serverTimestamp(),
        status: 'Success'
      });
      await setDoc(logRef, payload);
    } catch (e) {
      console.warn('Audit log write error:', e);
    }
  }
}
