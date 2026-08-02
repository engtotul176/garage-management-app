export interface QualityAuditScorecard {
  securityScore: number;
  performanceScore: number;
  codeQualityScore: number;
  scalabilityScore: number;
  maintainabilityScore: number;
  productionReadinessScore: number;
  overallScore: number;
}

export interface ModuleIntegrationStatus {
  id: string;
  moduleName: string;
  category: string;
  status: 'VERIFIED_OPERATIONAL' | 'INTEGRATED' | 'READY';
  testCasesPassedCount: number;
  notes: string;
}

export interface EnterpriseDocumentationSection {
  id: string;
  title: string;
  category: 'ARCHITECTURE' | 'DATABASE' | 'API' | 'MANUALS' | 'DEVOPS' | 'TROUBLESHOOTING';
  summary: string;
  contentMarkdown: string;
  downloadUrl?: string;
}

export interface FinalReleaseSummary {
  version: string;
  releaseTag: string;
  releaseDate: string;
  licenseType: string;
  qualityScores: QualityAuditScorecard;
  modules: ModuleIntegrationStatus[];
}
