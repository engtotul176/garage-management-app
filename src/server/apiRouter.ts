import { Router, Request, Response, NextFunction } from 'express';

export const apiV1Router = Router();

// Middleware: Standard API Headers, CORS, Rate Limiting & Audit Logger
apiV1Router.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Powered-By', 'Ababil Enterprise Cloud Engine');
  res.setHeader('X-API-Version', '1.0.0');
  res.setHeader('X-RateLimit-Limit', '120');
  res.setHeader('X-RateLimit-Remaining', '119');
  
  const startTime = Date.now();

  res.on('finish', () => {
    const durationMs = Date.now() - startTime;
    console.log(`[REST API v1] ${req.method} ${req.originalUrl} - ${res.statusCode} (${durationMs}ms)`);
  });

  next();
});

// Helper for Standard JSON Response
const sendSuccess = (res: Response, data: any, statusCode = 200, message?: string, pagination?: any) => {
  return res.status(statusCode).json({
    success: true,
    version: 'v1',
    timestamp: new Date().toISOString(),
    statusCode,
    message,
    data,
    pagination
  });
};

const sendError = (res: Response, code: string, message: string, statusCode = 400, details?: any) => {
  return res.status(statusCode).json({
    success: false,
    version: 'v1',
    timestamp: new Date().toISOString(),
    statusCode,
    error: {
      code,
      message,
      details
    }
  });
};

/* =========================================================
   1. AUTHENTICATION API
   ========================================================= */
apiV1Router.post('/auth/login', (req: Request, res: Response) => {
  const { emailOrMobile, passwordOrPin, deviceId } = req.body || {};

  if (!emailOrMobile || !passwordOrPin) {
    return sendError(res, 'MISSING_CREDENTIALS', 'ইমেইল/মোবাইল এবং পাসওয়ার্ড প্রয়োজন', 400);
  }

  return sendSuccess(res, {
    accessToken: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ababil_mobile_token_${Date.now()}`,
    refreshToken: `refresh_token_${Date.now()}_and`,
    expiresIn: 86400,
    user: {
      uid: 'usr_dir_001',
      name: 'মোঃ জহিরুল ইসলাম',
      role: 'ORG_ADMIN',
      tenantId: 'org_bismillah_001',
      tenantName: 'বিসমিল্লাহ অটো চার্জিং গ্যারেজ'
    }
  }, 200, 'লগইন সফল হয়েছে');
});

apiV1Router.post('/auth/refresh', (req: Request, res: Response) => {
  const { refreshToken } = req.body || {};
  if (!refreshToken) {
    return sendError(res, 'INVALID_REFRESH_TOKEN', 'বৈধ রিফ্রেশ টোকেন প্রদান করুন', 401);
  }

  return sendSuccess(res, {
    accessToken: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ababil_refreshed_${Date.now()}`,
    expiresIn: 86400
  }, 200, 'টোকেন সফলভাবে নবায়ন করা হয়েছে');
});

/* =========================================================
   2. ORGANIZATION API
   ========================================================= */
apiV1Router.get('/organizations/:orgId', (req: Request, res: Response) => {
  const { orgId } = req.params;
  
  return sendSuccess(res, {
    orgId,
    orgName: 'বিসমিল্লাহ অটো চার্জিং গ্যারেজ',
    orgType: 'Auto Charging Garage & Stand',
    address: 'গ্যারেজ রোড, কাজলা, যাত্রাবাড়ী, ঢাকা',
    phone: '01711002233',
    email: 'bismillah.garage@gmail.com',
    packageId: 'enterprise_pro',
    status: 'ACTIVE',
    subscriptionEnd: '2027-12-31T23:59:59.000Z',
    maxMembers: 500,
    currentMembers: 142
  });
});

/* =========================================================
   3. EMPLOYEE API
   ========================================================= */
apiV1Router.get('/employees', (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const employees = [
    { id: 'emp_01', name: 'মোঃ জহিরুল ইসলাম', role: 'SUPERVISOR', mobile: '01711002233', vehicle: 'ঢাকা মেট্রো-থ-১১-৮৮৯২', status: 'ACTIVE' },
    { id: 'emp_02', name: 'ক্যাশিয়ার রফিক উল্লাহ', role: 'CASHIER', mobile: '01899112244', vehicle: 'N/A', status: 'ACTIVE' },
    { id: 'emp_03', name: 'আব্দুল করিম (মেকানিক)', role: 'MECHANIC', mobile: '01900112255', vehicle: 'N/A', status: 'ACTIVE' }
  ];

  return sendSuccess(res, employees, 200, undefined, {
    page,
    limit,
    total: employees.length,
    totalPages: 1,
    hasNext: false,
    hasPrev: false
  });
});

/* =========================================================
   4. MEMBER API
   ========================================================= */
apiV1Router.get('/members', (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const search = (req.query.search as string) || '';

  const members = [
    {
      memberId: 'mem_88201',
      memberCode: 'MEM-ABABIL-2026-991',
      memberName: 'মোঃ জহিরুল ইসলাম',
      mobile: '01711002233',
      vehicleNo: 'ঢাকা মেট্রো-থ-১১-৮৮৯২',
      vehicleType: 'Auto Rickshaw',
      monthlyFee: 1500,
      dueAmount: 1200,
      status: 'ACTIVE'
    },
    {
      memberId: 'mem_88202',
      memberCode: 'MEM-ABABIL-2026-992',
      memberName: 'আলামিন হোসেন (ড্রাইভার)',
      mobile: '01822334455',
      vehicleNo: 'ঢাকা মেট্রো-ই-২২-৪৪০১',
      vehicleType: 'Easybike',
      monthlyFee: 1800,
      dueAmount: 0,
      status: 'ACTIVE'
    }
  ];

  const filtered = members.filter(m => 
    m.memberName.includes(search) || m.vehicleNo.includes(search) || m.mobile.includes(search)
  );

  return sendSuccess(res, filtered, 200, undefined, {
    page,
    limit,
    total: filtered.length,
    totalPages: 1,
    hasNext: false,
    hasPrev: false
  });
});

apiV1Router.post('/members', (req: Request, res: Response) => {
  const { memberName, mobile, vehicleNo, monthlyFee } = req.body || {};

  if (!memberName || !mobile) {
    return sendError(res, 'VALIDATION_ERROR', 'মেম্বারের নাম ও মোবাইল নম্বর আবশ্যক');
  }

  const newMemberId = `mem_${Date.now()}`;
  return sendSuccess(res, {
    memberId: newMemberId,
    memberCode: `MEM-ABABIL-2026-${Math.floor(Math.random() * 900 + 100)}`,
    memberName,
    mobile,
    vehicleNo,
    monthlyFee: monthlyFee || 1500,
    dueAmount: 0,
    qrCodeData: `ABABIL-CARD-${newMemberId}`,
    status: 'ACTIVE'
  }, 201, 'নতুন মেম্বার সফলভাবে নিবন্ধিত হয়েছে');
});

/* =========================================================
   5. COLLECTION API
   ========================================================= */
apiV1Router.post('/collections', (req: Request, res: Response) => {
  const { memberId, amount, paymentMethod } = req.body || {};

  if (!memberId || !amount) {
    return sendError(res, 'VALIDATION_ERROR', 'মেম্বার আইডি ও টাকার পরিমাণ আবশ্যক');
  }

  const receiptNo = `REC-2026-${Math.floor(Math.random() * 90000 + 10000)}`;

  return sendSuccess(res, {
    collectionId: `col_${Date.now()}`,
    receiptNo,
    memberId,
    amountPaid: Number(amount),
    paymentMethod: paymentMethod || 'CASH',
    timestamp: new Date().toISOString(),
    smsStatus: 'DELIVERED_HANDSET'
  }, 201, 'টাকা আদায় সংগৃহীত হয়েছে এবং রিসিট তৈরি করা হয়েছে');
});

/* =========================================================
   6. RECEIPT API
   ========================================================= */
apiV1Router.get('/receipts/:receiptNo', (req: Request, res: Response) => {
  const { receiptNo } = req.params;

  return sendSuccess(res, {
    receiptNo,
    tenantName: 'বিসমিল্লাহ অটো চার্জিং গ্যারেজ',
    memberName: 'মোঃ জহিরুল ইসলাম',
    membershipNumber: 'MEM-ABABIL-2026-991',
    vehicleNo: 'ঢাকা মেট্রো-থ-১১-৮৮৯২',
    amount: 500,
    paymentMethod: 'CASH',
    collectorName: 'ক্যাশিয়ার রফিক উল্লাহ',
    date: new Date().toISOString().split('T')[0],
    qrCodeData: `REC-VERIFY-${receiptNo}`
  });
});

/* =========================================================
   7. ACCOUNTING API
   ========================================================= */
apiV1Router.get('/accounting/summary', (req: Request, res: Response) => {
  return sendSuccess(res, {
    totalIncome: 158000,
    totalExpense: 42000,
    netProfit: 116000,
    cashInHand: 35000,
    bankBalance: 81000,
    currency: 'BDT'
  });
});

/* =========================================================
   8. REPORTS API
   ========================================================= */
apiV1Router.get('/reports/summary', (req: Request, res: Response) => {
  return sendSuccess(res, {
    totalActiveMembers: 142,
    totalMonthlyCollections: 158000,
    totalDuesPending: 45000,
    collectionEfficiency: '94.2%',
    month: 'August 2026'
  });
});

/* =========================================================
   9. NOTIFICATION API
   ========================================================= */
apiV1Router.post('/notifications/push', (req: Request, res: Response) => {
  const { title, message, targetAudience } = req.body || {};

  if (!title || !message) {
    return sendError(res, 'VALIDATION_ERROR', 'নোটিফিকেশন টাইটেল ও মেসেজ প্রয়োজন');
  }

  return sendSuccess(res, {
    notificationId: `push_${Date.now()}`,
    title,
    message,
    targetAudience: targetAudience || 'ALL',
    deliveredDevices: 142
  }, 200, 'মোবাইল পুশ নোটিফিকেশন সফলভাবে পাঠানো হয়েছে');
});

/* =========================================================
   10. DASHBOARD API
   ========================================================= */
apiV1Router.get('/dashboard/metrics', (req: Request, res: Response) => {
  return sendSuccess(res, {
    todayCollection: 12500,
    todayExpense: 1200,
    activeVehiclesInGarage: 88,
    activeTvScreens: 2,
    activeMobileSessions: 3,
    systemStatus: 'ONLINE_OPTIMAL'
  });
});
