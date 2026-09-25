import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useUniversity } from '../../context/UniversityContext';
import type{ Student, Staff } from '../../types';
import {
  CalendarCheck2,
  Calendar,
  Search,
  User,
  Users,
  Clock,
  ExternalLink,
  ArrowUp
} from 'lucide-react';
import { MasterViewSkeleton } from '../common/Skeleton';
import { truncateEmail } from '../../utils/formatters';
import {
  StudentAttendanceCalendarModal,
  StaffAttendanceCalendarModal
} from './AttendanceCalendarModal';

interface AdminAttendanceViewProps {
  onSelectStudent?: (studentId: string) => void;
  isLoading?: boolean;
}

export const AdminAttendanceView: React.FC<AdminAttendanceViewProps> = ({
  onSelectStudent,
  isLoading
}) => {
  const {
    students,
    courses,
    staffList,
    departments,
    staffAttendance,
    getStudentAttendanceSummary,
    isDataLoading
  } = useUniversity();

  const [activeSegment, setActiveSegment] = useState<'students' | 'staff'>('students');

  // Student scroll state
  const studentScrollRef = useRef<HTMLDivElement>(null);
  const [isStudentScrolledTop, setIsStudentScrolledTop] = useState(false);
  const [canStudentScrollBottom, setCanStudentScrollBottom] = useState(false);

  const handleStudentScroll = () => {
    const el = studentScrollRef.current;
    if (!el) return;
    setIsStudentScrolledTop(el.scrollTop > 16);
    setCanStudentScrollBottom(el.scrollHeight - el.scrollTop - el.clientHeight > 12);
  };

  const scrollToStudentTop = () => {
    if (studentScrollRef.current) {
      studentScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Staff scroll state
  const staffScrollRef = useRef<HTMLDivElement>(null);
  const [isStaffScrolledTop, setIsStaffScrolledTop] = useState(false);
  const [canStaffScrollBottom, setCanStaffScrollBottom] = useState(false);

  const handleStaffScroll = () => {
    const el = staffScrollRef.current;
    if (!el) return;
    setIsStaffScrolledTop(el.scrollTop > 16);
    setCanStaffScrollBottom(el.scrollHeight - el.scrollTop - el.clientHeight > 12);
  };

  const scrollToStaffTop = () => {
    if (staffScrollRef.current) {
      staffScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // --- Student Attendance States ---
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [selectedStudentForCalendar, setSelectedStudentForCalendar] = useState<Student | null>(null);

  // --- Staff Attendance States ---
  const [staffSearchTerm, setStaffSearchTerm] = useState('');
  const [selectedStaffForCalendar, setSelectedStaffForCalendar] = useState<Staff | null>(null);

  // Student Attendance Calculations
  const studentAttendanceData = useMemo(() => {
    return students.map(student => {
      const summary = getStudentAttendanceSummary(student.id);
      const course = courses.find(c => c.id === student.courseId);

      return {
        student,
        summary,
        course
      };
    });
  }, [students, courses, getStudentAttendanceSummary]);

  // Filtered Students
  const filteredStudents = useMemo(() => {
    const q = studentSearchTerm.trim().toLowerCase();
    return studentAttendanceData.filter(({ student, course }) => {
      if (!q) return true;
      const name = student.fullName.toLowerCase();
      const roll = student.rollNumber.toLowerCase();
      const id = (student.studentId || '').toLowerCase();
      const courseName = (course?.courseName || '').toLowerCase();
      const courseCode = (course?.courseCode || '').toLowerCase();

      return name.includes(q) || roll.includes(q) || id.includes(q) || courseName.includes(q) || courseCode.includes(q);
    });
  }, [studentAttendanceData, studentSearchTerm]);

  // Filtered Staff Attendance
  const filteredStaffAttendance = useMemo(() => {
    const q = staffSearchTerm.trim().toLowerCase();
    return staffAttendance
      .filter(record => {
        if (!q) return true;
        const staff = staffList.find(s => s.id === record.staffId);
        const staffName = (staff?.staffName || '').toLowerCase();
        const staffId = (staff?.staffId || '').toLowerCase();
        const dept = departments.find(d => d.id === staff?.departmentId);
        const deptName = (dept?.name || '').toLowerCase();

        return staffName.includes(q) || staffId.includes(q) || deptName.includes(q);
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [staffAttendance, staffList, departments, staffSearchTerm]);

  // Calculate staff attendance rate
  const staffAttendanceMap = useMemo(() => {
    const map = new Map<string, number>();
    staffList.forEach(staff => {
      const records = staffAttendance.filter(r => r.staffId === staff.id);
      if (records.length === 0) {
        map.set(staff.id, 96);
      } else {
        const presentCount = records.filter(r => r.status === 'Present').length;
        const partialCount = records.filter(r => r.status === 'Late' || r.status === 'Half Day').length;
        const effectivePresent = presentCount + partialCount * 0.5;
        const pct = Math.min(100, Math.round((effectivePresent / records.length) * 100));
        map.set(staff.id, pct);
      }
    });
    return map;
  }, [staffList, staffAttendance]);

  useEffect(() => {
    handleStudentScroll();
  }, [filteredStudents, activeSegment]);

  useEffect(() => {
    handleStaffScroll();
  }, [filteredStaffAttendance, activeSegment]);

  if (isLoading || isDataLoading) {
    return <MasterViewSkeleton role="admin" activeTab="attendance" />;
  }

  return (
    <div
      id="admin-attendance-view"
      className="h-[calc(100vh-9.5rem)] max-h-[calc(100vh-9.5rem)] flex flex-col overflow-hidden w-full"
    >
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200 font-semibold flex items-center gap-1">
              <CalendarCheck2 className="w-3 h-3" /> Registrar Biometrics Desk
            </span>
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200">
              Institutional Attendance
            </span>
          </div>
          <h1 className="text-2xl font-serif font-semibold text-zinc-900 tracking-tight">
            Institutional Attendance Register
          </h1>
          <p className="text-xs text-zinc-500 font-mono">
            Monitor and audit student and faculty/staff attendance records
          </p>
        </div>

        {/* Segmented Tab Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-zinc-200/80 border border-zinc-300 self-start sm:self-auto shrink-0">
          <button
            type="button"
            id="tab-student-attendance"
            onClick={() => setActiveSegment('students')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
              activeSegment === 'students'
                ? 'bg-white text-zinc-900 shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Student Attendance</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-100 text-zinc-700">
              {students.length}
            </span>
          </button>

          <button
            type="button"
            id="tab-staff-attendance"
            onClick={() => setActiveSegment('staff')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer flex items-center gap-2 ${
              activeSegment === 'staff'
                ? 'bg-white text-zinc-900 shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Staff Attendance</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-100 text-zinc-700">
              {staffList.length}
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. STUDENT ATTENDANCE SECTION                             */}
      {/* ========================================================= */}
      {activeSegment === 'students' && (
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden space-y-3 pt-3">
          {/* Search Bar Only */}
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between shrink-0">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
              <input
                id="search-student-attendance-input"
                type="text"
                value={studentSearchTerm}
                onChange={e => setStudentSearchTerm(e.target.value)}
                placeholder="Search scholar by name, roll number, course, or student ID..."
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-white border border-zinc-200 shadow-2xs focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all placeholder:text-zinc-400"
              />
              {studentSearchTerm && (
                <button
                  type="button"
                  onClick={() => setStudentSearchTerm('')}
                  className="absolute right-3 top-2.5 text-xs text-zinc-400 hover:text-zinc-700 px-1 py-0.5 rounded cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Student Attendance Table with Scroll Effect */}
          <div className="relative flex-1 min-h-0 flex flex-col bg-white rounded-xl border border-zinc-200 shadow-2xs overflow-hidden">
            {/* Top Fade Indicator */}
            <div
              className={`pointer-events-none absolute top-10 left-0 right-0 h-6 bg-gradient-to-b from-white to-transparent z-10 transition-opacity duration-200 ${
                isStudentScrolledTop ? 'opacity-100' : 'opacity-0'
              }`}
            />

            <div
              ref={studentScrollRef}
              onScroll={handleStudentScroll}
              className="flex-1 overflow-x-auto overflow-y-auto overscroll-contain pr-1 custom-scrollbar scroll-smooth"
            >
              <table className="w-full text-left text-xs border-collapse">
                <thead className="sticky top-0 z-10 bg-zinc-50 shadow-2xs border-b border-zinc-200">
                  <tr className="text-[10px] font-mono uppercase text-zinc-500">
                    <th className="py-3 px-4 font-semibold">Scholar</th>
                    <th className="py-3 px-4 font-semibold">Course</th>
                    <th className="py-3 px-4 font-semibold text-center">Attendance %</th>
                    {onSelectStudent && (
                      <th className="py-3 px-4 font-semibold text-right">Profile</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={onSelectStudent ? 4 : 3} className="py-12 text-center text-zinc-400">
                        <Users className="w-8 h-8 mx-auto mb-2 text-zinc-300" />
                        <p className="text-xs font-medium text-zinc-600">No student attendance records found</p>
                        <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                          Try adjusting your search query.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map(({ student, summary, course }) => (
                      <tr key={student.id} className="hover:bg-zinc-50/80 transition-colors">
                        {/* Scholar */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={student.profilePhoto}
                              alt={student.fullName}
                              className="w-8 h-8 rounded-full object-cover border border-zinc-200 shrink-0"
                            />
                            <div className="min-w-0">
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
                                Roll: {student.rollNumber} • ID: {student.studentId}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Course (Semester removed) */}
                        <td className="py-3.5 px-4">
                          <span className="font-medium text-zinc-900 block text-xs">
                            {course?.courseName || course?.courseCode || 'General Program'}
                          </span>
                        </td>

                        {/* Attendance % & Progress Bar & Calendar Button */}
                        <td className="py-3.5 px-4 text-center">
                          <div className="inline-flex items-center justify-center gap-2.5">
                            <div className="inline-flex flex-col items-center">
                              <span
                                className={`font-mono text-sm font-bold ${
                                  summary.overallPercentage >= 80
                                    ? 'text-emerald-700'
                                    : summary.overallPercentage >= 75
                                    ? 'text-amber-700'
                                    : 'text-rose-700'
                                }`}
                              >
                                {summary.overallPercentage}%
                              </span>
                              <div className="w-20 bg-zinc-200 rounded-full h-1.5 mt-1 overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    summary.overallPercentage >= 80
                                      ? 'bg-emerald-500'
                                      : summary.overallPercentage >= 75
                                      ? 'bg-amber-500'
                                      : 'bg-rose-500'
                                  }`}
                                  style={{ width: `${Math.min(100, summary.overallPercentage)}%` }}
                                />
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setSelectedStudentForCalendar(student)}
                              className="p-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-blue-50 hover:border-blue-300 text-zinc-500 hover:text-blue-600 transition-colors shadow-2xs cursor-pointer"
                              title="Open Student Attendance Calendar"
                              aria-label="Open Student Attendance Calendar"
                            >
                              <Calendar className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>

                        {/* Profile Dossier Action */}
                        {onSelectStudent && (
                          <td className="py-3.5 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => onSelectStudent(student.id)}
                              className="p-1.5 text-zinc-400 hover:text-blue-600 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer inline-flex items-center gap-1 text-xs"
                              title="View Student Dossier"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              <span className="font-mono text-[11px]">Dossier</span>
                            </button>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Bottom Fade Indicator */}
            <div
              className={`pointer-events-none absolute bottom-12 left-0 right-0 h-8 bg-gradient-to-t from-white to-transparent z-10 transition-opacity duration-200 ${
                canStudentScrollBottom ? 'opacity-100' : 'opacity-0'
              }`}
            />

            {/* Floating Quick Scroll to Top Action */}
            {isStudentScrolledTop && (
              <button
                type="button"
                onClick={scrollToStudentTop}
                className="absolute bottom-14 right-4 z-20 flex items-center gap-1 px-3 py-1.5 rounded-full bg-zinc-900/90 hover:bg-zinc-900 text-white text-xs font-medium shadow-md transition-all backdrop-blur-xs cursor-pointer"
                aria-label="Scroll to top"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span className="text-[11px]">Top</span>
              </button>
            )}

            <div className="px-4 py-3 border-t border-zinc-100 bg-zinc-50/90 flex items-center justify-between text-xs font-mono text-zinc-500 shrink-0">
              <span>
                Showing {filteredStudents.length} of {students.length} scholars
              </span>
              <span className="text-[11px] text-zinc-400">
                Institutional Academic Standing
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. STAFF ATTENDANCE SECTION                               */}
      {/* ========================================================= */}
      {activeSegment === 'staff' && (
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden space-y-3 pt-3">
          {/* Search Bar Only */}
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between shrink-0">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
              <input
                id="search-staff-attendance-input"
                type="text"
                value={staffSearchTerm}
                onChange={e => setStaffSearchTerm(e.target.value)}
                placeholder="Search staff member by name, staff ID, or department..."
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-white border border-zinc-200 shadow-2xs focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all placeholder:text-zinc-400"
              />
              {staffSearchTerm && (
                <button
                  type="button"
                  onClick={() => setStaffSearchTerm('')}
                  className="absolute right-3 top-2.5 text-xs text-zinc-400 hover:text-zinc-700 px-1 py-0.5 rounded cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Staff Attendance Table with Scroll Effect */}
          <div className="relative flex-1 min-h-0 flex flex-col bg-white rounded-xl border border-zinc-200 shadow-2xs overflow-hidden">
            {/* Top Fade Indicator */}
            <div
              className={`pointer-events-none absolute top-10 left-0 right-0 h-6 bg-gradient-to-b from-white to-transparent z-10 transition-opacity duration-200 ${
                isStaffScrolledTop ? 'opacity-100' : 'opacity-0'
              }`}
            />

            <div
              ref={staffScrollRef}
              onScroll={handleStaffScroll}
              className="flex-1 overflow-x-auto overflow-y-auto overscroll-contain pr-1 custom-scrollbar scroll-smooth"
            >
              <table className="w-full text-left text-xs border-collapse">
                <thead className="sticky top-0 z-10 bg-zinc-50 shadow-2xs border-b border-zinc-200">
                  <tr className="text-[10px] font-mono uppercase text-zinc-500">
                    <th className="py-3 px-4 font-semibold">Faculty / Staff</th>
                    <th className="py-3 px-4 font-semibold">Date & Logged Hours</th>
                    <th className="py-3 px-4 font-semibold">Timing (In – Out)</th>
                    <th className="py-3 px-4 font-semibold text-center">Attendance %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {filteredStaffAttendance.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-zinc-400">
                        <Calendar className="w-8 h-8 mx-auto mb-2 text-zinc-300" />
                        <p className="text-xs font-medium text-zinc-600">No staff attendance logs found</p>
                        <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                          Try adjusting your search query.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredStaffAttendance.map(record => {
                      const staff = staffList.find(s => s.id === record.staffId);
                      const dept = departments.find(d => d.id === staff?.departmentId);
                      const staffPct = staff ? staffAttendanceMap.get(staff.id) ?? 95 : 95;

                      return (
                        <tr key={record.id} className="hover:bg-zinc-50/80 transition-colors">
                          {/* Staff Member */}
                          <td className="py-3.5 px-4">
                            {staff ? (
                              <div className="flex items-center gap-2.5">
                                <img
                                  src={staff.profilePhoto}
                                  alt={staff.staffName}
                                  className="w-8 h-8 rounded-full object-cover border border-zinc-200 shrink-0"
                                />
                                <div className="min-w-0">
                                  <span className="font-semibold text-zinc-900 block truncate">
                                    {staff.staffName}
                                  </span>
                                  {staff.email && (
                                    <div className="text-[10px] text-zinc-400 font-mono" title={staff.email}>
                                      {truncateEmail(staff.email, 24)}
                                    </div>
                                  )}
                                  <div className="text-[11px] text-zinc-500 font-mono flex items-center gap-1.5">
                                    <span>ID: {staff.staffId}</span>
                                    <span>•</span>
                                    <span>{dept?.name || 'Department'}</span>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <span className="text-zinc-400 font-mono text-xs">Unknown Staff</span>
                            )}
                          </td>

                          {/* Date & Hours */}
                          <td className="py-3.5 px-4">
                            <div className="font-medium text-zinc-900 text-xs">{record.date}</div>
                            <div className="text-[11px] text-zinc-500 font-mono mt-0.5 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-zinc-400" />
                              <span>{record.totalHours ? `${record.totalHours} hrs logged` : 'Standard shift'}</span>
                            </div>
                          </td>

                          {/* Timing In - Out */}
                          <td className="py-3.5 px-4 font-mono text-xs text-zinc-700">
                            {record.checkInTime || '09:00'} – {record.checkOutTime || '17:00'}
                          </td>

                          {/* Attendance % Column with Calendar Action */}
                          <td className="py-3.5 px-4 text-center">
                            <div className="inline-flex items-center justify-center gap-2.5">
                              <div className="inline-flex flex-col items-center">
                                <span
                                  className={`font-mono text-xs font-bold ${
                                    staffPct >= 85
                                      ? 'text-emerald-700'
                                      : staffPct >= 75
                                      ? 'text-amber-700'
                                      : 'text-rose-700'
                                  }`}
                                >
                                  {staffPct}%
                                </span>
                                <div className="w-16 bg-zinc-200 rounded-full h-1.5 mt-1 overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${
                                      staffPct >= 85
                                        ? 'bg-emerald-500'
                                        : staffPct >= 75
                                        ? 'bg-amber-500'
                                        : 'bg-rose-500'
                                    }`}
                                    style={{ width: `${Math.min(100, staffPct)}%` }}
                                  />
                                </div>
                              </div>
                              {staff && (
                                <button
                                  type="button"
                                  onClick={() => setSelectedStaffForCalendar(staff)}
                                  className="p-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-emerald-50 hover:border-emerald-300 text-zinc-500 hover:text-emerald-700 transition-colors shadow-2xs cursor-pointer"
                                  title="Open Staff Attendance Calendar"
                                  aria-label="Open Staff Attendance Calendar"
                                >
                                  <Calendar className="w-3.5 h-3.5" />
                                </button>
                              )}
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
                canStaffScrollBottom ? 'opacity-100' : 'opacity-0'
              }`}
            />

            {/* Floating Quick Scroll to Top Action */}
            {isStaffScrolledTop && (
              <button
                type="button"
                onClick={scrollToStaffTop}
                className="absolute bottom-14 right-4 z-20 flex items-center gap-1 px-3 py-1.5 rounded-full bg-zinc-900/90 hover:bg-zinc-900 text-white text-xs font-medium shadow-md transition-all backdrop-blur-xs cursor-pointer"
                aria-label="Scroll to top"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span className="text-[11px]">Top</span>
              </button>
            )}

            <div className="px-4 py-3 border-t border-zinc-100 bg-zinc-50/90 flex items-center justify-between text-xs font-mono text-zinc-500 shrink-0">
              <span>
                Showing {filteredStaffAttendance.length} of {staffAttendance.length} staff attendance records
              </span>
              <span className="text-[11px] text-zinc-400">
                Official faculty daily biometric log
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Student Attendance Calendar Modal */}
      {selectedStudentForCalendar && (
        <StudentAttendanceCalendarModal
          student={selectedStudentForCalendar}
          onClose={() => setSelectedStudentForCalendar(null)}
        />
      )}

      {/* Staff Attendance Calendar Modal */}
      {selectedStaffForCalendar && (
        <StaffAttendanceCalendarModal
          staff={selectedStaffForCalendar}
          onClose={() => setSelectedStaffForCalendar(null)}
        />
      )}
    </div>
  );
};
