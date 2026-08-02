export interface UnitTestResult {
  id: string;
  moduleName: string; // Authentication, RBAC, Organization, Member, Employee, Collection, Accounting, Reports, Notifications, Subscription, Payment, Branding
  testName: string;
  category: 'UNIT' | 'INTEGRATION' | 'E2E';
  status: 'PASSED' | 'FAILED' | 'SKIPPED';
  durationMs: number;
  assertionCount: number;
  errorMessage?: string;
  details: string;
}

export interface IntegrationTestResult {
  id: string;
  subsystem: 'Firebase Auth' | 'Firestore DB' | 'Firebase Storage' | 'REST API' | 'Android App' | 'Android TV' | 'Customer Portal';
  scenario: string;
  status: 'PASSED' | 'FAILED';
  latencyMs: number;
  requestPayload?: string;
  responseSummary: string;
}

export interface E2eTestFlow {
  id: string;
  flowName: 'Login Flow' | 'Subscription Flow' | 'Daily Collection Flow' | 'Receipt Generation' | 'Payment Flow' | 'Backup & Restore' | 'Reports';
  stepsCount: number;
  passedSteps: number;
  status: 'PASSED' | 'FAILED' | 'IN_PROGRESS';
  executionTimeSec: number;
  lastRunTimestamp: string;
  stepDetails: { stepNumber: number; stepTitle: string; status: 'PASSED' | 'FAILED'; durationMs: number }[];
}

export interface SecurityAuditResult {
  id: string;
  targetArea: 'Firestore Rules' | 'Storage Rules' | 'API Authorization' | 'Route Protection' | 'Session Validation' | 'Organization Isolation';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'VERIFIED_SECURE' | 'WARNING' | 'VULNERABILITY';
  description: string;
  verificationEvidence: string;
}

export interface CodeQualityAuditItem {
  id: string;
  checkType: 'Duplicate Code' | 'Dead Code' | 'Unused Imports' | 'Error Handling' | 'Logging Review' | 'Code Style';
  fileOrModule: string;
  issueCount: number;
  status: 'CLEAN' | 'NEEDS_ATTENTION' | 'FIXED';
  details: string;
  recommendation: string;
}

export interface EnterpriseBugItem {
  id: string;
  title: string;
  module: string;
  severity: 'CRITICAL' | 'MAJOR' | 'MINOR';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  reportedAt: string;
  resolvedAt?: string;
  reportedBy: string;
  assignedTo: string;
  reproductionSteps: string;
  resolutionNotes?: string;
}

export interface TechnicalDocItem {
  id: string;
  title: string;
  type: 'API Documentation' | 'Database Documentation' | 'Deployment Guide' | 'Admin Manual' | 'User Manual';
  version: string;
  lastUpdated: string;
  sections: { heading: string; content: string; codeSnippet?: string }[];
}

export interface FinalProductionReadinessReport {
  productionReadinessScore: number; // e.g. 99.4 / 100
  securityScore: number; // 100 / 100
  performanceScore: number; // 98 / 100
  codeQualityScore: number; // 99 / 100
  totalTestsRun: number;
  testsPassed: number;
  testsFailed: number;
  criticalBugsOpen: number;
  majorBugsOpen: number;
  minorBugsOpen: number;
  resolvedBugsCount: number;
  auditSummary: string;
  verifiedAt: string;
}
