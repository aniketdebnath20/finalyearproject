import React, { useRef } from 'react';
import type { Certificate, Student } from '../../types';
import { useUniversity } from '../../context/UniversityContext';
import { Award, Printer, X, CheckCircle, ShieldCheck, Building2 } from 'lucide-react';

interface CertificateModalProps {
  certificate: Certificate | null;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ certificate, onClose }) => {
  const { students, departments } = useUniversity();
  const certRef = useRef<HTMLDivElement>(null);

  if (!certificate) return null;

  const student: Student | undefined = students.find(s => s.id === certificate.studentId);
  const dept = departments.find(d => d.id === student?.departmentId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-xl border border-zinc-200 overflow-hidden my-4 sm:my-6 max-h-[92vh] flex flex-col">
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 sm:px-6 py-3 sm:py-3.5 bg-zinc-900 text-white border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <Award className="w-4 h-4 text-zinc-300 shrink-0" />
            <span className="font-mono text-xs font-semibold tracking-wider uppercase truncate">
              Credential Record
            </span>
            <span className="text-[10px] px-1.5 sm:px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono shrink-0">
              {certificate.certificateId}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-lg bg-white text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Classical Certificate Frame */}
        <div className="p-3 sm:p-6 sm:p-10 bg-zinc-50 flex justify-center overflow-y-auto flex-1">
          <div
            ref={certRef}
            className="w-full bg-[#FCFCFA] p-4 sm:p-8 sm:p-12 rounded-lg border-2 border-zinc-300 relative text-center select-none shadow-xs"
            style={{ minHeight: '440px' }}
          >
            {/* Inner Hairline Frame */}
            <div className="border border-zinc-300/80 p-3 sm:p-6 sm:p-8 relative">
              {/* Seal Header */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-zinc-900 text-white flex items-center justify-center mb-2 sm:mb-3 shadow-xs">
                  <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-100" />
                </div>

                <h1 className="text-[9px] sm:text-[10px] font-mono tracking-[0.2em] sm:tracking-[0.25em] text-zinc-500 uppercase">
                  Apex State University • Academic Senate
                </h1>
                <div className="text-xl sm:text-2xl md:text-3xl font-serif font-semibold text-zinc-900 mt-1 tracking-tight">
                  Certificate of {certificate.certificateType}
                </div>
                <div className="w-16 h-px bg-zinc-400 my-2 sm:my-3"></div>
              </div>

              {/* Certificate Body */}
              <div className="my-4 sm:my-5 space-y-2.5 sm:space-y-3">
                <p className="text-xs text-zinc-500 italic font-serif">
                  This official academic credential is awarded to
                </p>

                <div className="text-lg sm:text-xl md:text-2xl font-serif font-semibold text-zinc-900 border-b border-dashed border-zinc-400 pb-1.5 inline-block px-4 sm:px-6">
                  {student?.fullName || 'Enrolled Scholar'}
                </div>

                <div className="text-[10px] sm:text-[11px] text-zinc-500 font-mono">
                  Roll: <strong className="text-zinc-800">{student?.rollNumber || 'N/A'}</strong> &nbsp;|&nbsp; ID: <strong className="text-zinc-800">{student?.studentId || 'N/A'}</strong>
                </div>

                <p className="text-xs text-zinc-600 max-w-lg mx-auto leading-relaxed pt-1 px-2">
                  for meritorious fulfillment of curriculum requirements and successful examination benchmark attainment in
                </p>

                <div className="text-sm sm:text-base font-serif font-medium text-zinc-900 px-3 sm:px-4 py-1.5 bg-zinc-100/80 rounded inline-block border border-zinc-200">
                  {certificate.certificateTitle}
                </div>

                {dept && (
                  <div className="text-xs text-zinc-500 font-sans">
                    Department of {dept.name}
                  </div>
                )}
              </div>

              {/* Signatures & Seal */}
              <div className="pt-5 sm:pt-6 mt-5 sm:mt-6 border-t border-zinc-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-2 px-2 sm:px-6">
                <div className="text-center w-32 order-2 sm:order-1">
                  <div className="font-serif italic text-sm text-zinc-900 font-semibold border-b border-zinc-300 pb-1">
                    Eleanor Vance
                  </div>
                  <div className="text-[9px] font-mono uppercase text-zinc-500 mt-1">
                    Registrar
                  </div>
                </div>

                <div className="flex flex-col items-center order-1 sm:order-2">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full border border-zinc-300 bg-white flex items-center justify-center text-zinc-800">
                    <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-zinc-700" />
                  </div>
                  <span className="text-[8px] font-mono uppercase tracking-widest text-zinc-500 mt-1">
                    Verified
                  </span>
                </div>

                <div className="text-center w-32 order-3">
                  <div className="text-xs font-mono font-medium text-zinc-900 border-b border-zinc-300 pb-1">
                    {certificate.issueDate}
                  </div>
                  <div className="text-[9px] font-mono uppercase text-zinc-500 mt-1">
                    Date of Issue
                  </div>
                </div>
              </div>

              {/* Bottom Verification Hash */}
              <div className="mt-4 sm:mt-5 pt-2 text-[8px] sm:text-[9px] font-mono text-zinc-400 flex flex-col sm:flex-row items-center justify-between gap-1 border-t border-zinc-100">
                <span>Verification ID: {certificate.certificateId}</span>
                <span>Digitally Certified Records</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-4 sm:px-6 py-3 bg-white border-t border-zinc-200 shrink-0">
          <div className="flex items-center gap-2 text-[11px] sm:text-xs text-zinc-600 text-center sm:text-left">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Authenticated through Apex University Registrar Registry</span>
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-1.5 text-xs font-medium text-zinc-700 bg-zinc-100 hover:bg-zinc-200/80 rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
