import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useUniversity } from '../../context/UniversityContext';
import type{ CertificateType } from '../../types';
import { Award, Eye, CheckCircle2, Plus, X, Search, ArrowUp } from 'lucide-react';
import { truncateEmail } from '../../utils/formatters';

interface StaffCertificatesViewProps {
  onViewCertificate: (certId: string) => void;
}

export const StaffCertificatesView: React.FC<StaffCertificatesViewProps> = ({ onViewCertificate }) => {
  const { currentStaff, students, certificates, issueCertificate } = useUniversity();

  const [searchTerm, setSearchTerm] = useState('');
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [studentId, setStudentId] = useState(students[0]?.id || '');
  const [certificateTitle, setCertificateTitle] = useState('Certificate of Academic Merit in Algorithms');
  const [certificateType, setCertificateType] = useState<CertificateType>('Merit');
  const [description, setDescription] = useState('Awarded for achieving the highest percentile in advanced algorithmic computation.');
  const [isIssued, setIsIssued] = useState(false);

  // Scroll tracking for fade effect and quick scroll to top
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isScrolledTop, setIsScrolledTop] = useState(false);
  const [canScrollBottom, setCanScrollBottom] = useState(false);

  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setIsScrolledTop(el.scrollTop > 16);
    setCanScrollBottom(el.scrollHeight - el.scrollTop - el.clientHeight > 12);
  };

  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const filteredCertificates = useMemo(() => {
    return certificates.filter(cert => {
      const student = students.find(s => s.id === cert.studentId);
      const searchLower = searchTerm.toLowerCase();
      return (
        cert.certificateTitle.toLowerCase().includes(searchLower) ||
        cert.certificateId.toLowerCase().includes(searchLower) ||
        (student && (
          student.fullName.toLowerCase().includes(searchLower) ||
          student.rollNumber.toLowerCase().includes(searchLower)
        ))
      );
    });
  }, [certificates, students, searchTerm]);

  useEffect(() => {
    handleScroll();
  }, [filteredCertificates]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    issueCertificate({
      studentId,
      certificateTitle,
      certificateType,
      issuedByStaffId: currentStaff?.id || 'STF-101',
      description
    });

    setIsIssued(true);
    setIsIssueModalOpen(false);
    setTimeout(() => setIsIssued(false), 4000);
  };

  return (
    <div className="h-[calc(100vh-9.5rem)] max-h-[calc(100vh-9.5rem)] flex flex-col overflow-hidden w-full space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200">
              Registrar Credentials
            </span>
          </div>
          <h1 className="text-2xl font-serif font-semibold text-zinc-900 tracking-tight">
            Academic Credential Issuance
          </h1>
          <p className="text-xs text-zinc-500 font-mono">
            Authorize verifiable certificates for academic merit, course completion, or honors
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsIssueModalOpen(true)}
            className="px-3.5 py-2 text-xs font-medium rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white transition-colors flex items-center gap-2 cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" /> Issue Credential
          </button>
        </div>
      </div>

      {isIssued && (
        <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2 shrink-0">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          Official credential generated, cryptographically signed, and filed to student dossier.
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white p-3 rounded-xl border border-zinc-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)] flex items-center justify-between gap-3 shrink-0">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-zinc-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by student, title, or credential ID..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900 transition-colors"
          />
        </div>
        <span className="text-xs font-mono text-zinc-500 shrink-0">
          {filteredCertificates.length} Issued
        </span>
      </div>

      {/* Existing Certificates Roster */}
      <div className="relative flex-1 min-h-0 flex flex-col bg-white rounded-xl border border-zinc-200 shadow-2xs overflow-hidden">
        {/* Top Fade Indicator */}
        <div
          className={`pointer-events-none absolute top-10 left-0 right-0 h-6 bg-gradient-to-b from-white to-transparent z-10 transition-opacity duration-200 ${
            isScrolledTop ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {filteredCertificates.length === 0 ? (
          <div className="p-12 text-center text-zinc-400 font-mono text-xs">
            No credentials found matching your search.
          </div>
        ) : (
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-x-auto overflow-y-auto overscroll-contain pr-1 custom-scrollbar scroll-smooth"
          >
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 z-10 bg-zinc-50 shadow-2xs text-zinc-400 font-mono font-medium border-b border-zinc-200 text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Credential ID</th>
                  <th className="py-3 px-4">Recipient</th>
                  <th className="py-3 px-4">Certificate Title</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Issue Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-zinc-700 font-sans">
                {filteredCertificates.map(cert => {
                  const st = students.find(s => s.id === cert.studentId);
                  return (
                    <tr key={cert.id} className="hover:bg-zinc-50/60 transition-colors">
                      <td className="py-3 px-4 font-mono text-zinc-700 text-[11px]">
                        {cert.certificateId}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-zinc-900">{st?.fullName || 'Student'}</div>
                        {st?.email && (
                          <div className="text-[10px] text-zinc-400 font-mono" title={st.email}>
                            {truncateEmail(st.email, 24)}
                          </div>
                        )}
                        <div className="text-[10px] text-zinc-400 font-mono">{st?.rollNumber}</div>
                      </td>
                      <td className="py-3 px-4 font-serif text-zinc-900 font-medium">
                        {cert.certificateTitle}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-100 text-zinc-700 border border-zinc-200">
                          {cert.certificateType}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-zinc-600">
                        {cert.issueDate}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => onViewCertificate(cert.id)}
                          className="px-2.5 py-1 rounded-md text-xs font-medium border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 transition-colors inline-flex items-center gap-1 cursor-pointer shadow-2xs"
                        >
                          <Eye className="w-3 h-3" /> View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Bottom Fade Indicator */}
        <div
          className={`pointer-events-none absolute bottom-12 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent z-10 transition-opacity duration-200 ${
            canScrollBottom ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Floating Quick Scroll to Top Action when scrolled */}
        {isScrolledTop && (
          <button
            type="button"
            onClick={scrollToTop}
            className="absolute bottom-14 right-4 z-20 flex items-center gap-1 px-3 py-1.5 rounded-full bg-zinc-900/90 hover:bg-zinc-900 text-white text-xs font-medium shadow-md transition-all backdrop-blur-xs cursor-pointer"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span className="text-[11px]">Top</span>
          </button>
        )}

        {/* Footer */}
        <div className="px-4 py-3 border-t border-zinc-100 bg-zinc-50/90 flex items-center justify-between text-xs font-mono text-zinc-500 shrink-0">
          <span>
            Showing {filteredCertificates.length} of {certificates.length} certificates
          </span>
          <span className="text-[11px] text-zinc-400">
            Institutional credential ledger
          </span>
        </div>
      </div>

      {/* Issue Credential Modal */}
      {isIssueModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xl max-w-lg w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-800">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-semibold text-zinc-900 text-base">Issue New Credential</h3>
                  <p className="text-[11px] text-zinc-500 font-mono">Select scholar and specify award citation</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsIssueModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-3">
                {/* Target Student */}
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">Scholar Recipient</label>
                  <select
                    value={studentId}
                    onChange={e => setStudentId(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900 font-sans"
                  >
                    {students.map(st => (
                      <option key={st.id} value={st.id}>
                        {st.fullName} ({st.rollNumber} • Sem {st.semester})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Certificate Type */}
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">Credential Classification</label>
                  <select
                    value={certificateType}
                    onChange={e => setCertificateType(e.target.value as CertificateType)}
                    className="w-full px-3 py-2 text-xs rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  >
                    <option value="Merit">Academic Merit</option>
                    <option value="Course Completion">Course Completion</option>
                    <option value="Participation">Participation</option>
                    <option value="Achievement">Distinction / Honors</option>
                    <option value="Degree">Degree Diploma</option>
                  </select>
                </div>

                {/* Title */}
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">Certificate Title</label>
                  <input
                    type="text"
                    required
                    value={certificateTitle}
                    onChange={e => setCertificateTitle(e.target.value)}
                    placeholder="e.g. Certificate of Academic Excellence in Software Engineering"
                    className="w-full px-3 py-2 text-xs rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">Citation / Faculty Endorsement</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Details of student contribution, GPA achievement, or project completion..."
                    className="w-full p-3 text-xs rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900 font-sans"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsIssueModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium rounded-lg border border-zinc-200 hover:bg-zinc-50 text-zinc-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white transition-colors flex items-center gap-2 cursor-pointer shadow-2xs"
                >
                  <Award className="w-3.5 h-3.5" /> Issue Credential
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
