import React from 'react';
import { Download, FileSpreadsheet, FileText, BarChart, Database } from 'lucide-react';
import { PharmacyStockItem, PharmacyInvoice } from '../../types';
import { exportToExcel, exportToPDF } from '../../utils/exportUtils';

interface DataExportViewProps {
  stockItems: PharmacyStockItem[];
  invoices: PharmacyInvoice[];
}

export const DataExportView: React.FC<DataExportViewProps> = ({ stockItems = [], invoices = [] }) => {
  const safeStockItems = stockItems || [];
  const safeInvoices = invoices || [];
  
  const handleExportStockExcel = () => {
    const data = safeStockItems.map((s) => ({
      'Medicine Name': s.medicine.name,
      'Brand': s.medicine.brand,
      'Category': s.medicine.category,
      'Batch Number': s.batchNumber,
      'Expiry Date': s.expiryDate,
      'Quantity in Stock': s.quantityInStock,
      'Unit Price (INR)': s.medicine.unitPrice,
      'MRP (INR)': s.medicine.mrp,
    }));
    exportToExcel(data, 'Medifind_Pharmacy_Stock_Master.xlsx');
  };

  const handleExportStockPDF = () => {
    const headers = ['Medicine Name', 'Brand', 'Category', 'Batch', 'Expiry', 'Stock', 'MRP (₹)'];
    const rows = safeStockItems.map((s) => [
      s.medicine.name,
      s.medicine.brand,
      s.medicine.category,
      s.batchNumber,
      s.expiryDate,
      s.quantityInStock,
      `₹ ${s.medicine.mrp}`,
    ]);
    exportToPDF('Apollo Pharmacy Master Inventory Report', headers, rows, 'Pharmacy_Stock_Report.pdf');
  };

  const handleExportSalesExcel = () => {
    const data = safeInvoices.map((inv) => ({
      'Invoice Number': inv.invoiceNumber,
      'Date': inv.date,
      'Customer Name': inv.customerName,
      'Customer Phone': inv.customerPhone,
      'Payment Mode': inv.paymentMode,
      'Subtotal (INR)': inv.subtotal,
      'GST Tax (INR)': inv.taxAmount,
      'Total Amount (INR)': inv.totalAmount,
    }));
    exportToExcel(data, 'Medifind_Pharmacy_Sales_Report.xlsx');
  };

  const handleExportSalesPDF = () => {
    const headers = ['Invoice #', 'Date', 'Customer Name', 'Payment Mode', 'Total Amount (₹)'];
    const rows = safeInvoices.map((inv) => [
      inv.invoiceNumber,
      inv.date,
      inv.customerName,
      inv.paymentMode,
      `₹ ${inv.totalAmount.toFixed(2)}`,
    ]);
    exportToPDF('Apollo Pharmacy Billing & Sales Audit Trail', headers, rows, 'Pharmacy_Sales_Report.pdf');
  };

  return (
    <div className="space-y-6 text-xs">
      
      <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-900 text-sm mb-1">Reports & Master Data Export Terminal</h3>
        <p className="text-slate-500 text-xs">
          Export store stock movement, GST sales registers, and customer billing histories in XLS or PDF
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Card 1: Master Inventory Export */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Master Medicine Stock Register</h4>
              <p className="text-slate-500 text-[11px]">{stockItems.length} Active SKUs in Store Database</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleExportStockExcel}
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
            >
              <FileSpreadsheet className="w-4 h-4" /> Export Excel (.XLSX)
            </button>
            <button
              onClick={handleExportStockPDF}
              className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
            >
              <FileText className="w-4 h-4" /> Export PDF Report
            </button>
          </div>
        </div>

        {/* Card 2: Sales & Invoices Export */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
              <BarChart className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">GST Billing & Sales Audit Trail</h4>
              <p className="text-slate-500 text-[11px]">{invoices.length} Verified Counter & Online Invoices</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleExportSalesExcel}
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
            >
              <FileSpreadsheet className="w-4 h-4" /> Export Excel (.XLSX)
            </button>
            <button
              onClick={handleExportSalesPDF}
              className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
            >
              <FileText className="w-4 h-4" /> Export PDF Report
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
