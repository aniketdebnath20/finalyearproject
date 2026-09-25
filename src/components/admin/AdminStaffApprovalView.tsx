import React, { useState } from 'react';
import { useUniversity } from '../../context/UniversityContext';
import {
  Clock,
  CheckCircle2,
  XCircle,
  Calendar
} from 'lucide-react';
import { truncateEmail } from '../../utils/formatters';

export const AdminStaffApprovalView: React.FC = () => {
  const { staffAttendance, staffList, departments, reviewStaffAttendance } = useUniversity();

  // Remarks state mapped by record id
  const [remarksState, setRemarksState] = useState<Record<string, string>>({});

  const handleAction = (id: string, decision: 'Approved' | 'Rejected') => {
    const remark = remarksState[id] || (decision === 'Approved' ? 'Verified against biometric registrar logs.' : 'Incomplete hours log.');
    reviewStaffAttendance(id, decision, remark);
  };

  const handleRemarkChange = (id: string, text: string) => {
    setRemarksState(prev => ({ ...prev, [id]: text }));
  };

  // Only show staff attendance records awaiting approval
  const pendingAttendance = staffAttendance
    .filter(a => {
      const staff = staffList.find(s => s.id === a.staffId);
      if (!staff) return false;
      return a.approvalStatus === 'Pending';
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const pendingCount = pendingAttendance.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200">
              Staff Attendance Approval
            </span>
          </div>
          <h1 className="text-2xl font-serif font-semibold text-zinc-900 tracking-tight">
            Staff Attendance Approval
          </h1>
          <p className="text-xs text-zinc-500 font-mono">
            Review pending faculty attendance approval messages and endorse submissions
          </p>
        </div>

        {pendingCount > 0 ? (
          <div className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs font-mono flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            {pendingCount} Pending Approvals
          </div>
        ) : (
          <div className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            All Submissions Endorsed
          </div>
        )}
      </div>

      {/* Attendance Approval Cards / List */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)] overflow-hidden">
        {pendingAttendance.length === 0 ? (
          <div className="p-12 text-center text-zinc-400 font-mono text-xs">
            <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
            <p className="text-zinc-700 font-medium text-sm">No Pending Staff Approval Messages</p>
            <p className="text-zinc-400 text-xs mt-1">All staff attendance submissions have been reviewed and approved.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100 max-h-[calc(100vh-14rem)] overflow-y-auto overscroll-contain pr-1 custom-scrollbar scroll-smooth">
            {pendingAttendance.map(entry => {
              const staff = staffList.find(s => s.id === entry.staffId);
              const dept = departments.find(d => d.id === staff?.departmentId);
              const currentRemark = remarksState[entry.id] ?? entry.adminRemarks ?? '';
              const staffApprovalMessage = entry.remarks || entry.note || 'Regular academic lectures and faculty duties.';

              return (
                <div key={entry.id} className="p-4 sm:p-5 hover:bg-zinc-50/50 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Faculty Details */}
                    <div className="flex items-start gap-3.5 flex-1 min-w-0">
                      <img
                        src={staff?.profilePhoto}
                        alt={staff?.staffName}
                        className="w-10 h-10 rounded-md object-cover border border-zinc-200 bg-zinc-100 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h2 className="text-xs font-semibold text-zinc-900">{staff?.staffName}</h2>
                          {staff?.email && (
                            <span className="text-[10px] text-zinc-400 font-mono" title={staff.email}>
                              {truncateEmail(staff.email, 24)}
                            </span>
                          )}
                          <span className="font-mono text-[10px] text-zinc-500">
                            {staff?.staffId}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded border bg-amber-50 text-amber-700 border-amber-200">
                            {entry.approvalStatus}
                          </span>
                        </div>

                        <div className="text-[11px] text-zinc-500 flex flex-wrap items-center gap-x-2.5 gap-y-0.5 mt-1 font-mono">
                          <span>{dept?.name}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-zinc-400" /> {entry.date}
                          </span>
                          <span>•</span>
                          <span>
                            {entry.checkInTime} – {entry.checkOutTime} ({entry.totalHours} hrs)
                          </span>
                          <span>•</span>
                          <span className="text-zinc-700 font-medium">Logged: {entry.status}</span>
                        </div>

                        {/* Staff Approval Message */}
                        <div className="mt-2.5 p-3 rounded-lg bg-zinc-50 border border-zinc-200 text-xs">
                          <div className="text-[10px] font-mono uppercase text-zinc-500 font-medium mb-0.5">
                            Staff Approval Message
                          </div>
                          <div className="text-zinc-800 italic font-sans">
                            &ldquo;{staffApprovalMessage}&rdquo;
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action & Remarks Controls */}
                    <div className="lg:w-80 shrink-0 flex flex-col gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-zinc-100">
                      <input
                        type="text"
                        value={currentRemark}
                        onChange={e => handleRemarkChange(entry.id, e.target.value)}
                        placeholder="Audit notation / remarks..."
                        className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900 font-sans"
                      />

                      <div className="flex items-center gap-2 justify-end">
                        <button
                          type="button"
                          onClick={() => handleAction(entry.id, 'Rejected')}
                          className="flex items-center gap-1 px-3 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer border bg-white text-rose-700 hover:bg-rose-50 border-rose-200"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </button>

                        <button
                          type="button"
                          onClick={() => handleAction(entry.id, 'Approved')}
                          className="flex items-center gap-1 px-3.5 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer border bg-zinc-900 text-white hover:bg-zinc-800 border-zinc-900"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Endorse
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
