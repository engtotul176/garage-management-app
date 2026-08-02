/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GlobalErrorHandler } from './core/errors/GlobalErrorHandler';
import { ThemeEngine } from './core/theme/ThemeEngine';
import { BrandingEngine } from './core/branding/BrandingEngine';
import { AuthProvider } from './core/auth/AuthContext';
import { TenantEngine } from './core/tenant/TenantEngine';
import { AppLayout } from './layouts/AppLayout';
import { AppRouter } from './routing/AppRouter';

function AppContent() {
  const [activeTab, setActiveTab] = useState<string>('step1_overview');

  return (
    <AppLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <AppRouter activeTab={activeTab} />
    </AppLayout>
  );
}

export default function App() {
  return (
    <GlobalErrorHandler>
      <ThemeEngine>
        <BrandingEngine>
          <AuthProvider>
            <TenantEngine>
              <AppContent />
            </TenantEngine>
          </AuthProvider>
        </BrandingEngine>
      </ThemeEngine>
    </GlobalErrorHandler>
  );
}
