import React, { useState, useEffect } from 'react';
import {
  Printer,
  Download,
  X,
  FileCheck2,
  Building2,
  CheckCircle2
} from 'lucide-react';
import type{ Student, Staff, Department, StudentFeeRecord, StudentAttendanceRecord } from '../../types';
import { AdminReportPrintDocument } from './AdminReportPrintDocument';
import { generateAdminAuditReportPDF } from '../../utils/pdfGenerator';

interface AdminReportPrintModalProps {
  students: Student[];
  staffList: Staff[];
  departments: Department[];
  feeRecords: StudentFeeRecord[];
  studentAttendance: StudentAttendanceRecord[];
  getStudentGPA: (id: string) => { gpa: number; cgpa: number; passStatus: 'Pass' | 'Fail'; totalSubjects: number };
  onClose: () => void;
  onToast?: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const AdminReportPrintModal: React.FC<AdminReportPrintModalProps> = ({
  students,
  staffList,
  departments,
  feeRecords,
  studentAttendance,
  getStudentGPA,
  onClose,
  onToast
}) => {
  const [isExporting, setIsExporting] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    setIsExporting(true);
    try {
      const filename = generateAdminAuditReportPDF({
        students,
        staffList,
        departments,
        feeRecords,
        studentAttendance,
        getStudentGPA
      });
      if (onToast) {
        onToast(`Downloaded official audit: ${filename}`, 'success');
      }
    } catch {
      if (onToast) {
        onToast('Failed to generate PDF. Please use the Print option directly.', 'error');
      }
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#f7f4ed] rounded-2xl shadow-2xl border border-zinc-300 overflow-hidden my-4 sm:my-6 flex flex-col max-h-[94vh]">
        {/* Top Control Bar (Hidden during print) */}
        <div className="no-print flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3.5 bg-[#1a242f] text-white border-b border-zinc-700 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex size-7 items-center justify-center rounded-lg bg-[#e9bd68] text-[#1a242f] shrink-0">
              <Building2 className="size-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold tracking-wider text-zinc-100 truncate">
                  INSTITUTIONAL AUDIT & EXECUTIVE SUMMARY
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-[#e9bd68] font-mono font-semibold shrink-0">
                  REF: AUD-REG-2026-FAS
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 font-mono hidden sm:block">
                Print-optimized financial & academic compliance summary • Official Senate Document
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="print-audit-report-btn"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-white hover:bg-zinc-100 text-zinc-900 transition-colors cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-zinc-700" />
              <span>Print Document</span>
            </button>

            <button
              type="button"
              id="export-audit-pdf-btn"
              onClick={handleExportPDF}
              disabled={isExporting}
              className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#2f766d] hover:bg-[#28675f] text-white transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
            >
              {isExporting ? (
                <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <Download className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">Export PDF</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Informational Sub-Bar for Quick Print Guidance */}
        <div className="no-print bg-amber-50/90 border-b border-amber-200/80 px-4 sm:px-6 py-2 flex items-center justify-between text-[11px] text-amber-900">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span>
              This layout automatically applies the university print stylesheet, hiding navigation, sidebars, and control buttons when sent to printer or exported to PDF.
            </span>
          </div>
          <span className="font-mono text-[10px] text-amber-700 font-medium hidden md:inline">
            A4 Standard • 100% Exact Ink
          </span>
        </div>

        {/* Document Scrollable Preview Area */}
        <div className="overflow-y-auto flex-1 p-3 sm:p-6 bg-zinc-200/60">
          <div className="bg-white shadow-xl rounded-lg overflow-hidden border border-zinc-300">
            <AdminReportPrintDocument
              students={students}
              staffList={staffList}
              departments={departments}
              feeRecords={feeRecords}
              studentAttendance={studentAttendance}
              getStudentGPA={getStudentGPA}
            />
          </div>
        </div>

        {/* Modal Bottom Footer (no-print) */}
        <div className="no-print px-4 sm:px-6 py-3 bg-white border-t border-zinc-200 flex flex-wrap items-center justify-between text-xs text-zinc-500 gap-2 shrink-0">
          <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Financial & Academic Audits Computed & Verified</span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[10px]">
            <span>Scholars: {students.length}</span>
            <span>•</span>
            <span>Staff: {staffList.length}</span>
            <span>•</span>
            <span>Treasury: ₹{feeRecords.reduce((s, f) => s + (f.totalFees || 0), 0).toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
