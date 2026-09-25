import React from 'react';
import { Student, StudentFeeRecord, Department } from '../../types';
import { generateFeeInvoicePDF } from '../../utils/pdfGenerator';
import {
  Receipt,
  Printer,
  Download,
  X,
  Building2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface FeeInvoiceModalProps {
  student: Student;
  department?: Department;
  fee: StudentFeeRecord;
  onClose: () => void;
  onToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const FeeInvoiceModal: React.FC<FeeInvoiceModalProps> = ({
  student,
  department,
  fee,
  onClose,
  onToast
}) => {
  const departmentName = department?.name || 'Computer Science & Engineering';
  const totalFees = fee.totalFees || 80000;
  const feesPaid = fee.feesPaid || 0;
  const feesRemaining = fee.feesRemaining || Math.max(0, totalFees - feesPaid);
  const paymentStatus = fee.paymentStatus || (feesRemaining === 0 ? 'Fully Paid' : feesPaid > 0 ? 'Partially Paid' : 'Unpaid');
  const invoiceNo = `INV-${new Date().getFullYear()}-${student.rollNumber.replace(/[^A-Za-z0-9]/g, '')}`;

  const tuitionPortion = Math.round(totalFees * 0.65);
  const labPortion = Math.round(totalFees * 0.18);
  const libraryPortion = Math.round(totalFees * 0.06);
  const examPortion = Math.round(totalFees * 0.06);
  const amenityPortion = totalFees - (tuitionPortion + labPortion + libraryPortion + examPortion);

  const feeItems = [
    { name: 'Core Academic Tuition & Instructional Fees', category: 'Instructional', amount: tuitionPortion },
    { name: 'Computing Facilities & Laboratory Equipment Fund', category: 'Laboratory', amount: labPortion },
    { name: 'University Digital Library & Academic Journals', category: 'Academic Resources', amount: libraryPortion },
    { name: 'Semester Senate Examination Assessment', category: 'Examinations', amount: examPortion },
    { name: 'Student Amenities, Athletics & Campus Maintenance', category: 'Campus Services', amount: amenityPortion }
  ];

  const handleExportPDF = () => {
    try {
      const filename = generateFeeInvoicePDF({
        student,
        departmentName,
        fee
      });
      if (onToast) {
        onToast(`Downloaded ${filename}`, 'success');
      }
    } catch {
      if (onToast) {
        onToast('Failed to export PDF. Please try printing instead.', 'error');
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/50 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden my-4 sm:my-6">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="no-print flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 px-4 sm:px-6 py-3 sm:py-3.5 bg-[#222f3b] text-[#f7f4eb] border-b border-[#2d3e4d]">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div className="flex size-7 items-center justify-center rounded-lg bg-[#e9bd68] text-[#222f3b] shrink-0">
              <Receipt className="size-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold tracking-wider text-[#f7f4eb] truncate">
                  OFFICIAL FEE INVOICE
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-[#e9bd68] font-mono font-semibold shrink-0">
                  {invoiceNo}
                </span>
              </div>
              <p className="text-[10px] text-[#a9b4b4] truncate">Bursar & Student Financial Services</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              id="modal-export-invoice-pdf-btn"
              onClick={handleExportPDF}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold rounded-lg bg-[#2f766d] hover:bg-[#28675f] text-white transition-colors cursor-pointer shadow-xs"
            >
              <Download className="size-3.5" />
              <span>PDF</span>
            </button>
            <button
              type="button"
              id="modal-print-invoice-btn"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-100 hover:bg-white text-zinc-900 transition-colors cursor-pointer"
            >
              <Printer className="size-3.5" />
              <span>Print</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#a9b4b4] hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Invoice Body Container */}
        <div className="p-3.5 sm:p-8 bg-[#fbfaf6] max-h-[80vh] overflow-y-auto text-zinc-800">
          <div className="border border-[#e1ddd3] bg-white rounded-xl p-4 sm:p-8 shadow-xs space-y-5 sm:space-y-6">
            {/* Header / Crest */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-[#e1ddd3]">
              <div className="flex items-start gap-3.5">
                <div className="size-12 rounded-xl bg-[#222f3b] text-[#e9bd68] flex items-center justify-center shrink-0 shadow-xs">
                  <Building2 className="size-6" />
                </div>
                <div>
                  <h2 className="text-lg font-serif font-bold text-[#222f3b] tracking-tight">
                    NORTHBRIDGE UNIVERSITY
                  </h2>
                  <p className="text-xs font-semibold text-[#2f766d]">
                    Office of the University Bursar & Student Financial Services
                  </p>
                  <p className="text-[11px] text-zinc-500 font-mono mt-0.5">
                    Central Campus • Admissions & Financial Hall • bursar@northbridge.edu
                  </p>
                </div>
              </div>

              <div className="sm:text-right font-mono text-xs text-zinc-600 bg-[#f6f3eb] p-3 rounded-lg border border-[#e1ddd3]">
                <div className="text-[10px] text-zinc-400 uppercase tracking-wider">Invoice Document</div>
                <div className="font-bold text-sm text-[#222f3b]">{invoiceNo}</div>
                <div className="text-[11px] text-zinc-500 mt-1">Date: {new Date().toLocaleDateString('en-GB')}</div>
                <div className="text-[11px] text-zinc-500">Due: {fee.dueDate || '30 Sep 2026'}</div>
              </div>
            </div>

            {/* Student & Billed Account Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 bg-[#f6f3eb] p-4 rounded-xl border border-[#e1ddd3] text-xs font-mono">
              <div>
                <span className="text-[10px] uppercase text-zinc-400 block font-sans">Billed Scholar</span>
                <span className="font-bold text-[#222f3b] text-sm block font-sans mt-0.5">{student.fullName}</span>
                <span className="text-zinc-500 text-[11px]">Roll: {student.rollNumber}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-zinc-400 block font-sans">Department & Program</span>
                <span className="font-semibold text-zinc-800 block mt-0.5">{departmentName}</span>
                <span className="text-zinc-500 text-[11px]">Academic Year: {fee.academicYear || student.academicYear}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-zinc-400 block font-sans">Clearance Status</span>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-bold uppercase mt-1 border ${
                  paymentStatus === 'Fully Paid'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : paymentStatus === 'Partially Paid'
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}>
                  {paymentStatus === 'Fully Paid' ? <CheckCircle2 className="size-3.5" /> : <AlertCircle className="size-3.5" />}
                  {paymentStatus}
                </span>
              </div>
            </div>

            {/* Financial Summary Metric Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 text-center">
              <div className="p-3 sm:p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl">
                <span className="text-[10px] font-mono uppercase text-zinc-400 block">Total Assessed</span>
                <span className="text-lg sm:text-xl font-mono font-bold text-zinc-900 block mt-1">₹{totalFees.toLocaleString()}</span>
              </div>
              <div className="p-3 sm:p-3.5 bg-emerald-50/60 border border-emerald-200/80 rounded-xl">
                <span className="text-[10px] font-mono uppercase text-emerald-700 block">Amount Cleared</span>
                <span className="text-lg sm:text-xl font-mono font-bold text-emerald-800 block mt-1">₹{feesPaid.toLocaleString()}</span>
              </div>
              <div className={`p-3 sm:p-3.5 rounded-xl border ${
                feesRemaining > 0 ? 'bg-rose-50/60 border-rose-200' : 'bg-zinc-50 border-zinc-200'
              }`}>
                <span className="text-[10px] font-mono uppercase text-zinc-500 block">Balance Outstanding</span>
                <span className={`text-lg sm:text-xl font-mono font-bold block mt-1 ${
                  feesRemaining > 0 ? 'text-rose-700' : 'text-zinc-700'
                }`}>₹{feesRemaining.toLocaleString()}</span>
              </div>
            </div>

            {/* Itemized Fee Breakdown Table */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#222f3b] font-mono">
                  Itemized Fee Schedule
                </h3>
                <span className="text-[11px] font-mono text-zinc-500">Semester {student.semester}</span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-zinc-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#222f3b] text-white font-mono text-[10px] uppercase">
                    <tr>
                      <th className="py-2.5 px-4 font-semibold">Description</th>
                      <th className="py-2.5 px-4 font-semibold">Classification</th>
                      <th className="py-2.5 px-4 text-right font-semibold">Assessed (INR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 font-sans text-zinc-700">
                    {feeItems.map((item, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-zinc-50/50'}>
                        <td className="py-2.5 px-4 font-medium text-zinc-900">{item.name}</td>
                        <td className="py-2.5 px-4 font-mono text-zinc-500 text-[11px]">{item.category}</td>
                        <td className="py-2.5 px-4 text-right font-mono font-semibold text-zinc-900">
                          ₹{item.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-[#f6f3eb] font-bold text-xs">
                      <td colSpan={2} className="py-3 px-4 text-[#222f3b]">Total Assessed Charges</td>
                      <td className="py-3 px-4 text-right font-mono text-[#222f3b] text-sm">
                        ₹{totalFees.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payment Transaction History */}
            {fee.paymentHistory && fee.paymentHistory.length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#222f3b] font-mono mb-2">
                  Cleared Payment Receipts
                </h3>
                <div className="overflow-x-auto rounded-xl border border-zinc-200">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-zinc-100 text-zinc-600 text-[10px] uppercase">
                      <tr>
                        <th className="py-2 px-3">Date</th>
                        <th className="py-2 px-3">Transaction Ref</th>
                        <th className="py-2 px-3">Method</th>
                        <th className="py-2 px-3">Receipt #</th>
                        <th className="py-2 px-3 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 text-zinc-700 text-[11px]">
                      {fee.paymentHistory.map(h => (
                        <tr key={h.id} className="hover:bg-zinc-50">
                          <td className="py-2 px-3">{h.paymentDate}</td>
                          <td className="py-2 px-3 font-semibold text-zinc-900">{h.transactionRef}</td>
                          <td className="py-2 px-3 text-zinc-600">{h.paymentMethod}</td>
                          <td className="py-2 px-3 text-zinc-500">{h.receiptNumber}</td>
                          <td className="py-2 px-3 text-right font-semibold text-emerald-700">
                            ₹{h.amount.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Bursar Certification Footer */}
            <div className="pt-4 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="text-zinc-500 text-[11px] leading-relaxed max-w-md">
                <p className="font-semibold text-zinc-700 mb-0.5">Bursar Certification Notice</p>
                This electronic invoice is an authenticated official record issued by Northbridge University Central Treasury. It serves as institutional verification for semester registration and examination clearance.
              </div>

              <div className="text-center p-3 bg-[#f6f3eb] rounded-xl border border-[#e1ddd3] shrink-0 w-44">
                <div className="text-[10px] font-mono uppercase text-[#e9bd68] bg-[#222f3b] py-0.5 px-2 rounded inline-block font-bold">
                  CENTRAL BURSAR
                </div>
                <div className="text-xs font-serif font-bold text-[#222f3b] mt-1.5">Dr. Marcus Vance</div>
                <div className="text-[10px] text-zinc-400">Chief University Comptroller</div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Action Footer */}
        <div className="no-print flex items-center justify-between px-6 py-3.5 bg-[#f6f3eb] border-t border-[#e1ddd3]">
          <span className="text-xs text-[#78827e]">
            Official document generated for Roll <strong className="text-[#222f3b] font-mono">{student.rollNumber}</strong>
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportPDF}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-[#2f766d] hover:bg-[#28675f] text-white transition-all cursor-pointer shadow-xs"
            >
              <Download className="size-3.5" />
              Download PDF Invoice
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl border border-zinc-300 bg-white hover:bg-zinc-50 text-zinc-800 transition-colors cursor-pointer"
            >
              <Printer className="size-3.5" />
              Print
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
