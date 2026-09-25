import React from 'react';
import type { Student } from '../../types';
import { useUniversity } from '../../context/UniversityContext';
import { X, Mail, Phone, MapPin, Calendar, BookOpen, GraduationCap, CheckCircle } from 'lucide-react';
import { truncateEmail } from '../../utils/formatters';

interface StudentProfileModalProps {
  student: Student | null;
  onClose: () => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({ student, onClose }) => {
  const { departments, courses, getStudentAttendanceSummary, getStudentGPA, getStudentFees } = useUniversity();

  if (!student) return null;

  const dept = departments.find(d => d.id === student.departmentId);
  const course = courses.find(c => c.id === student.courseId);
  const attendance = getStudentAttendanceSummary(student.id);
  const gpaStats = getStudentGPA(student.id);
  const feeRecord = getStudentFees(student.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-xl shadow-xl border border-zinc-200 overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-500 font-medium">
              Student Record Dossier
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Profile Card & Avatar */}
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <img
              src={student.profilePhoto}
              alt={student.fullName}
              className="w-18 h-18 rounded-lg object-cover border border-zinc-200 bg-zinc-100"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-serif font-semibold text-zinc-900">{student.fullName}</h2>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-medium ${
                  student.accountStatus === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-zinc-100 text-zinc-700'
                }`}>
                  {student.accountStatus}
                </span>
              </div>
              <div className="text-[11px] text-zinc-400 font-mono mt-0.5" title={student.email}>
                {truncateEmail(student.email, 24)}
              </div>
              <div className="text-xs text-zinc-500 font-mono mt-1">
                Roll No: <strong className="text-zinc-800">{student.rollNumber}</strong> &nbsp;|&nbsp; ID: {student.studentId}
              </div>
              <div className="text-xs text-zinc-500 mt-0.5">
                {course?.courseName} • {dept?.name}
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 my-5 p-3 rounded-lg bg-zinc-50 border border-zinc-200/80">
            <div className="text-center">
              <span className="text-[10px] font-mono text-zinc-400 uppercase block">Attendance</span>
              <span className="text-base font-mono font-semibold text-zinc-900">
                {attendance.overallPercentage}%
              </span>
            </div>
            <div className="text-center border-x border-zinc-200">
              <span className="text-[10px] font-mono text-zinc-400 uppercase block">Cumulative GPA</span>
              <span className="text-base font-mono font-semibold text-zinc-900">{gpaStats.cgpa} / 10</span>
            </div>
            <div className="text-center">
              <span className="text-[10px] font-mono text-zinc-400 uppercase block">Tuition Ledger</span>
              <span className="text-xs font-medium text-zinc-800 block mt-0.5">
                {feeRecord?.paymentStatus || 'Pending'}
              </span>
            </div>
          </div>

          {/* Academic & Personal Details */}
          <div className="space-y-3.5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 rounded-lg border border-zinc-200 bg-white">
                <span className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">Academic Status</span>
                <span className="font-medium text-zinc-900 block">Batch {student.academicYear}</span>
                <span className="text-zinc-500 text-[11px]">Admitted {student.admissionDate}</span>
              </div>
              <div className="p-3 rounded-lg border border-zinc-200 bg-white">
                <span className="text-[10px] font-mono text-zinc-400 uppercase block mb-1">Contact Email</span>
                <span className="font-mono text-zinc-900 block truncate">{student.email}</span>
                <span className="text-zinc-500 text-[11px] font-mono">Tel: {student.phone}</span>
              </div>
            </div>

            {/* Personal Details */}
            <div className="p-3.5 rounded-lg border border-zinc-200 bg-zinc-50/50 space-y-2 text-zinc-700">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                <span>Date of Birth: <strong className="font-mono">{student.dateOfBirth}</strong> ({student.gender})</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                <span className="truncate">{student.address}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-zinc-100 flex justify-end">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Close Dossier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
