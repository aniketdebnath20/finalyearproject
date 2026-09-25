import React from 'react';
import { useUniversity } from '../../context/UniversityContext';
import {
  BookOpen,
  Briefcase,
  CheckCircle2,
  Building2
} from 'lucide-react';

export const StaffProfileView: React.FC = () => {
  const { currentStaff, departments, subjects } = useUniversity();

  if (!currentStaff) return null;

  const dept = departments.find(d => d.id === currentStaff.departmentId);
  const assignedSubs = subjects.filter(s => s.staffId === currentStaff.id);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200">
              Tutor Registry
            </span>
          </div>
          <h1 className="text-2xl font-serif font-semibold text-zinc-900 tracking-tight">
            Faculty & Tutor Profile
          </h1>
          <p className="text-xs text-zinc-500 font-mono">
            Authenticated instructor record registered at Apex Classes
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono bg-zinc-100 text-zinc-800 border border-zinc-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Status: {currentStaff.accountStatus}
        </span>
      </div>

      {/* Main Dossier Card */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)] p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-6 border-b border-zinc-100">
          <div className="flex items-center gap-4">
            <img
              src={currentStaff.profilePhoto}
              alt={currentStaff.staffName}
              className="w-20 h-20 rounded-lg object-cover border border-zinc-200 bg-zinc-100"
            />
            <div>
              <h2 className="text-2xl font-serif font-semibold text-zinc-900">
                {currentStaff.staffName}
              </h2>
              <div className="text-xs text-zinc-600 mt-0.5 font-medium">
                {currentStaff.designation} • Department of {dept?.name}
              </div>
              <div className="text-xs text-zinc-500 font-mono mt-1">
                Staff ID: <strong className="text-zinc-900">{currentStaff.staffId}</strong> &nbsp;|&nbsp; {currentStaff.qualification}
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-zinc-50 rounded-lg border border-zinc-200/80 text-center min-w-[130px]">
            <span className="text-[10px] uppercase font-mono text-zinc-400 tracking-wider block">Assigned Batches</span>
            <span className="text-2xl font-mono font-semibold text-zinc-900">{assignedSubs.length}</span>
            <span className="text-[10px] text-zinc-500 block font-mono">Classes Active</span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Academic Appointment */}
          <div className="p-5 rounded-lg border border-zinc-200 bg-white space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-semibold flex items-center gap-2">
              <Briefcase className="w-3.5 h-3.5 text-zinc-400" /> Faculty Appointment
            </h3>

            <div className="space-y-2 text-xs divide-y divide-zinc-100">
              <div className="flex justify-between py-1.5 first:pt-0">
                <span className="text-zinc-500">Stream / Department</span>
                <span className="font-medium text-zinc-900">{dept?.name}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-zinc-500">Official Designation</span>
                <span className="font-medium text-zinc-900">{currentStaff.designation}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-zinc-500">Highest Degree / Qualification</span>
                <span className="font-medium text-zinc-900">{currentStaff.qualification}</span>
              </div>
              <div className="flex justify-between py-1.5 last:pb-0">
                <span className="text-zinc-500">Joining Date</span>
                <span className="font-mono text-zinc-900">{currentStaff.joiningDate}</span>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="p-5 rounded-lg border border-zinc-200 bg-white space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-semibold flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5 text-zinc-400" /> Instructor Contact
            </h3>

            <div className="space-y-2 text-xs divide-y divide-zinc-100">
              <div className="flex justify-between py-1.5 first:pt-0">
                <span className="text-zinc-500">Staff Email</span>
                <span className="font-mono font-medium text-zinc-900 truncate max-w-[200px]">{currentStaff.email}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-zinc-500">Direct Contact</span>
                <span className="font-mono text-zinc-900">{currentStaff.phone}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-zinc-500">Office / Classroom</span>
                <span className="text-zinc-800">Apex Block 2, Rm 304</span>
              </div>
              <div className="flex justify-between py-1.5 last:pb-0">
                <span className="text-zinc-500">Doubt Clearing Hours</span>
                <span className="font-mono text-zinc-800">Mon - Thu, 14:00 – 16:00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Assigned Curriculums */}
        <div className="p-5 rounded-lg border border-zinc-200 bg-white space-y-3">
          <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-500 font-semibold flex items-center gap-2">
            <BookOpen className="w-3.5 h-3.5 text-zinc-400" /> Current Teaching Assignments
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {assignedSubs.map(s => (
              <div key={s.id} className="p-3 rounded-lg bg-zinc-50 border border-zinc-200/80 flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium text-zinc-900">{s.subjectName}</div>
                  <div className="text-[10px] text-zinc-400 font-mono">{s.subjectCode} • Semester {s.semester}</div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-zinc-700 border border-zinc-200">
                  {s.credits} Credits
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
