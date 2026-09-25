import React from 'react';
import { useUniversity } from '../../context/UniversityContext';
import { GraduationCap, ShieldCheck, Briefcase, X, ArrowRight } from 'lucide-react';
import type { UserRole } from '../../types';

interface SwitchPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchPortal?: (role: UserRole) => void;
}

export const SwitchPortalModal: React.FC<SwitchPortalModalProps> = ({ isOpen, onClose, onSwitchPortal }) => {
  const { activeRole, quickLogin, students, staffList } = useUniversity();

  if (!isOpen) return null;

  const handleSelectRole = (role: UserRole, targetId?: string) => {
    quickLogin(role, targetId);
    if (onSwitchPortal) onSwitchPortal(role);
    onClose();
  };

  const sampleStudent = students[0];
  const sampleStaff = staffList[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="relative w-full max-w-lg bg-[#f7f4ed] rounded-2xl shadow-2xl border border-[#e4dfd5] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#e4dfd5] bg-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#f4be5c] flex items-center justify-center text-[#1a232d] shadow-xs">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-base text-[#1a232d] tracking-tight">
                Switch Classes Portal
              </h2>
              <p className="text-xs text-zinc-500 font-sans">
                Experience the 3 tailored workspace views shown in the reference design
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Portal Choices */}
        <div className="p-6 space-y-3">
          {/* 1. Student Portal */}
          <button
            onClick={() => handleSelectRole('student', sampleStudent?.id)}
            className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group cursor-pointer ${
              activeRole === 'student'
                ? 'bg-white border-[#f4be5c] shadow-sm ring-1 ring-[#f4be5c]'
                : 'bg-white border-[#eae5dc] hover:border-[#f4be5c] hover:shadow-xs'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#e6f4f2] text-[#0d9488] flex items-center justify-center shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#1a232d]">Student Portal</span>
                  {activeRole === 'student' && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#f4be5c] text-[#1a232d] font-semibold">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Academic day, upcoming exams, fee balance & notifications (Alex Vance)
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-[#1a232d] group-hover:translate-x-0.5 transition-all shrink-0" />
          </button>

          {/* 2. Faculty Workspace */}
          <button
            onClick={() => handleSelectRole('staff', sampleStaff?.id)}
            className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group cursor-pointer ${
              activeRole === 'staff'
                ? 'bg-white border-[#f4be5c] shadow-sm ring-1 ring-[#f4be5c]'
                : 'bg-white border-[#eae5dc] hover:border-[#f4be5c] hover:shadow-xs'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#fef3c7] text-[#d97706] flex items-center justify-center shrink-0">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#1a232d]">Faculty Workspace</span>
                  {activeRole === 'staff' && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#f4be5c] text-[#1a232d] font-semibold">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Faculty desk, assigned scholars, attendance tracking & grade evaluation
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-[#1a232d] group-hover:translate-x-0.5 transition-all shrink-0" />
          </button>

          {/* 3. Administration */}
          <button
            onClick={() => handleSelectRole('admin')}
            className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group cursor-pointer ${
              activeRole === 'admin'
                ? 'bg-white border-[#f4be5c] shadow-sm ring-1 ring-[#f4be5c]'
                : 'bg-white border-[#eae5dc] hover:border-[#f4be5c] hover:shadow-xs'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#eff3f8] text-[#475569] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#1a232d]">Administration</span>
                  {activeRole === 'admin' && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#f4be5c] text-[#1a232d] font-semibold">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Registrar executive desk, university admissions, treasury & staff oversight
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-[#1a232d] group-hover:translate-x-0.5 transition-all shrink-0" />
          </button>
        </div>

        <div className="px-6 py-3.5 bg-zinc-100/70 border-t border-[#e4dfd5] text-[11px] font-mono text-zinc-500 flex items-center justify-between">
          <span>* Instant session switch without re-authentication</span>
          <button
            onClick={onClose}
            className="text-zinc-600 hover:text-zinc-900 font-sans font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
