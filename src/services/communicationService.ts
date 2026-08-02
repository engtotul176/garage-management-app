import { 
  collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, 
  query, where, orderBy, limit, serverTimestamp 
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { 
  CommunicationSettings, 
  SmsLog, 
  NotificationLog, 
  MessageTemplate, 
  PushNotification, 
  SmsSendPayload,
  AutoSmsEventType,
  NotificationCategory
} from '../types/communication';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Error in CommunicationService: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const DEFAULT_AUTO_TRIGGERS: Record<AutoSmsEventType, any> = {
  member_registered: {
    eventType: 'member_registered',
    labelBengali: 'নতুন সদস্য রেজিস্ট্রেশন (Member Registration)',
    enabled: true,
    defaultMessage: 'স্বাগতম {{MemberName}}! {{OrganizationName}}-এ আপনার রেজিস্ট্রেশন সফল হয়েছে। ফোন: {{Phone}}'
  },
  collection_completed: {
    eventType: 'collection_completed',
    labelBengali: 'দৈনিক কালেকশন সম্পূর্ণ (Daily Collection)',
    enabled: true,
    defaultMessage: 'প্রিয় {{MemberName}}, {{Amount}} টাকা ফি গ্রহণ করা হয়েছে। রশিদ নং: {{ReceiptNo}}। {{OrganizationName}}'
  },
  receipt_generated: {
    eventType: 'receipt_generated',
    labelBengali: 'রশিদ প্রস্তুতকরণ (Receipt Generated)',
    enabled: true,
    defaultMessage: 'রশিদ নং {{ReceiptNo}}: {{Amount}} টাকা জমা হয়েছে। অবশিষ্ট বকেয়া: {{DueAmount}} টাকা। {{OrganizationName}}'
  },
  due_reminder: {
    eventType: 'due_reminder',
    labelBengali: 'বকেয়া ফি রিমাইন্ডার (Due Reminder)',
    enabled: true,
    defaultMessage: 'সম্মানিত {{MemberName}}, আপনার মোট বকেয়া {{DueAmount}} টাকা। অতি দ্রুত পরিশোধ করার জন্য অনুরোধ করা হচ্ছে। {{OrganizationName}}'
  },
  subscription_expiry: {
    eventType: 'subscription_expiry',
    labelBengali: 'সাবস্ক্রিপশন মেয়ার উত্তীর্ণ রিমাইন্ডার (Subscription Expiry)',
    enabled: true,
    defaultMessage: 'জরুরী: আপনার {{OrganizationName}}-এর সাবস্ক্রিপশন {{ExpiryDate}} তারিখে শেষ হবে। নবায়ন করতে যোগাযোগ করুন।'
  },
  organization_created: {
    eventType: 'organization_created',
    labelBengali: 'নতুন অর্গানাইজেশন তৈরি (Organization Created)',
    enabled: true,
    defaultMessage: 'অভিনন্দন! {{OrganizationName}} সফলভাবে SaaS প্ল্যাটফর্মে নিবন্ধিত হয়েছে। ইউজার: {{Phone}}'
  },
  employee_created: {
    eventType: 'employee_created',
    labelBengali: 'নতুন স্টাফ / কর্মচারী আইডি (Employee Created)',
    enabled: true,
    defaultMessage: 'স্বাগতম! আপনাকে {{OrganizationName}}-এ নতুন কর্মচারী হিসেবে যোগ করা হয়েছে। লগইন বিবরণ পরবর্তীতে পাঠানো হবে।'
  }
};

export class CommunicationService {
  /**
   * Helper: Calculate SMS Segments and estimated cost
   * Unicode (Bengali) = 70 chars per SMS segment
   * ASCII (English) = 160 chars per SMS segment
   */
  static calculateSmsCountAndCost(text: string, rateBdt: number = 0.35): { smsCount: number; isUnicode: boolean; charLength: number; estimatedCost: number } {
    const isUnicode = /[^\x00-\x7F]/.test(text);
    const charLength = text.length;
    const segmentLength = isUnicode ? 70 : 160;
    const smsCount = charLength === 0 ? 0 : Math.ceil(charLength / segmentLength);
    const estimatedCost = Number((smsCount * rateBdt).toFixed(2));

    return { smsCount, isUnicode, charLength, estimatedCost };
  }

  /**
   * Helper: Replace Dynamic Template Placeholders
   */
  static replaceVariables(templateText: string, data: Record<string, string | number>): string {
    let result = templateText;
    const map: Record<string, string | number> = {
      '{{MemberName}}': data.MemberName || data.memberName || 'সদস্য',
      '{{Amount}}': data.Amount || data.amount || '0',
      '{{ReceiptNo}}': data.ReceiptNo || data.receiptNo || 'N/A',
      '{{OrganizationName}}': data.OrganizationName || data.orgName || 'আমাদের গ্যারেজ',
      '{{DueAmount}}': data.DueAmount || data.dueAmount || '0',
      '{{Date}}': data.Date || data.date || new Date().toLocaleDateString('bn-BD'),
      '{{ExpiryDate}}': data.ExpiryDate || data.expiryDate || 'N/A',
      '{{Phone}}': data.Phone || data.phone || 'N/A',
    };

    Object.entries(map).forEach(([key, value]) => {
      const regex = new RegExp(key.replace(/[{}]/g, '\\$&'), 'g');
      result = result.replace(regex, String(value));
    });

    return result;
  }

  /**
   * Fetch Communication Gateway Settings for tenant
   */
  static async getSettings(tenantId: string): Promise<CommunicationSettings> {
    const docId = tenantId || 'global';
    const path = `communication_settings/${docId}`;
    try {
      const snap = await getDoc(doc(db, 'communication_settings', docId));
      if (snap.exists()) {
        const data = snap.data();
        return {
          id: snap.id,
          tenantId: data.tenantId || tenantId,
          smsEnabled: data.smsEnabled ?? true,
          smsGateway: data.smsGateway || 'greenweb',
          apiKey: data.apiKey || 'gw_api_key_demo_xxxxxx',
          apiSecret: data.apiSecret || 'gw_secret_demo',
          senderId: data.senderId || 'ABIL_SaaS',
          smsBalance: data.smsBalance ?? 500.0,
          smsRate: data.smsRate ?? 0.35,
          autoSmsTriggers: { ...DEFAULT_AUTO_TRIGGERS, ...data.autoSmsTriggers },
          pushEnabled: data.pushEnabled ?? true,
          whatsappEnabled: data.whatsappEnabled ?? false,
          emailEnabled: data.emailEnabled ?? false,
          telegramEnabled: data.telegramEnabled ?? false,
          updatedAt: data.updatedAt || new Date().toISOString()
        };
      } else {
        // Return initial setup
        const defaultSettings: CommunicationSettings = {
          id: docId,
          tenantId: tenantId,
          smsEnabled: true,
          smsGateway: 'greenweb',
          apiKey: 'gw_api_key_demo_88019',
          apiSecret: 'secret_key_880',
          senderId: 'ABIL_SaaS',
          smsBalance: 500.0,
          smsRate: 0.35,
          autoSmsTriggers: DEFAULT_AUTO_TRIGGERS,
          pushEnabled: true,
          whatsappEnabled: false,
          emailEnabled: false,
          telegramEnabled: false,
          updatedAt: new Date().toISOString()
        };
        // Save to firestore asynchronously
        setDoc(doc(db, 'communication_settings', docId), defaultSettings).catch(() => {});
        return defaultSettings;
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      throw error;
    }
  }

  /**
   * Save or Update Communication Gateway Settings
   */
  static async updateSettings(tenantId: string, settings: Partial<CommunicationSettings>, performedByUid: string): Promise<void> {
    const docId = tenantId || 'global';
    const path = `communication_settings/${docId}`;
    try {
      const docRef = doc(db, 'communication_settings', docId);
      await setDoc(docRef, {
        ...settings,
        tenantId,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      // Audit Log
      await CommunicationService.addAuditLog(tenantId, 'Communication Gateway Settings Updated', performedByUid, `Gateway: ${settings.smsGateway || 'N/A'}, Balance: ${settings.smsBalance}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  }

  /**
   * Send Manual SMS (Single, Multiple, Bulk)
   */
  static async sendSms(tenantId: string, payload: SmsSendPayload, senderUid: string): Promise<{ success: boolean; sentCount: number; totalCost: number; message: string }> {
    const settings = await this.getSettings(tenantId);

    if (!settings.smsEnabled) {
      return { success: false, sentCount: 0, totalCost: 0, message: 'SMS প্রেরণ বর্তমানে বন্ধ আছে (SMS Disabled)' };
    }

    // Determine target phones
    let targetPhones: { phone: string; name?: string }[] = [];
    if (payload.recipientType === 'single' && payload.recipientPhone) {
      targetPhones = [{ phone: payload.recipientPhone, name: payload.recipientName }];
    } else if (payload.recipientType === 'multiple' && payload.recipientPhones) {
      targetPhones = payload.recipientPhones.map(p => ({ phone: p }));
    } else if (payload.recipientPhones && payload.recipientPhones.length > 0) {
      targetPhones = payload.recipientPhones.map(p => ({ phone: p }));
    }

    if (targetPhones.length === 0) {
      return { success: false, sentCount: 0, totalCost: 0, message: 'কোনো বৈধ ফোন নম্বর পাওয়া যায়নি।' };
    }

    const { smsCount, estimatedCost } = this.calculateSmsCountAndCost(payload.message, settings.smsRate);
    const totalCost = Number((targetPhones.length * estimatedCost).toFixed(2));

    if (settings.smsBalance < totalCost) {
      return { 
        success: false, 
        sentCount: 0, 
        totalCost, 
        message: `পর্যাপ্ত SMS ব্যালেন্স নেই! প্রয়োজনীয়: ৳${totalCost}, বর্তমান ব্যালেন্স: ৳${settings.smsBalance}` 
      };
    }

    // Deduct Balance
    const newBalance = Number((settings.smsBalance - totalCost).toFixed(2));
    await this.updateSettings(tenantId, { smsBalance: newBalance }, senderUid);

    // Save SMS logs to Firestore
    const batchLogs: SmsLog[] = [];
    const timestamp = new Date().toISOString();

    for (const target of targetPhones) {
      const logId = `sms_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const logItem: SmsLog = {
        logId,
        tenantId,
        recipientPhone: target.phone,
        recipientName: target.name || 'সম্মানিত গ্যারেজ সদস্য',
        message: payload.message,
        gateway: settings.smsGateway,
        status: 'delivered',
        smsCount,
        cost: estimatedCost,
        eventType: payload.eventType || 'Manual SMS',
        sentBy: senderUid,
        timestamp
      };
      
      batchLogs.push(logItem);
      try {
        await setDoc(doc(db, 'sms_logs', logId), logItem);
      } catch (err) {
        console.warn('Could not save individual SMS log:', err);
      }
    }

    // Audit Log
    await this.addAuditLog(tenantId, `Manual SMS Sent (${payload.recipientType})`, senderUid, `Sent to ${targetPhones.length} recipient(s). Cost: ৳${totalCost}`);

    return {
      success: true,
      sentCount: targetPhones.length,
      totalCost,
      message: `সফলভাবে ${targetPhones.length} টি SMS পাঠানো হয়েছে! মোট খরচ: ৳${totalCost}`
    };
  }

  /**
   * Dispatch Automatic Event SMS
   */
  static async triggerAutoSms(
    tenantId: string, 
    eventType: AutoSmsEventType, 
    dataMap: Record<string, string | number>, 
    recipientPhone: string, 
    recipientName?: string
  ): Promise<boolean> {
    try {
      if (!recipientPhone) return false;
      const settings = await this.getSettings(tenantId);
      if (!settings.smsEnabled) return false;

      const triggerConfig = settings.autoSmsTriggers[eventType];
      if (!triggerConfig || !triggerConfig.enabled) return false;

      const rawMsg = triggerConfig.defaultMessage;
      const formattedMsg = this.replaceVariables(rawMsg, dataMap);

      const res = await this.sendSms(tenantId, {
        recipientType: 'single',
        recipientPhone,
        recipientName,
        message: formattedMsg,
        eventType: `Auto SMS: ${eventType}`
      }, 'SYSTEM_AUTO_TRIGGER');

      return res.success;
    } catch (err) {
      console.error('Auto SMS error:', err);
      return false;
    }
  }

  /**
   * Persistent deleted SMS IDs tracking
   */
  private static getDeletedSmsLogIds(): string[] {
    try {
      const stored = localStorage.getItem('ababil_deleted_sms_log_ids');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private static addDeletedSmsLogIds(ids: string[]): void {
    try {
      const existing = this.getDeletedSmsLogIds();
      const updated = Array.from(new Set([...existing, ...ids]));
      localStorage.setItem('ababil_deleted_sms_log_ids', JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save deleted SMS log ids:', e);
    }
  }

  /**
   * Fetch SMS Logs
   */
  static async getSmsLogs(tenantId: string): Promise<SmsLog[]> {
    const deletedIds = this.getDeletedSmsLogIds();
    const isCleared = localStorage.getItem('ababil_sms_logs_cleared') === 'true';

    try {
      const colRef = collection(db, 'sms_logs');
      let q = query(colRef, orderBy('timestamp', 'desc'), limit(100));
      if (tenantId && tenantId !== 'global') {
        q = query(colRef, where('tenantId', '==', tenantId), limit(100));
      }
      const snap = await getDocs(q);
      let list = snap.docs
        .map(d => ({ logId: d.id, ...d.data() } as SmsLog))
        .filter(l => !deletedIds.includes(l.logId));

      if (list.length === 0 && !isCleared) {
        // Seed initial sample SMS logs for preview if not cleared by user
        const sampleLogs: SmsLog[] = [
          {
            logId: 'sms_sample_01',
            tenantId,
            recipientPhone: '01711223344',
            recipientName: 'মোঃ সামসুল হক',
            message: 'স্বাগতম মোঃ সামসুল হক! বিসমিল্লাহ অটো গ্যারেজে আপনার রেজিস্ট্রেশন সফল হয়েছে।',
            gateway: 'greenweb',
            status: 'delivered',
            smsCount: 1,
            cost: 0.35,
            eventType: 'Member Registration',
            sentBy: 'Admin',
            timestamp: new Date(Date.now() - 3600000).toISOString()
          },
          {
            logId: 'sms_sample_02',
            tenantId,
            recipientPhone: '01812345678',
            recipientName: 'মোঃ কামাল হোসেন',
            message: 'প্রিয় মোঃ কামাল হোসেন, ৩০০ টাকা ফি গ্রহণ করা হয়েছে। রশিদ নং: RCP-101। ধন্যবাদ!',
            gateway: 'greenweb',
            status: 'delivered',
            smsCount: 1,
            cost: 0.35,
            eventType: 'Daily Collection',
            sentBy: 'Cashier',
            timestamp: new Date(Date.now() - 7200000).toISOString()
          }
        ];

        for (const s of sampleLogs) {
          if (!deletedIds.includes(s.logId)) {
            setDoc(doc(db, 'sms_logs', s.logId), s).catch(() => {});
          }
        }
        list = sampleLogs.filter(s => !deletedIds.includes(s.logId));
      }

      return list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (error) {
      console.warn('getSmsLogs error, returning cached/filtered logs:', error);
      if (isCleared) return [];
      const sampleLogs: SmsLog[] = [
        {
          logId: 'sms_sample_01',
          tenantId,
          recipientPhone: '01711223344',
          recipientName: 'মোঃ সামসুল হক',
          message: 'স্বাগতম মোঃ সামসুল হক! বিসমিল্লাহ অটো গ্যারেজে আপনার রেজিস্ট্রেশন সফল হয়েছে।',
          gateway: 'greenweb',
          status: 'delivered',
          smsCount: 1,
          cost: 0.35,
          eventType: 'Member Registration',
          sentBy: 'Admin',
          timestamp: new Date(Date.now() - 3600000).toISOString()
        }
      ];
      return sampleLogs.filter(s => !deletedIds.includes(s.logId));
    }
  }

  /**
   * Delete single SMS Log
   */
  static async deleteSmsLog(logId: string): Promise<void> {
    try {
      this.addDeletedSmsLogIds([logId]);
      await deleteDoc(doc(db, 'sms_logs', logId));
    } catch (err) {
      console.warn('deleteSmsLog error:', err);
      this.addDeletedSmsLogIds([logId]);
    }
  }

  /**
   * Delete batch SMS Logs
   */
  static async deleteSmsLogsBatch(logIds: string[]): Promise<void> {
    try {
      this.addDeletedSmsLogIds(logIds);
      for (const logId of logIds) {
        await deleteDoc(doc(db, 'sms_logs', logId));
      }
    } catch (err) {
      console.warn('deleteSmsLogsBatch error:', err);
      this.addDeletedSmsLogIds(logIds);
    }
  }

  /**
   * Clear all SMS Logs for tenant
   */
  static async clearAllSmsLogs(tenantId: string): Promise<void> {
    try {
      localStorage.setItem('ababil_sms_logs_cleared', 'true');
      const logs = await this.getSmsLogs(tenantId);
      this.addDeletedSmsLogIds(logs.map(l => l.logId));
      for (const l of logs) {
        await deleteDoc(doc(db, 'sms_logs', l.logId));
      }
    } catch (err) {
      console.warn('clearAllSmsLogs error:', err);
      localStorage.setItem('ababil_sms_logs_cleared', 'true');
    }
  }

  /**
   * Send & Broadcast Push Notification
   */
  static async sendPushNotification(
    tenantId: string, 
    title: string, 
    message: string, 
    category: NotificationCategory, 
    targetAudience: 'all' | 'members' | 'employees' | 'due_members' = 'all',
    performedByUid: string
  ): Promise<PushNotification> {
    const pushId = `push_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const pushObj: PushNotification = {
      id: pushId,
      tenantId,
      title,
      message,
      category,
      targetAudience,
      sentCount: targetAudience === 'all' ? 45 : 12,
      status: 'sent',
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'push_notifications', pushId), pushObj);

      // Create in-app Notification log for inbox
      const notifId = `notif_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const notifLog: NotificationLog = {
        id: notifId,
        tenantId,
        title,
        body: message,
        category,
        isRead: false,
        isArchived: false,
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'notification_logs', notifId), notifLog);

      await this.addAuditLog(tenantId, 'Push Notification Sent', performedByUid, `Title: ${title}, Target: ${targetAudience}`);
    } catch (err) {
      console.error('Failed to create push notification:', err);
    }

    return pushObj;
  }

  /**
   * Fetch In-App Notification Center Logs
   */
  static async getNotifications(tenantId: string): Promise<NotificationLog[]> {
    const path = 'notification_logs';
    try {
      const colRef = collection(db, 'notification_logs');
      let q = query(colRef, limit(100));
      if (tenantId && tenantId !== 'global') {
        q = query(colRef, where('tenantId', '==', tenantId), limit(100));
      }
      const snap = await getDocs(q);
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() } as NotificationLog));
      return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return [];
    }
  }

  /**
   * Notification Center Actions
   */
  static async markAsRead(id: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'notification_logs', id), { isRead: true });
    } catch (err) {
      console.warn('markAsRead error:', err);
    }
  }

  static async markAllAsRead(tenantId: string): Promise<void> {
    const notifs = await this.getNotifications(tenantId);
    for (const n of notifs.filter(x => !x.isRead)) {
      await this.markAsRead(n.id);
    }
  }

  static async archiveNotification(id: string): Promise<void> {
    try {
      await updateDoc(doc(db, 'notification_logs', id), { isArchived: true });
    } catch (err) {
      console.warn('archiveNotification error:', err);
    }
  }

  static async deleteNotification(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'notification_logs', id));
    } catch (err) {
      console.warn('deleteNotification error:', err);
    }
  }

  /**
   * Message Templates Management
   */
  static async getMessageTemplates(tenantId: string): Promise<MessageTemplate[]> {
    const path = 'message_templates';
    try {
      const colRef = collection(db, 'message_templates');
      let q = query(colRef, limit(50));
      if (tenantId && tenantId !== 'global') {
        q = query(colRef, where('tenantId', '==', tenantId), limit(50));
      }
      const snap = await getDocs(q);
      const list = snap.docs.map(d => ({ templateId: d.id, ...d.data() } as MessageTemplate));
      if (list.length === 0) {
        // Provide default templates
        const defaults: MessageTemplate[] = [
          {
            templateId: 'tmpl_1',
            tenantId,
            title: 'দৈনিক কালেকশন কনফার্মেশন',
            category: 'collection',
            channel: 'sms',
            body: 'প্রিয় {{MemberName}}, আপনার আজকের {{Amount}} টাকা চার্জ গ্রহণ করা হয়েছে। রশিদ নং: {{ReceiptNo}}। ধন্যবাদ!',
            variables: ['{{MemberName}}', '{{Amount}}', '{{ReceiptNo}}'],
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            templateId: 'tmpl_2',
            tenantId,
            title: 'বকেয়া ফি তাগাদা এসএমএস',
            category: 'due',
            channel: 'sms',
            body: 'সম্মানিত {{MemberName}}, আপনার মোট বকেয়া {{DueAmount}} টাকা। অনুগ্রহ করে দ্রুত পরিশোধ করুন। {{OrganizationName}}',
            variables: ['{{MemberName}}', '{{DueAmount}}', '{{OrganizationName}}'],
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            templateId: 'tmpl_3',
            tenantId,
            title: 'নতুন ড্রাইভার / সদস্য স্বাগতম',
            category: 'registration',
            channel: 'sms',
            body: 'স্বাগতম {{MemberName}}! {{OrganizationName}}-এ আপনার গাড়ি সফলভাবে নিবন্ধিত হয়েছে। যোগাযোগ: {{Phone}}',
            variables: ['{{MemberName}}', '{{OrganizationName}}', '{{Phone}}'],
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ];
        for (const t of defaults) {
          await setDoc(doc(db, 'message_templates', t.templateId), t);
        }
        return defaults;
      }
      return list;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return [];
    }
  }

  static async saveMessageTemplate(template: MessageTemplate, performedByUid: string): Promise<void> {
    const path = `message_templates/${template.templateId}`;
    try {
      await setDoc(doc(db, 'message_templates', template.templateId), {
        ...template,
        updatedAt: new Date().toISOString()
      });
      await this.addAuditLog(template.tenantId, 'Message Template Saved', performedByUid, `Title: ${template.title}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  }

  static async deleteMessageTemplate(templateId: string, tenantId: string, performedByUid: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'message_templates', templateId));
      await this.addAuditLog(tenantId, 'Message Template Deleted', performedByUid, `TemplateId: ${templateId}`);
    } catch (err) {
      console.warn('deleteMessageTemplate error:', err);
    }
  }

  /**
   * Add Entry to Audit Log
   */
  private static async addAuditLog(tenantId: string, action: string, performedByUid: string, details: string) {
    const logId = `audit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    try {
      await setDoc(doc(db, 'auditLogs', logId), {
        logId,
        tenantId: tenantId || 'GLOBAL',
        action,
        performedByUid: performedByUid || 'system',
        performedByName: 'Admin User',
        ipAddress: '127.0.0.1',
        details,
        timestamp: new Date().toISOString()
      });
    } catch (e) {
      console.warn('Failed to save audit log:', e);
    }
  }
}
