import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';

export function exportToExcel(data: Record<string, any>[], fileName: string = 'medifind_export.xlsx') {
  try {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    XLSX.writeFile(workbook, fileName);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    alert('Failed to generate Excel file. Please try again.');
  }
}

export function exportToPDF(
  title: string,
  headers: string[],
  rows: (string | number)[][],
  fileName: string = 'medifind_report.pdf'
) {
  try {
    const doc = new jsPDF();
    
    // Header title
    doc.setFontSize(18);
    doc.setTextColor(16, 185, 129); // Emerald color
    doc.text('Medifind - ' + title, 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleString()} | Medifind Pharmacy Portal`, 14, 28);
    
    // Simple table rendering
    let startY = 38;
    const colWidth = (180 / headers.length);
    
    // Draw Table Header
    doc.setFillColor(240, 253, 244);
    doc.rect(14, startY - 5, 180, 8, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(6, 78, 59);
    
    headers.forEach((header, index) => {
      doc.text(header.substring(0, 18), 16 + (index * colWidth), startY);
    });
    
    startY += 8;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 41, 59);
    
    // Draw Rows
    rows.forEach((row, rowIndex) => {
      if (startY > 280) {
        doc.addPage();
        startY = 20;
      }
      
      // Alternate background row
      if (rowIndex % 2 === 1) {
        doc.setFillColor(248, 250, 252);
        doc.rect(14, startY - 5, 180, 7, 'F');
      }
      
      row.forEach((cell, colIndex) => {
        const text = String(cell || '').substring(0, 22);
        doc.text(text, 16 + (colIndex * colWidth), startY);
      });
      startY += 7;
    });

    // Save document
    doc.save(fileName);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Failed to generate PDF document.');
  }
}
