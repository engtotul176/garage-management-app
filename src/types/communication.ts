export type SmsGatewayProvider = 'teletalk' | 'greenweb' | 'bulksms_bd' | 'ssl_wireless' | 'twilio' | 'custom_api';

export type NotificationCategory = 
  | 'system'
  | 'dashboard'
  | 'due'
  | 'subscription'
  | 'payment_success'
  | 'payment_failed';

export type AutoSmsEventType = 
  | 'member_registered'
  | 'collection_completed'
  | 'receipt_generated'
  | 'due_reminder'
  | 'subscription_expiry'
  | 'organization_created'
  | 'employee_created';

export interface AutoSmsTriggerConfig {
  eventType: AutoSmsEventType;
  labelBengali: string;
  enabled: boolean;
  templateId?: string;
  defaultMessage: string;
}

export interface CommunicationSettings {
  id: string; // tenantId or 'global'
  tenantId: string;
  smsEnabled: boolean;
  smsGateway: SmsGatewayProvider;
  apiKey: string;
  apiSecret: string;
  senderId: string;
  smsBalance: number; // in BDT or credits
  smsRate: number; // cost per SMS in BDT
  autoSmsTriggers: Record<AutoSmsEventType, AutoSmsTriggerConfig>;
  pushEnabled: boolean;
  whatsappEnabled: boolean;
  emailEnabled: boolean;
  telegramEnabled: boolean;
  updatedAt: string;
}

export interface SmsLog {
  logId: string;
  tenantId: string;
  recipientPhone: string;
  recipientName?: string;
  message: string;
  gateway: SmsGatewayProvider;
  status: 'delivered' | 'failed' | 'pending' | 'simulated';
  smsCount: number;
  cost: number;
  eventType: string;
  sentBy: string;
  timestamp: string;
}

export interface NotificationLog {
  id: string;
  tenantId: string;
  userId?: string;
  title: string;
  body: string;
  category: NotificationCategory;
  isRead: boolean;
  isArchived: boolean;
  createdAt: string;
}

export interface MessageTemplate {
  templateId: string;
  tenantId: string;
  title: string;
  category: string;
  channel: 'sms' | 'push' | 'whatsapp' | 'email';
  body: string;
  variables: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PushNotification {
  id: string;
  tenantId: string;
  title: string;
  message: string;
  category: NotificationCategory;
  targetAudience: 'all' | 'members' | 'employees' | 'due_members';
  sentCount: number;
  status: 'sent' | 'draft' | 'scheduled';
  createdAt: string;
}

export interface SmsSendPayload {
  recipientType: 'single' | 'multiple' | 'bulk_all' | 'bulk_due';
  recipientPhone?: string;
  recipientPhones?: string[];
  recipientName?: string;
  message: string;
  eventType?: string;
}
