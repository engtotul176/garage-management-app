export interface ApiKeyRecord {
  id: string;
  tenantId: string;
  name: string;
  apiKey: string;
  secretKey?: string;
  role: string;
  scopes: string[];
  rateLimitPerMin: number;
  status: 'ACTIVE' | 'REVOKED' | 'EXPIRED';
  createdAt: string;
  lastUsedAt?: string;
  createdBy: string;
}

export interface ApiLogRecord {
  id: string;
  tenantId: string;
  keyId?: string;
  endpoint: string;
  version: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  clientIp: string;
  userAgent: string;
  statusCode: number;
  responseTimeMs: number;
  requestPayload?: string;
  responsePayload?: string;
  timestamp: string;
}

export interface ApiUsageMetric {
  id: string;
  tenantId: string;
  endpoint: string;
  date: string;
  totalRequests: number;
  successRequests: number;
  failedRequests: number;
  avgLatencyMs: number;
  updatedAt: string;
}

export interface MobileSessionRecord {
  id: string;
  tenantId: string;
  userId: string;
  userName?: string;
  deviceId: string;
  platform: 'ANDROID' | 'IOS' | 'DESKTOP' | 'ANDROID_TV';
  appVersion: string;
  fcmToken?: string;
  ipAddress: string;
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
  lastActiveAt: string;
  createdAt: string;
}

export interface ApiResponseWrapper<T = any> {
  success: boolean;
  version: string;
  timestamp: string;
  statusCode: number;
  message?: string;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  meta?: Record<string, any>;
}

export interface EndpointDefinition {
  module: string;
  version: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  summary: string;
  description: string;
  authRequired: boolean;
  scopeRequired?: string;
  parameters?: {
    name: string;
    in: 'path' | 'query' | 'header' | 'body';
    required: boolean;
    type: string;
    description: string;
  }[];
  sampleResponse: Record<string, any>;
}
