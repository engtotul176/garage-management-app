import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  CheckCircle2, 
  Eye, 
  Filter 
} from 'lucide-react';
import { 
  IncomeRecord, 
  ExpenseRecord, 
  CashbookEntry, 
  BankAccount, 
  FinancialSummary 
} from '../../types/finance';

interface Props {
  summary: FinancialSummary;
  incomes: IncomeRecord[];
  expenses: ExpenseRecord[];
  cashEntries: CashbookEntry[];
  bankAccounts: BankAccount[];
  tenantName: string;
}

export const FinancialReportSystem: React.FC<Props> = ({
  summary,
  incomes,
  expenses,
  cashEntries,
  bankAccounts,
  tenantName
}) => {
  const [reportType, setReportType] = useState<
    'daily' | 'monthly' | 'yearly' | 'income' | 'expense' | 'cashbook' | 'pnl' | 'balance_sheet'
  >('pnl');

  const [filterMonth, setFilterMonth] = useState(new Date().toISOString().substring(0, 7)); // YYYY-MM
  const [filterYear, setFilterYear] = useState(new Date().getFullYear().toString());

  const formatTk = (amt: number) => `৳ ${amt.toLocaleString('bn-BD')}`;

  // Income Category Aggregation
  const incomeCategoryTotals: { [key: string]: number } = {};
  incomes.filter(i => !i.isDeleted).forEach(inc => {
    incomeCategoryTotals[inc.categoryName] = (incomeCategoryTotals[inc.categoryName] || 0) + inc.amount;
  });

  // Expense Category Aggregation
  const expenseCategoryTotals: { [key: string]: number } = {};
  expenses.filter(e => !e.isDeleted && e.status === 'approved').forEach(exp => {
    expenseCategoryTotals[exp.categoryName] = (expenseCategoryTotals[exp.categoryName] || 0) + exp.amount;
  });

  const totalIncomeAll = Object.values(incomeCategoryTotals).reduce((a, b) => a + b, 0);
  const totalExpenseAll = Object.values(expenseCategoryTotals).reduce((a, b) => a + b, 0);
  const netProfitLoss = totalIncomeAll - totalExpenseAll;

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    let csvData = `Report Type,${reportType}\nOrganization,${tenantName}\nGenerated Date,${new Date().toLocaleDateString('bn-BD')}\n\n`;

    if (reportType === 'pnl') {
      csvData += `Revenue Categories,Amount (TK)\n`;
      Object.entries(incomeCategoryTotals).forEach(([cat, val]) => {
        csvData += `"${cat}",${val}\n`;
      });
      csvData += `Total Revenue,${totalIncomeAll}\n\nExpense Categories,Amount (TK)\n`;
      Object.entries(expenseCategoryTotals).forEach(([cat, val]) => {
        csvData += `"${cat}",${val}\n`;
      });
      csvData += `Total Expense,${totalExpenseAll}\nNet Profit,${netProfitLoss}\n`;
    } else {
      csvData += `Total Income,${summary.monthlyIncome}\nTotal Expense,${summary.monthlyExpense}\nNet Profit,${summary.totalNetProfit}\n`;
    }

    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${tenantName}_Financial_Report_${reportType}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 text-white shadow-lg border border-emerald-800/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300 px-2.5 py-1 rounded-full bg-emerald-900/60 border border-emerald-700/50">
            Financial Statements & Audits
          </span>
          <h2 className="text-2xl font-bold mt-2">
            আর্থিক রিপোর্ট, P&L এবং ব্যালেন্স সামারি
          </h2>
          <p className="text-xs text-emerald-200 mt-1">
            দৈনিক, মাসিক, বার্ষিক আয়-ব্যয় বিবরণী, লাভ-ক্ষতি হিসাব ও অডিট স্টেটমেন্ট
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Excel / CSV এক্সপোর্ট</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>PDF / প্রিন্ট</span>
          </button>
        </div>
      </div>

      {/* Report Types Grid Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { id: 'pnl', label: 'লাভ-ক্ষতি (Profit & Loss)', icon: PieChart },
          { id: 'balance_sheet', label: 'ব্যালেন্স সামারি (Balance Sheet)', icon: FileText },
          { id: 'daily', label: 'দৈনিক রিপোর্ট (Daily)', icon: Calendar },
          { id: 'monthly', label: 'মাসিক রিপোর্ট (Monthly)', icon: Calendar },
          { id: 'income', label: 'আয় বিশ্লেষণ (Income)', icon: TrendingUp },
          { id: 'expense', label: 'ব্যয় বিশ্লেষণ (Expense)', icon: TrendingDown },
          { id: 'cashbook', label: 'ক্যাশবুক রিপোর্ট (Cashbook)', icon: FileText },
          { id: 'yearly', label: 'বার্ষিক সামারি (Yearly)', icon: Calendar }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setReportType(tab.id as any)}
              className={`p-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                reportType === tab.id
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* REPORT CONTENT VIEW (PRINTABLE AREA) */}
      <div id="printable-report" className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        
        {/* Report Official Letterhead Header */}
        <div className="text-center border-b border-slate-200 dark:border-slate-800 pb-4 space-y-1">
          <h2 className="text-xl font-black text-slate-900 dark:text-slate-100 uppercase tracking-wide">
            {tenantName}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enterprise Financial & Accounting Report
          </p>
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-bold mt-2">
            {reportType === 'pnl' && 'লাভ-ক্ষতি বিবরণী (Profit & Loss Statement)'}
            {reportType === 'balance_sheet' && 'ব্যালেন্স সামারি (Balance Sheet Statement)'}
            {reportType === 'daily' && 'দৈনিক আর্থিক প্রতিবেদন (Daily Summary Report)'}
            {reportType === 'monthly' && `মাসিক আর্থিক প্রতিবেদন (${filterMonth})`}
            {reportType === 'income' && 'আয়ের বিশদ বিবরণী (Income Breakdown)'}
            {reportType === 'expense' && 'ব্যয়ের বিশদ বিবরণী (Expense Breakdown)'}
            {reportType === 'cashbook' && 'ক্যাশবুক ও নগদ খতিয়ান বিবরণী'}
            {reportType === 'yearly' && `বার্ষিক আর্থিক প্রতিবেদন (${filterYear})`}
          </span>
        </div>

        {/* PROFIT & LOSS STATEMENT */}
        {reportType === 'pnl' && (
          <div className="space-y-6">
            
            {/* Revenue / Income Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 pb-1 border-b border-emerald-200">
                ১. অর্জিত রাজস্ব ও আয় (Operating Revenue)
              </h4>
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800 font-bold text-slate-600 dark:text-slate-300">
                    <th className="p-2 text-left">আয়ের খাত (Revenue Category)</th>
                    <th className="p-2 text-right">টাকার পরিমাণ (TK)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {Object.entries(incomeCategoryTotals).map(([cat, val]) => (
                    <tr key={cat}>
                      <td className="p-2 font-semibold text-slate-800 dark:text-slate-200">{cat}</td>
                      <td className="p-2 text-right font-bold text-emerald-600">{formatTk(val)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-emerald-50 dark:bg-emerald-950/40 font-bold">
                    <td className="p-2 text-emerald-800 dark:text-emerald-300">মোট অর্জিত আয়:</td>
                    <td className="p-2 text-right text-emerald-700 dark:text-emerald-300 text-sm">{formatTk(totalIncomeAll)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Operating Expense Table */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400 pb-1 border-b border-rose-200">
                ২. পরিচালন ও প্রশাসনিক ব্যয় (Operating Expense)
              </h4>
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800 font-bold text-slate-600 dark:text-slate-300">
                    <th className="p-2 text-left">ব্যয়ের খাত (Expense Category)</th>
                    <th className="p-2 text-right">টাকার পরিমাণ (TK)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {Object.entries(expenseCategoryTotals).map(([cat, val]) => (
                    <tr key={cat}>
                      <td className="p-2 font-semibold text-slate-800 dark:text-slate-200">{cat}</td>
                      <td className="p-2 text-right font-bold text-rose-600">{formatTk(val)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-rose-50 dark:bg-rose-950/40 font-bold">
                    <td className="p-2 text-rose-800 dark:text-rose-300">মোট পরিচালন ব্যয়:</td>
                    <td className="p-2 text-right text-rose-700 dark:text-rose-300 text-sm">{formatTk(totalExpenseAll)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Net Profit / Loss Calculation Box */}
            <div className={`p-4 rounded-xl border flex items-center justify-between text-sm font-bold ${
              netProfitLoss >= 0
                ? 'bg-emerald-100 border-emerald-300 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-200'
                : 'bg-rose-100 border-rose-300 text-rose-900 dark:bg-rose-950 dark:text-rose-200'
            }`}>
              <span>সর্বমোট নিট লাভ / ক্ষতি (Net Operating Profit):</span>
              <span className="text-xl font-black">{formatTk(netProfitLoss)}</span>
            </div>

          </div>
        )}

        {/* BALANCE SHEET SUMMARY */}
        {reportType === 'balance_sheet' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Assets */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
              <h4 className="text-sm font-bold text-emerald-700 dark:text-emerald-400 border-b pb-2">
                সম্পদসমূহ (Current Assets)
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>নগদ ক্যাশ গচ্ছিত (Cash):</span>
                  <span className="font-bold">{formatTk(summary.currentCashBalance)}</span>
                </div>
                <div className="flex justify-between">
                  <span>ব্যাংক স্থিতি (Bank Accounts):</span>
                  <span className="font-bold">{formatTk(summary.currentBankBalance)}</span>
                </div>
                <div className="flex justify-between">
                  <span>চালকদের বকেয়া দাবি (Member Dues):</span>
                  <span className="font-bold">{formatTk(summary.totalDueAmount)}</span>
                </div>
                <div className="pt-2 border-t font-bold text-sm flex justify-between text-emerald-600">
                  <span>মোট চলতি সম্পদ:</span>
                  <span>{formatTk(summary.currentCashBalance + summary.currentBankBalance + summary.totalDueAmount)}</span>
                </div>
              </div>
            </div>

            {/* Liabilities & Equity */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
              <h4 className="text-sm font-bold text-rose-700 dark:text-rose-400 border-b pb-2">
                দায় ও মূলধন (Liabilities & Reserves)
              </h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span>চালকদের অগ্রিম আমানত (Member Advance):</span>
                  <span className="font-bold">{formatTk(summary.totalAdvanceAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>সঞ্চিত লাভ (Retained Net Profit):</span>
                  <span className="font-bold text-emerald-600">{formatTk(summary.totalNetProfit)}</span>
                </div>
                <div className="pt-2 border-t font-bold text-sm flex justify-between text-purple-600">
                  <span>মোট দায় ও ইক্যুইটি:</span>
                  <span>{formatTk(summary.totalAdvanceAmount + summary.totalNetProfit)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DEFAULT SUMMARY VIEW FOR OTHER REPORTS */}
        {reportType !== 'pnl' && reportType !== 'balance_sheet' && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200">
                <span className="text-xs text-slate-500">মোট আয়</span>
                <p className="text-lg font-bold text-emerald-600">{formatTk(summary.monthlyIncome)}</p>
              </div>
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200">
                <span className="text-xs text-slate-500">মোট ব্যয়</span>
                <p className="text-lg font-bold text-rose-600">{formatTk(summary.monthlyExpense)}</p>
              </div>
              <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200">
                <span className="text-xs text-slate-500">নিট উদ্বৃত্ত</span>
                <p className="text-lg font-bold text-sky-600">{formatTk(summary.totalNetProfit)}</p>
              </div>
            </div>

            <p className="text-xs text-slate-500 text-center py-4">
              বিশদ লেনদেনের জন্য খতিয়ান বা ক্যাশবুক জার্নাল দেখুন।
            </p>
          </div>
        )}

        {/* Report Footer Signatures */}
        <div className="pt-12 grid grid-cols-3 gap-4 text-center text-xs font-semibold text-slate-600 dark:text-slate-400">
          <div>
            <div className="border-t border-slate-300 dark:border-slate-700 pt-1">ক্যাশিয়ার / অ্যাকাউন্ট্যান্ট</div>
          </div>
          <div>
            <div className="border-t border-slate-300 dark:border-slate-700 pt-1">অডিট কর্মকর্তা</div>
          </div>
          <div>
            <div className="border-t border-slate-300 dark:border-slate-700 pt-1">ব্যবস্থাপনা পরিচালক / এডমিন</div>
          </div>
        </div>

      </div>

    </div>
  );
};
