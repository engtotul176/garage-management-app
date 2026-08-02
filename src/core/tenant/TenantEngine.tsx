import React, { createContext, useContext, useState, useEffect } from 'react';
import { OrganizationTenant } from '../../types/saas';
import { MOCK_ORGANIZATIONS } from '../../data/mockSaaSData';
import { OrganizationService } from '../../services/organizationService';

const defaultEmptyTenant: OrganizationTenant = {
  id: 'no_org',
  orgCode: 'ORG-0000',
  orgName: 'কোনো গ্যারেজ যোগ করা হয়নি',
  orgCategory: 'Auto Garage',
  ownerName: '',
  address: 'দয়া করে নতুন অর্গানাইজেশন তৈরি করুন',
  phone: '',
  email: '',
  logoUrl: '',
  primaryColor: '#7c3aed',
  status: 'active',
  packageId: 'professional',
  subscriptionStart: new Date().toISOString().split('T')[0],
  subscriptionEnd: new Date(Date.now() + 365*24*60*60*1000).toISOString().split('T')[0],
  timeZone: 'Asia/Dhaka',
  createdAt: new Date().toISOString().split('T')[0],
  isDeleted: false,
  memberCount: 0,
  employeeCount: 0,
  monthlyRevenueEstimate: 0
};

interface TenantContextType {
  currentTenant: OrganizationTenant;
  tenantsList: OrganizationTenant[];
  setTenant: (tenantId: string) => void;
  updateTenantsList: (list: OrganizationTenant[]) => void;
}

const TenantContext = createContext<TenantContextType>({
  currentTenant: defaultEmptyTenant,
  tenantsList: [],
  setTenant: () => {},
  updateTenantsList: () => {},
});

export const TenantEngine: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenantsList, setTenantsList] = useState<OrganizationTenant[]>([]);
  const [currentTenant, setCurrentTenantState] = useState<OrganizationTenant>(defaultEmptyTenant);

  useEffect(() => {
    const unsubscribe = OrganizationService.subscribeOrganizations((orgs) => {
      const validOrgs = orgs || [];
      setTenantsList(validOrgs);
      if (validOrgs.length > 0) {
        setCurrentTenantState(validOrgs[0]);
      } else {
        setCurrentTenantState(defaultEmptyTenant);
      }
    });
    return () => unsubscribe();
  }, []);

  const setTenant = (tenantId: string) => {
    const found = tenantsList.find(t => t.id === tenantId);
    if (found) {
      setCurrentTenantState(found);
    }
  };

  return (
    <TenantContext.Provider value={{ currentTenant, tenantsList, setTenant, updateTenantsList: setTenantsList }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => useContext(TenantContext);
