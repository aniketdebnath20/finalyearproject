import React, { useState } from 'react';
import { useUniversity } from '../../context/UniversityContext';
import { Award, Eye, Printer, ShieldCheck, X } from 'lucide-react';
import { StudentCertificatesSkeleton } from '../common/Skeleton';

interface StudentCertificatesViewProps {
  onViewCertificate: (certId: string) => void;
  isLoading?: boolean;
}

export const StudentCertificatesView: React.FC<StudentCertificatesViewProps> = ({ isLoading }) => {
  const { currentStudent, certificates, staffList, isDataLoading, addToast } = useUniversity();
  const [showUpcomingModal, setShowUpcomingModal] = useState(false);

  if (isLoading || isDataLoading) {
    return <StudentCertificatesSkeleton />;
  }

  if (!currentStudent) return null;

  const studentCerts = certificates.filter(c => c.studentId === currentStudent.id);

  const handleTriggerUpcoming = () => {
    setShowUpcomingModal(true);
    addToast('This is an upcoming user work', 'info');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200">
              Registrar Credentials
            </span>
          </div>
          <h1 className="text-2xl font-serif font-semibold text-zinc-900 tracking-tight">
            Academic Diplomas & Credentials
          </h1>
          <p className="text-xs text-zinc-500 font-mono">
            Cryptographically certified qualifications logged under Roll: <strong className="text-zinc-800">{currentStudent.rollNumber}</strong>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-3 py-1 rounded-md bg-zinc-100 text-zinc-800 border border-zinc-200 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-600" />
            {studentCerts.length} Verified Records
          </span>
        </div>
      </div>

      {studentCerts.length === 0 ? (
        <div className="bg-white rounded-xl p-12 border border-zinc-200 text-center space-y-2.5">
          <div className="w-12 h-12 rounded-lg bg-zinc-100 flex items-center justify-center mx-auto text-zinc-400">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-serif font-semibold text-zinc-900">No Credentials Issued Yet</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto font-mono">
            Accredited certificates issued upon curriculum milestones or term completions will be digitally filed here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {studentCerts.map(cert => {
            const faculty = staffList.find(s => s.id === cert.issuedByStaffId);
            const issuerName = cert.issuedByAdminName || faculty?.staffName || 'Office of the Registrar';

            return (
              <div
                key={cert.id}
                className="bg-white rounded-xl p-5 border border-zinc-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:border-zinc-300 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 border border-zinc-200">
                      {cert.certificateType}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">
                      {cert.certificateId}
                    </span>
                  </div>

                  <h3 className="text-base font-serif font-semibold text-zinc-900">
                    {cert.certificateTitle}
                  </h3>

                  <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed line-clamp-2">
                    {cert.description || 'Awarded for exemplary fulfillment of curricular academic benchmarks.'}
                  </p>

                  <div className="mt-4 pt-3 border-t border-zinc-100 space-y-1.5 text-xs text-zinc-600 font-mono text-[11px]">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">Issue Date:</span>
                      <span className="text-zinc-800">{cert.issueDate}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-400">Authorized by:</span>
                      <span className="text-zinc-900 font-sans font-medium">{issuerName}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-zinc-100 flex items-center gap-2">
                  <button
                    type="button"
                    id={`student-view-cert-btn-${cert.id}`}
                    onClick={handleTriggerUpcoming}
                    className="flex-1 py-2 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" /> View Official Certificate
                  </button>
                  <button
                    type="button"
                    id={`student-print-cert-btn-${cert.id}`}
                    onClick={handleTriggerUpcoming}
                    className="py-2 px-3 rounded-lg bg-zinc-100 hover:bg-zinc-200/80 text-zinc-700 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    title="Print Document"
                  >
                    <Printer className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upcoming Feature Modal on View / Print Certificate */}
      {showUpcomingModal && (
        <div
          id="student-certificate-upcoming-modal"
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setShowUpcomingModal(false)}
        >
          <div
            id="student-certificate-upcoming-card"
            className="bg-white rounded-3xl max-w-lg w-full p-10 sm:p-14 text-center shadow-xl border border-[#ded8cb] relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              type="button"
              id="student-certificate-upcoming-close-btn"
              onClick={() => setShowUpcomingModal(false)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-700 rounded-full hover:bg-zinc-100 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <p
              id="student-certificate-preview-upcoming-text"
              className="text-2xl sm:text-3xl font-serif font-medium text-[#141b22] tracking-normal leading-relaxed"
            >
              This is an upcoming user work
            </p>
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                id="student-certificate-upcoming-dismiss-btn"
                onClick={() => setShowUpcomingModal(false)}
                className="px-6 py-2.5 text-xs font-semibold rounded-xl bg-[#141b22] hover:bg-[#253341] text-white transition-colors cursor-pointer shadow-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
