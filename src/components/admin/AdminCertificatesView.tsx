import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useUniversity } from '../../context/UniversityContext';
import {
  Award,
  Search,
  Plus,
  Eye,
  Trash2,
  User,
  ShieldCheck,
  X,
  Upload,
  ArrowUp
} from 'lucide-react';
import { MasterViewSkeleton } from '../common/Skeleton';
import { truncateEmail } from '../../utils/formatters';

interface AdminCertificatesViewProps {
  onViewCertificate: (certId: string) => void;
  onSelectStudent?: (studentId: string) => void;
  isLoading?: boolean;
}

export const AdminCertificatesView: React.FC<AdminCertificatesViewProps> = ({
  onSelectStudent,
  isLoading
}) => {
  const {
    certificates,
    students,
    courses,
    issueCertificate,
    deleteCertificate,
    addToast,
    isDataLoading
  } = useUniversity();

  const [searchTerm, setSearchTerm] = useState('');
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [showUpcomingModal, setShowUpcomingModal] = useState(false);

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

  // Form states for issuing new certificate
  const [targetStudentId, setTargetStudentId] = useState(students[0]?.id || '');
  const [certTitle, setCertTitle] = useState('Certificate of Academic Distinction in Computer Science');
  const [issueDate, setIssueDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('Recognized for exemplary performance, academic rigour, and capstone excellence.');
  const [fileName, setFileName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isLoading || isDataLoading) {
    return <MasterViewSkeleton role="admin" activeTab="certificates" />;
  }

  // Filter certificates based solely on the search bar
  const filteredCertificates = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return certificates;

    return certificates.filter(cert => {
      const student = students.find(s => s.id === cert.studentId);
      const studentName = (student?.fullName || '').toLowerCase();
      const rollNumber = (student?.rollNumber || '').toLowerCase();
      const certId = (cert.certificateId || '').toLowerCase();
      const title = (cert.certificateTitle || '').toLowerCase();

      return (
        studentName.includes(q) ||
        rollNumber.includes(q) ||
        certId.includes(q) ||
        title.includes(q)
      );
    });
  }, [certificates, students, searchTerm]);

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetStudentId) {
      addToast('Please select a student.', 'error');
      return;
    }
    if (!certTitle.trim()) {
      addToast('Please enter a certificate title.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      issueCertificate({
        studentId: targetStudentId,
        certificateTitle: certTitle.trim(),
        certificateType: 'Merit',
        issueDate,
        description: description.trim(),
        downloadUrl: fileName ? `https://storage.university.edu/certs/${encodeURIComponent(fileName)}` : undefined
      });

      const student = students.find(s => s.id === targetStudentId);
      addToast(`Certificate issued to ${student?.fullName || 'scholar'} successfully!`, 'success');
      setIsIssueModalOpen(false);
      // Reset form
      setCertTitle('Certificate of Academic Distinction in Computer Science');
      setDescription('Recognized for exemplary performance, academic rigour, and capstone excellence.');
      setFileName('');
    } catch {
      addToast('Failed to issue certificate.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (certId: string, certTitle: string) => {
    if (window.confirm(`Are you sure you want to revoke and delete "${certTitle}"?`)) {
      deleteCertificate(certId);
      addToast('Certificate record revoked.', 'info');
    }
  };

  useEffect(() => {
    handleScroll();
  }, [filteredCertificates]);

  return (
    <div
      id="admin-certificates-view"
      className="h-[calc(100vh-9.5rem)] max-h-[calc(100vh-9.5rem)] flex flex-col overflow-hidden w-full"
    >
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Registrar Credentials
            </span>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-semibold flex items-center gap-1">
              <User className="w-3 h-3" /> {new Set(certificates.map(c => c.studentId)).size} Scholar Recipients
            </span>
          </div>
          <h1 className="text-2xl font-serif font-semibold text-zinc-900 tracking-tight">
            Student Academic Certifications
          </h1>
          <p className="text-xs text-zinc-500 font-mono">
            Verify issued qualifications, monitor degree milestones, and upload student credentials
          </p>
        </div>

        <button
          type="button"
          id="admin-issue-cert-btn"
          onClick={() => setIsIssueModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#141b22] text-white hover:bg-[#253341] transition-all text-xs font-semibold shadow-xs cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Upload & Issue Certificate</span>
        </button>
      </div>

      {/* Only Search Bar */}
      <div id="search-container" className="relative shrink-0 my-3">
        <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
        <input
          id="admin-search-certs-input"
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Search by student name, roll number, certificate ID, or title..."
          className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-white border border-zinc-200 shadow-2xs focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all placeholder:text-zinc-400"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            className="absolute right-3 top-2.5 text-xs text-zinc-400 hover:text-zinc-700 px-1 py-0.5 rounded cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* Certificates Table & Records with Content Scroll Effect */}
      <div className="relative flex-1 min-h-0 flex flex-col bg-white rounded-xl border border-zinc-200 shadow-2xs overflow-hidden">
        {/* Top Fade Indicator */}
        <div
          className={`pointer-events-none absolute top-10 left-0 right-0 h-6 bg-gradient-to-b from-white to-transparent z-10 transition-opacity duration-200 ${
            isScrolledTop ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-x-auto overflow-y-auto overscroll-contain pr-1 custom-scrollbar scroll-smooth"
        >
          <table className="w-full text-left text-xs border-collapse">
            <thead className="sticky top-0 z-10 bg-zinc-50 shadow-2xs">
              <tr className="border-b border-zinc-200 bg-zinc-50 text-[10px] font-mono uppercase text-zinc-500">
                <th className="py-3 px-4 font-semibold">Scholar Recipient</th>
                <th className="py-3 px-4 font-semibold">Issued Date & Authority</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filteredCertificates.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-12 text-center text-zinc-400">
                    <Award className="w-8 h-8 mx-auto mb-2 text-zinc-300" />
                    <p className="text-xs font-medium text-zinc-600">No certificates found</p>
                    <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                      Try adjusting your search criteria or click &ldquo;Upload & Issue Certificate&rdquo;.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredCertificates.map(cert => {
                  const student = students.find(s => s.id === cert.studentId);
                  const course = courses.find(c => c.id === student?.courseId);

                  return (
                    <tr key={cert.id} className="hover:bg-zinc-50/80 transition-colors">
                      {/* Scholar Recipient with Icon & Certificate Details */}
                      <td className="py-3.5 px-4">
                        {student ? (
                          <div className="flex items-start gap-3">
                            <div className="relative shrink-0 mt-0.5">
                              {student.profilePhoto ? (
                                <img
                                  src={student.profilePhoto}
                                  alt={student.fullName}
                                  className="w-9 h-9 rounded-full object-cover border border-zinc-200"
                                />
                              ) : (
                                <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700">
                                  <User className="w-4 h-4" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <button
                                type="button"
                                onClick={() => onSelectStudent && onSelectStudent(student.id)}
                                className="font-semibold text-zinc-900 hover:text-blue-600 text-left transition-colors cursor-pointer block truncate"
                              >
                                {student.fullName}
                              </button>
                              {student.email && (
                                <div className="text-[10px] text-zinc-400 font-mono" title={student.email}>
                                  {truncateEmail(student.email, 24)}
                                </div>
                              )}
                              <div className="text-[11px] text-zinc-500 font-mono">
                                Roll: {student.rollNumber} • Sem {student.semester}
                                {course && <span> • {course.courseCode}</span>}
                              </div>
                              <div className="mt-1 flex items-center gap-1.5 text-xs text-zinc-800 font-medium">
                                <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                <span className="truncate">{cert.certificateTitle}</span>
                                <span className="text-[10px] font-mono text-zinc-400 shrink-0">
                                  ({cert.certificateId})
                                </span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-400">
                              <User className="w-4 h-4" />
                            </div>
                            <span className="text-zinc-400 font-mono text-xs">Unknown Student</span>
                          </div>
                        )}
                      </td>

                      {/* Issue Date & Authority */}
                      <td className="py-3.5 px-4">
                        <div className="text-xs text-zinc-800 font-medium">
                          {cert.issueDate || '2026-03-15'}
                        </div>
                        <div className="text-[11px] text-zinc-500 font-mono mt-0.5">
                          {cert.issuedByAdminName || 'Office of the Registrar'}
                        </div>
                      </td>

                      {/* Action buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            id={`admin-preview-cert-btn-${cert.id}`}
                            onClick={() => {
                              setShowUpcomingModal(true);
                              addToast('This is an upcoming user work', 'info');
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white transition-colors cursor-pointer shadow-2xs"
                            title="Preview Certificate"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Preview</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(cert.id, cert.certificateTitle)}
                            className="p-1.5 text-zinc-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Revoke Certificate"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

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
        <div className="px-4 py-3 border-t border-zinc-100 bg-zinc-50/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-zinc-500 shrink-0">
          <span>
            Showing {filteredCertificates.length} of {certificates.length} certificates
          </span>
          <span className="text-[11px] text-zinc-400">
            Official verifiable qualifications registered under apex security standards
          </span>
        </div>
      </div>

      {/* Upload & Issue Certificate Modal */}
      {isIssueModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-zinc-200 overflow-hidden my-6">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-zinc-50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-amber-100 text-amber-800">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-serif font-bold text-zinc-900">
                    Upload & Issue Academic Certificate
                  </h3>
                  <p className="text-[11px] text-zinc-500 font-mono">
                    Registrar authorization & institutional credential filing
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsIssueModalOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-lg hover:bg-zinc-200 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleIssueSubmit} className="p-6 space-y-4 text-xs">
              {/* Select Student */}
              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-500 font-semibold block mb-1">
                  Recipient Student <span className="text-rose-500">*</span>
                </label>
                <select
                  value={targetStudentId}
                  onChange={e => setTargetStudentId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900"
                  required
                >
                  {students.map(st => (
                    <option key={st.id} value={st.id}>
                      {st.fullName} — Roll: {st.rollNumber} (Sem {st.semester})
                    </option>
                  ))}
                </select>
              </div>

              {/* Certificate Title */}
              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-500 font-semibold block mb-1">
                  Certificate Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={certTitle}
                  onChange={e => setCertTitle(e.target.value)}
                  placeholder="e.g. Certificate of Academic Merit in Machine Learning"
                  className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900"
                  required
                />
              </div>

              {/* Issue Date */}
              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-500 font-semibold block mb-1">
                  Issue Date
                </label>
                <input
                  type="date"
                  value={issueDate}
                  onChange={e => setIssueDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900"
                />
              </div>

              {/* Citation / Description */}
              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-500 font-semibold block mb-1">
                  Official Citation / Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Citation text detailing achievements or completed curriculum modules..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900"
                />
              </div>

              {/* Document Attachment Upload */}
              <div>
                <label className="text-[10px] font-mono uppercase text-zinc-500 font-semibold block mb-1">
                  Upload Certificate File (PDF / Image / Scan)
                </label>
                <label className="border-2 border-dashed border-zinc-300 hover:border-zinc-400 rounded-xl p-3.5 flex flex-col items-center justify-center gap-1.5 cursor-pointer bg-zinc-50/50 hover:bg-zinc-50 transition-colors">
                  <Upload className="w-5 h-5 text-zinc-400" />
                  <span className="text-xs text-zinc-600 font-medium">
                    {fileName ? fileName : 'Drag & drop certificate document or click to browse'}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    Supported: PDF, PNG, JPG (Digital hash verified upon submission)
                  </span>
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    className="hidden"
                    onChange={e => {
                      if (e.target.files?.[0]) {
                        setFileName(e.target.files[0].name);
                      }
                    }}
                  />
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsIssueModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl border border-zinc-200 text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                >
                  {isSubmitting ? 'Issuing...' : 'Authorize & Issue Certificate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upcoming Feature Modal on Preview Click */}
      {showUpcomingModal && (
        <div
          id="admin-certificate-upcoming-modal"
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setShowUpcomingModal(false)}
        >
          <div
            id="admin-certificate-upcoming-card"
            className="bg-white rounded-3xl max-w-lg w-full p-10 sm:p-14 text-center shadow-xl border border-[#ded8cb] relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              type="button"
              id="admin-certificate-upcoming-close-btn"
              onClick={() => setShowUpcomingModal(false)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-700 rounded-full hover:bg-zinc-100 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <p
              id="admin-certificate-preview-upcoming-text"
              className="text-2xl sm:text-3xl font-serif font-medium text-[#141b22] tracking-normal leading-relaxed"
            >
              This is an upcoming user work
            </p>
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                id="admin-certificate-upcoming-dismiss-btn"
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
