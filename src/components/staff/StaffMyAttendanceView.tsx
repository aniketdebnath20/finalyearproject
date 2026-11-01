import React, { useState, useRef, useEffect } from 'react';
import { useUniversity } from '../../context/UniversityContext';
import type{ StaffAttendanceStatus } from '../../types';
import {
  Clock,
  Calendar,
  CheckCircle2,
  XCircle,
  Send,
  ArrowUp
} from 'lucide-react';

export const StaffMyAttendanceView: React.FC = () => {
  const { currentStaff, staffAttendance, submitStaffAttendance } = useUniversity();

  const today = new Date().toISOString().split('T')[0];

  const [date, setDate] = useState(today);
  const [checkInTime, setCheckInTime] = useState('');
  const [checkOutTime, setCheckOutTime] = useState('');
  const [status, setStatus] = useState<StaffAttendanceStatus>('Present');
  const [note, setNote] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState(false);

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

  // Filter attendance for current faculty member
  const myHistory = staffAttendance
    .filter(a => a.staffId === (currentStaff?.id || ''))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  useEffect(() => {
    handleScroll();
  }, [myHistory.length]);

  if (!currentStaff) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    submitStaffAttendance({
      staffId: currentStaff.id,
      date,
      checkInTime,
      checkOutTime,
      status,
      note
    });

    setSubmittedMessage(true);
    setTimeout(() => setSubmittedMessage(false), 5000);
  };

  return (
    <div className="h-[calc(100vh-9.5rem)] max-h-[calc(100vh-9.5rem)] flex flex-col overflow-hidden w-full space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-zinc-200 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200">
              Faculty Timesheet
            </span>
          </div>
          <h1 className="text-2xl font-serif font-semibold text-zinc-900 tracking-tight">
            Biometric Check-In & Work Log
          </h1>
          <p className="text-xs text-zinc-500 font-mono">
            Submit daily university work logs for central administrative approval
          </p>
        </div>
      </div>

      {/* Submission Card */}
      <div className="bg-white rounded-xl p-4 border border-zinc-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)] space-y-3 shrink-0">
        <div className="border-b border-zinc-100 pb-2 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-serif font-semibold text-zinc-900">
              Daily Attendance Log
            </h2>
            <p className="text-[11px] text-zinc-500 font-mono">
              New submissions queue for central administrative review.
            </p>
          </div>
          {submittedMessage && (
            <div className="px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              Status queued for Admin Endorsement.
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {/* Date */}
            <div>
              <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">Date</label>
              <div className="relative">
                <Calendar className="w-3.5 h-3.5 absolute left-3 top-3 text-zinc-400" />
                <input
                  type="date"
                  required
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs font-mono rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                />
              </div>
            </div>

            {/* Check-In Time */}
            <div>
              <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">Check-In Time</label>
              <div className="relative">
                <Clock className="w-3.5 h-3.5 absolute left-3 top-3 text-zinc-400" />
                <input
                  type="time"
                  required
                  value={checkInTime}
                  onChange={e => setCheckInTime(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs font-mono rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                />
              </div>
            </div>

            {/* Check-Out Time */}
            <div>
              <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">Check-Out Time</label>
              <div className="relative">
                <Clock className="w-3.5 h-3.5 absolute left-3 top-3 text-zinc-400" />
                <input
                  type="time"
                  required
                  value={checkOutTime}
                  onChange={e => setCheckOutTime(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs font-mono rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as StaffAttendanceStatus)}
                className="w-full py-1.5 px-3 text-xs rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
              >
                <option value="Present">Present (Campus)</option>
                <option value="Half Day">Half Day</option>
                <option value="Work From Home">Work From Home</option>
                <option value="Leave">Official Leave</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex-1 w-full">
              <input
                type="text"
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Teaching note / tasks completed (e.g. Conducted labs, examinations)..."
                className="w-full px-3 py-1.5 text-xs rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900 font-sans"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-1.5 text-xs font-medium rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white transition-colors cursor-pointer shrink-0 shadow-2xs"
            >
              <Send className="w-3.5 h-3.5" /> Submit Log
            </button>
          </div>
        </form>
      </div>

      {/* Attendance History Table */}
      <div className="relative flex-1 min-h-0 flex flex-col bg-white rounded-xl border border-zinc-200 shadow-2xs overflow-hidden">
        {/* Top Fade Indicator */}
        <div
          className={`pointer-events-none absolute top-14 left-0 right-0 h-6 bg-gradient-to-b from-white to-transparent z-10 transition-opacity duration-200 ${
            isScrolledTop ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <div className="p-3.5 border-b border-zinc-100 flex items-center justify-between shrink-0 bg-zinc-50/50">
          <div>
            <h2 className="text-sm font-serif font-semibold text-zinc-900">Attendance Log History</h2>
            <p className="text-[11px] text-zinc-500 font-mono">Records submitted for administrative verification</p>
          </div>
          <span className="text-xs text-zinc-500 font-mono bg-white px-2 py-0.5 rounded border border-zinc-200">
            {myHistory.length} Entries
          </span>
        </div>

        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-x-auto overflow-y-auto overscroll-contain pr-1 custom-scrollbar scroll-smooth"
        >
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 z-10 bg-zinc-50 shadow-2xs text-zinc-400 font-mono font-medium border-b border-zinc-200 text-[10px] uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 min-w-[90px]">Date</th>
                <th className="py-3 px-4 min-w-[85px]">Check-In</th>
                <th className="py-3 px-4 min-w-[85px]">Check-Out</th>
                <th className="py-3 px-4 min-w-[70px]">Hours</th>
                <th className="py-3 px-4 min-w-[100px]">Work Status</th>
                <th className="py-3 px-4 min-w-[130px]">Admin Endorsement</th>
                <th className="py-3 px-4">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 font-sans">
              {myHistory.map(entry => (
                <tr key={entry.id} className="hover:bg-zinc-50/60 transition-colors">
                  <td className="py-3 px-4 font-mono text-zinc-900 font-medium whitespace-nowrap">
                    {entry.date}
                  </td>
                  <td className="py-3 px-4 text-zinc-600 font-mono whitespace-nowrap">
                    {entry.checkInTime}
                  </td>
                  <td className="py-3 px-4 text-zinc-600 font-mono whitespace-nowrap">
                    {entry.checkOutTime}
                  </td>
                  <td className="py-3 px-4 font-mono text-zinc-800 whitespace-nowrap">
                    {entry.totalHours} hrs
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-100 text-zinc-700 border border-zinc-200">
                      {entry.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono ${
                      entry.approvalStatus === 'Approved'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : entry.approvalStatus === 'Pending'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {entry.approvalStatus === 'Approved' ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      ) : entry.approvalStatus === 'Pending' ? (
                        <Clock className="w-3 h-3 text-amber-600" />
                      ) : (
                        <XCircle className="w-3 h-3 text-rose-600" />
                      )}
                      {entry.approvalStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-zinc-500 text-[11px] max-w-xs truncate">
                    {entry.adminRemarks || '—'}
                  </td>
                </tr>
              ))}
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
        <div className="px-4 py-3 bg-zinc-50/90 border-t border-zinc-100 flex items-center justify-between text-xs font-mono text-zinc-500 shrink-0">
          <span>{currentStaff.staffName} ({currentStaff.staffId})</span>
          <span className="text-[11px] text-zinc-400">Institutional Timesheet Ledger</span>
        </div>
      </div>
    </div>
  );
};
