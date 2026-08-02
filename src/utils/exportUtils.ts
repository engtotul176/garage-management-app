import jsPDF from 'jspdf';

export interface ExportDataConfig {
  title: string;
  subtitle?: string;
  tenantName?: string;
  generatedBy?: string;
  headers: string[];
  keys: string[];
  data: any[];
  totals?: Record<string, number | string>;
}

export class ExportUtils {
  /**
   * Export Table Data to CSV with UTF-8 BOM for perfect Bengali font support in Excel
   */
  static exportToCSV(config: ExportDataConfig) {
    const { title, headers, keys, data, totals } = config;
    const now = new Date().toLocaleString('bn-BD');

    let csvContent = '\uFEFF'; // UTF-8 Byte Order Mark for Excel
    csvContent += `"${title}"\n`;
    if (config.tenantName) csvContent += `"প্রতিষ্ঠান: ${config.tenantName}"\n`;
    csvContent += `"রিপোর্ট তৈরীর তারিখ: ${now}"\n\n`;

    // Headers
    csvContent += headers.map(h => `"${h.replace(/"/g, '""')}"`).join(',') + '\n';

    // Rows
    data.forEach(row => {
      const line = keys.map(k => {
        const val = row[k] !== undefined && row[k] !== null ? String(row[k]) : '';
        return `"${val.replace(/"/g, '""')}"`;
      }).join(',');
      csvContent += line + '\n';
    });

    // Totals row if present
    if (totals) {
      csvContent += '\n';
      const totalLine = keys.map((k, idx) => {
        if (idx === 0) return '"সর্বমোট / Total"';
        const val = totals[k] !== undefined ? String(totals[k]) : '';
        return `"${val.replace(/"/g, '""')}"`;
      }).join(',');
      csvContent += totalLine + '\n';
    }

    // Download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const fileName = `${title.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0,10)}.csv`;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Export to PDF document
   */
  static exportToPDF(config: ExportDataConfig) {
    const doc = new jsPDF('p', 'mm', 'a4');
    const { title, subtitle, tenantName, generatedBy, headers, keys, data, totals } = config;

    let y = 15;

    // Header
    doc.setFontSize(16);
    doc.text(tenantName || 'আবাবিল স্মার্ট এন্টারপ্রাইজ অ্যাকাউন্টস', 14, y);
    y += 7;

    doc.setFontSize(12);
    doc.text(title, 14, y);
    y += 6;

    if (subtitle) {
      doc.setFontSize(9);
      doc.text(subtitle, 14, y);
      y += 5;
    }

    doc.setFontSize(8);
    doc.text(`তৈরীর সময়: ${new Date().toLocaleString()} | প্রস্তুতকারক: ${generatedBy || 'System Admin'}`, 14, y);
    y += 8;

    // Draw Divider
    doc.setLineWidth(0.3);
    doc.line(14, y, 196, y);
    y += 6;

    // Table Headers
    const startX = 14;
    const colWidth = (196 - 14) / headers.length;

    doc.setFillColor(240, 242, 245);
    doc.rect(startX, y, 182, 7, 'F');
    doc.setFontSize(8);

    headers.forEach((h, i) => {
      doc.text(h, startX + (i * colWidth) + 2, y + 5);
    });
    y += 9;

    // Data Rows
    data.slice(0, 35).forEach((row, rowIndex) => {
      if (y > 270) {
        doc.addPage();
        y = 15;
      }

      if (rowIndex % 2 === 1) {
        doc.setFillColor(248, 250, 252);
        doc.rect(startX, y - 2, 182, 6, 'F');
      }

      keys.forEach((k, colIndex) => {
        const rawVal = row[k] !== undefined && row[k] !== null ? String(row[k]) : '-';
        const displayVal = rawVal.length > 20 ? rawVal.substring(0, 18) + '..' : rawVal;
        doc.text(displayVal, startX + (colIndex * colWidth) + 2, y + 2);
      });

      y += 6;
    });

    // Totals line
    if (totals) {
      y += 2;
      doc.setLineWidth(0.2);
      doc.line(14, y, 196, y);
      y += 5;

      keys.forEach((k, colIndex) => {
        if (colIndex === 0) {
          doc.text('সর্বমোট:', startX + 2, y);
        } else if (totals[k] !== undefined) {
          doc.text(String(totals[k]), startX + (colIndex * colWidth) + 2, y);
        }
      });
    }

    // Footer
    doc.setFontSize(7);
    doc.text('আবাবিল ক্লাউড সফটওয়্যার প্ল্যাটফর্ম - স্বত্ব সংরক্ষিত ২০২৬', 14, 285);

    const fileName = `${title.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0,10)}.pdf`;
    doc.save(fileName);
  }

  /**
   * Trigger Printable Window View
   */
  static printReport(config: ExportDataConfig) {
    const { title, tenantName, generatedBy, headers, keys, data, totals } = config;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const rowsHtml = data.map((row, idx) => `
      <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
        ${keys.map(k => `<td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">${row[k] !== undefined && row[k] !== null ? row[k] : '-'}</td>`).join('')}
      </tr>
    `).join('');

    const totalsHtml = totals ? `
      <tr style="font-weight: bold; background-color: #f1f5f9; border-top: 2px solid #cbd5e1;">
        <td style="padding: 8px;">সর্বমোট (Total)</td>
        ${keys.slice(1).map(k => `<td style="padding: 8px;">${totals[k] !== undefined ? totals[k] : ''}</td>`).join('')}
      </tr>
    ` : '';

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: 'SolaimanLipi', Arial, sans-serif; margin: 20px; color: #1e293b; }
            .header { text-align: center; border-bottom: 2px solid #0284c7; padding-bottom: 12px; margin-bottom: 20px; }
            .title { font-size: 20px; font-weight: bold; color: #0f172a; margin: 0; }
            .subtitle { font-size: 14px; color: #0284c7; margin-top: 4px; }
            .meta { font-size: 11px; color: #64748b; margin-top: 8px; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 12px; }
            th { background-color: #0284c7; color: white; text-align: left; padding: 8px; font-weight: 600; }
            .footer { margin-top: 30px; font-size: 10px; text-align: center; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 10px; }
            @media print {
              button { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 class="title">${tenantName || 'আবাবিল স্মার্ট এন্টারপ্রাইজ সফটওয়্যার'}</h1>
            <div class="subtitle">${title}</div>
            <div class="meta">প্রস্তুতকাল: ${new Date().toLocaleString('bn-BD')} | ইউজার: ${generatedBy || 'এডমিন'}</div>
          </div>
          <table>
            <thead>
              <tr>
                ${headers.map(h => `<th>${h}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
              ${totalsHtml}
            </tbody>
          </table>
          <div class="footer">
            আবাবিল ক্লাউড সাশ প্ল্যাটফর্ম রিপোটিং ইঞ্জিন | স্বত্ব © ২০২৬
          </div>
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
  }
}
