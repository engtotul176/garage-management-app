/**
 * Bengali & English Number and Currency Formatting Utilities
 */

export const formatBDT = (amount: number): string => {
  return new Intl.NumberFormat('bn-BD', {
    style: 'currency',
    currency: 'BDT',
    maximumFractionDigits: 0,
  }).format(amount).replace('BDT', '৳');
};

export const formatBengaliNumber = (num: number | string): string => {
  const englishToBengaliDigits: { [key: string]: string } = {
    '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
    '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯'
  };
  return num.toString().replace(/\d/g, (d) => englishToBengaliDigits[d] || d);
};

export const formatDateBD = (dateStr: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('bn-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
