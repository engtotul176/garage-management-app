export type PaperSize = '58mm' | '80mm' | 'a4';
export type InvoiceType = 'monthly' | 'due' | 'advance' | 'reprint';
export type InvoiceStatus = 'paid' | 'partial' | 'unpaid';

export interface ReceiptRecord {
  id: string;
  receiptNo: string;
  tenantId: string;
  tenantName: string;
  memberId: string;
  memberName: string;
  memberPhone: string;
  membershipNumber: string;
  vehicleNo: string;
  chargingSlot?: string;
  date: string;
  time: string;
  chargeType: string;
  collectorName: string;
  paymentMethod: string;
  amount: number;
  due: number;
  advance: number;
  remarks?: string;
  qrCodeData: string;
  barcode: string;
  digitalSignatureUrl?: string;
  isReprint?: boolean;
  reprintCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface ReceiptTemplateConfig {
  id: string;
  tenantId: string;
  orgName: string;
  orgAddress: string;
  orgPhone: string;
  logoUrl: string;
  headerText: string;
  footerNote: string;
  termsAndConditions: string;
  showQrCode: boolean;
  showBarcode: boolean;
  showDigitalSignature: boolean;
  defaultPaperSize: PaperSize;
  updatedAt: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  amount: number;
}

export interface InvoiceRecord {
  id: string;
  invoiceNo: string;
  tenantId: string;
  tenantName: string;
  memberId: string;
  memberName: string;
  memberPhone: string;
  membershipNumber: string;
  vehicleNo?: string;
  invoiceType: InvoiceType;
  monthYear: string;
  items: InvoiceItem[];
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  advanceAmount: number;
  status: InvoiceStatus;
  generatedDate: string;
  dueDate: string;
  collectorName: string;
  qrCodeData: string;
  barcode: string;
  createdAt: string;
}

export interface PrintLogRecord {
  id: string;
  tenantId: string;
  documentType: 'receipt' | 'invoice';
  documentNo: string;
  action: 'print_58mm' | 'print_80mm' | 'print_a4' | 'pdf_download' | 'reprint' | 'share_whatsapp';
  printedBy: string;
  timestamp: string;
  details?: string;
}

export interface ReceiptFilterOptions {
  searchTerm: string;
  startDate: string;
  endDate: string;
  collectorName: string;
  paymentMethod: string;
  paperSizeFilter: string;
}
