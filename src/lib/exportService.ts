import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export interface ExportField {
  label: string;
  key: string;
  transform?: (val: any, record: any) => string;
}

/**
 * Filter items by general date range query.
 * Supporting ranges: Today, Last 7 Days, Last 30 Days, Last 90 Days, This Year
 */
export function filterByDateRange(data: any[], dateField: string, range: string, customStart?: string, customEnd?: string): any[] {
  if (!range || range === 'ALL' || range === 'All Time') return data;
  
  // Base date set to metadata: 2026-08-29T16:52:19-07:00
  const now = new Date("2026-08-29T16:52:19-07:00");
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date(now);
  endOfToday.setHours(23, 59, 59, 999);

  return data.filter(item => {
    const val = item[dateField];
    if (!val) return false;
    const recordDate = new Date(val);
    if (isNaN(recordDate.getTime())) return false;

    switch (range) {
      case 'Today': {
        return recordDate.getTime() >= startOfToday.getTime() && recordDate.getTime() <= endOfToday.getTime();
      }
      case 'Last 7 Days': {
        const start = new Date(startOfToday);
        start.setDate(start.getDate() - 7);
        return recordDate.getTime() >= start.getTime() && recordDate.getTime() <= endOfToday.getTime();
      }
      case 'Last 30 Days': {
        const start = new Date(startOfToday);
        start.setDate(start.getDate() - 30);
        return recordDate.getTime() >= start.getTime() && recordDate.getTime() <= endOfToday.getTime();
      }
      case 'Last 90 Days': {
        const start = new Date(startOfToday);
        start.setDate(start.getDate() - 90);
        return recordDate.getTime() >= start.getTime() && recordDate.getTime() <= endOfToday.getTime();
      }
      case 'This Year': {
        const start = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
        return recordDate.getTime() >= start.getTime() && recordDate.getTime() <= endOfToday.getTime();
      }
      case 'Custom Date Range': {
        if (!customStart || !customEnd) return true;
        const start = new Date(customStart);
        start.setHours(0, 0, 0, 0);
        const end = new Date(customEnd);
        end.setHours(23, 59, 59, 999);
        return recordDate.getTime() >= start.getTime() && recordDate.getTime() <= end.getTime();
      }
      default:
        return true;
    }
  });
}

/**
 * Clean & Format raw table data using the schema mapping.
 */
function extractRowsAndHeaders(fields: ExportField[], data: any[]): { headers: string[], rows: any[][] } {
  const headers = fields.map(f => f.label);
  const rows = data.map(record => {
    return fields.map(field => {
      const val = record[field.key];
      if (field.transform) {
        return field.transform(val, record);
      }
      if (val === undefined || val === null) {
        return 'N/A';
      }
      if (typeof val === 'object') {
        return Array.isArray(val) ? val.join(', ') : JSON.stringify(val);
      }
      return String(val);
    });
  });
  return { headers, rows };
}

/**
 * Standard trigger to download binary blob directly inside user browser.
 */
export function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * 1. CSV Generator
 */
export function exportCSV(title: string, fields: ExportField[], data: any[], filename: string): Blob {
  const { headers, rows } = extractRowsAndHeaders(fields, data);
  const csvContent = [
    headers.map(h => `"${h.replace(/"/g, '""')}"`).join(','),
    ...rows.map(row => row.map(cell => {
      const val = cell === null || cell === undefined ? '' : String(cell);
      return `"${val.replace(/"/g, '""').replace(/\n/g, ' ')}"`;
    }).join(','))
  ].join('\n');
  
  const blob = new Blob([`\ufeff${csvContent}`], { type: 'text/csv;charset=utf-8;' });
  triggerBlobDownload(blob, filename);
  return blob;
}

/**
 * 2. Excel (.xlsx) Generator
 */
export function exportExcel(title: string, fields: ExportField[], data: any[], filename: string): Blob {
  const { headers, rows } = extractRowsAndHeaders(fields, data);
  
  const worksheet = XLSX.utils.aoa_to_sheet([
    [`BRIZX INDIA - ${title}`],
    [`Export Date: ${new Date("2026-08-29T16:52:19-07:00").toLocaleString()}`],
    [`Record Count: ${data.length}`],
    [],
    headers,
    ...rows
  ]);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Dynamic Auto-fit Columns
  const maxCols = headers.length;
  const colWidths = [];
  for (let c = 0; c < maxCols; c++) {
    let maxLen = headers[c].length;
    for (let r = 0; r < rows.length; r++) {
      const val = rows[r][c];
      if (val !== undefined && val !== null) {
        maxLen = Math.max(maxLen, String(val).length);
      }
    }
    colWidths.push({ wch: Math.min(Math.max(maxLen + 3, 10), 50) });
  }
  worksheet['!cols'] = colWidths;

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  triggerBlobDownload(blob, filename);
  return blob;
}

/**
 * 3. PDF Generator
 */
export function exportPDF(title: string, fields: ExportField[], data: any[], filename: string): Blob {
  const { headers, rows } = extractRowsAndHeaders(fields, data);
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  
  // Blue accent banner
  doc.setFillColor(37, 99, 235); // BRIX India blue
  doc.rect(10, 10, 190, 8, 'F');
  
  doc.setTextColor(23, 32, 51);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('BRIZX INDIA', 10, 26);
  
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text('PREMIUM FRANCHISE MATCHMAKING NETWORK', 10, 31);
  
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`${title.toUpperCase()} REPORT`, 10, 42);
  
  doc.setTextColor(100, 116, 139);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text(`Generated On: ${new Date("2026-08-29T16:52:19-07:00").toLocaleString()}`, 10, 47);
  doc.text(`Record Count: ${data.length}`, 10, 51);
  
  doc.setDrawColor(226, 234, 244);
  doc.setLineWidth(0.4);
  doc.line(10, 55, 200, 55);

  autoTable(doc, {
    startY: 60,
    head: [headers],
    body: rows,
    theme: 'grid',
    headStyles: {
      fillColor: [37, 99, 235],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'left',
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [51, 65, 85],
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { top: 10, left: 10, right: 10, bottom: 20 },
    styles: {
      cellPadding: 2,
      lineColor: [226, 234, 244],
      lineWidth: 0.1,
    },
    didDrawPage: (pageData) => {
      const pageCount = doc.getNumberOfPages();
      doc.setDrawColor(226, 234, 244);
      doc.setLineWidth(0.4);
      doc.line(10, 280, 200, 280);
      
      doc.setTextColor(148, 163, 184);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.text('© 2026 BRIZX INDIA. Confidential Internal Administration Audit Log.', 10, 285);
      doc.text(`Page ${pageData.pageNumber} of ${pageCount}`, 190, 285, { align: 'right' });
    }
  });

  const blob = doc.output('blob');
  triggerBlobDownload(blob, filename);
  return blob;
}
