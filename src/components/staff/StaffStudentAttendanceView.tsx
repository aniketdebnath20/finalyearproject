import React, { useState, useRef } from 'react';
import { useUniversity } from '../../context/UniversityContext';
import type{ AttendanceStatus } from '../../types';
import {
  Calendar,
  BookOpen,
  CheckCircle2,
  Save,
  ArrowUp
} from 'lucide-react';
import { truncateEmail } from '../../utils/formatters';

export const StaffStudentAttendanceView: React.FC = () => {
  const {
    currentStaff,
    currentUser,
    courses,
    subjects,
    students,
    studentAttendance,
    markStudentAttendance
  } = useUniversity();

  const today = new Date().toISOString().split('T')[0];

  // Filters
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    subjects.find(s => s.staffId === currentStaff?.id)?.id || subjects[0]?.id || ''
  );
  const effectiveSubjectId = selectedSubjectId || subjects.find(s => s.staffId === currentStaff?.id)?.id || subjects[0]?.id || '';
  const selectionKey = `${selectedDate}:${effectiveSubjectId}`;

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

  const selectedSubject = subjects.find(s => s.id === effectiveSubjectId);

  // Filter students for this course & semester
  const relevantStudents = students.filter(
    s => (!selectedSubject?.courseId || s.courseId === selectedSubject.courseId) &&
         (!selectedSubject?.semester || s.semester === selectedSubject.semester)
  );

  const [selectionOverrides, setSelectionOverrides] = useState<{ key: string; statuses: Record<string, AttendanceStatus> }>({ key: '', statuses: {} });
  const [savedSelectionKey, setSavedSelectionKey] = useState('');
  const savedRecords = studentAttendance.filter(record => record.date === selectedDate && record.subjectId === effectiveSubjectId);
  const attendanceState: Record<string, AttendanceStatus | ''> = Object.fromEntries(relevantStudents.map(student => {
    const savedStatus = savedRecords.find(record => record.studentId === student.id)?.status || '';
    const override = selectionOverrides.key === selectionKey ? selectionOverrides.statuses[student.id] : undefined;
    return [student.id, override || savedStatus];
  }));
  const isSaved = savedSelectionKey === selectionKey;

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setSelectionOverrides(previous => ({
      key: selectionKey,
      statuses: { ...(previous.key === selectionKey ? previous.statuses : {}), [studentId]: status }
    }));
    setSavedSelectionKey('');
  };

  const handleMarkAllPresent = () => {
    const updated: Record<string, AttendanceStatus> = {};
    relevantStudents.forEach(st => {
      updated[st.id] = 'Present';
    });
    setSelectionOverrides({ key: selectionKey, statuses: updated });
    setSavedSelectionKey('');
  };

  const handleSaveAttendance = () => {
    if (!selectedSubject) return;

    Object.entries(attendanceState).forEach(([studentId, status]) => {
      if (!status) return;
      markStudentAttendance({
        studentId,
        subjectId: selectedSubject.id,
        date: selectedDate,
        status,
        markedByStaffId: currentUser?.id || ''
      });
    });

    setSavedSelectionKey(selectionKey);
    setTimeout(() => setSavedSelectionKey(''), 4000);
  };

  return (
    <div className="h-[calc(100vh-9.5rem)] max-h-[calc(100vh-9.5rem)] flex flex-col overflow-hidden w-full space-y-3">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200 shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200">
              Biometric Attendance
            </span>
          </div>
          <h1 className="text-2xl font-serif font-semibold text-zinc-900 tracking-tight">
            Classroom Attendance Register
          </h1>
          <p className="text-xs text-zinc-500 font-mono">
            Record student lecture presence and update official institutional ledgers
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleMarkAllPresent}
            className="flex-1 sm:flex-none px-3.5 py-2 text-xs font-medium rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 transition-colors cursor-pointer text-center shadow-2xs"
          >
            Mark All Present
          </button>
          <button
            type="button"
            onClick={handleSaveAttendance}
            disabled={!selectedSubject || !Object.values(attendanceState).some(Boolean)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white shadow-2xs transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" /> Commit Attendance
          </button>
        </div>
      </div>

      {/* Control Selector Card */}
      <div className="bg-white p-3.5 rounded-xl border border-zinc-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)] grid grid-cols-1 sm:grid-cols-3 gap-3 shrink-0">
        <div>
          <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">Lecture Date</label>
          <div className="relative">
            <Calendar className="w-3.5 h-3.5 absolute left-3 top-3 text-zinc-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs font-mono rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className="text-[10px] font-mono uppercase text-zinc-500 block mb-1">Course Module & Semester</label>
          <div className="relative">
            <BookOpen className="w-3.5 h-3.5 absolute left-3 top-3 text-zinc-400" />
            <select
              value={effectiveSubjectId}
              onChange={e => setSelectedSubjectId(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-900"
            >
              {subjects.map(s => {
                const c = courses.find(cr => cr.id === s.courseId);
                return (
                  <option key={s.id} value={s.id}>
                    {s.subjectCode} — {s.subjectName} ({c?.courseName} • Sem {s.semester})
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>

      {isSaved && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2 shrink-0">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          Attendance committed and synced with student biometric registry for {selectedDate}.
        </div>
      )}

      {/* Student Roster Table for Attendance Marking */}
      <div className="relative flex-1 min-h-0 flex flex-col bg-white rounded-xl border border-zinc-200 shadow-2xs overflow-hidden">
        {/* Top Fade Indicator */}
        <div
          className={`pointer-events-none absolute top-14 left-0 right-0 h-6 bg-gradient-to-b from-white to-transparent z-10 transition-opacity duration-200 ${
            isScrolledTop ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <div className="p-3.5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50 shrink-0">
          <div>
            <h2 className="text-sm font-serif font-semibold text-zinc-900">
              Student Attendance Entry — {relevantStudents.length} Scholars
            </h2>
            <p className="text-[11px] text-zinc-500 font-mono">
              Module: {selectedSubject?.subjectName} ({selectedSubject?.subjectCode})
            </p>
          </div>
          <span className="text-xs font-mono font-medium text-zinc-700 bg-white px-2 py-0.5 rounded border border-zinc-200">
            Date: {selectedDate}
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
                <th className="py-3 px-4 min-w-[100px]">Roll</th>
                <th className="py-3 px-4 min-w-[180px]">Student</th>
                <th className="py-3 px-4 text-center min-w-[85px]">Present</th>
                <th className="py-3 px-4 text-center min-w-[85px]">Absent</th>
                <th className="py-3 px-4 text-center min-w-[85px]">Late</th>
                <th className="py-3 px-4 text-center min-w-[85px]">Excused</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 font-sans">
              {relevantStudents.map(student => {
                const currentStatus = attendanceState[student.id] || '';

                return (
                  <tr key={student.id} className="hover:bg-zinc-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono text-zinc-700 text-[11px]">
                      {student.rollNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={student.profilePhoto}
                          alt={student.fullName}
                          className="w-7 h-7 rounded-md object-cover border border-zinc-200"
                        />
                        <div>
                          <div className="font-medium text-zinc-900">{student.fullName}</div>
                          <div className="text-[10px] text-zinc-400 font-mono" title={student.email}>
                            {truncateEmail(student.email, 24)}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Status Selectors */}
                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(student.id, 'Present')}
                        className={`px-3 py-1 rounded-md text-xs font-mono transition-colors cursor-pointer ${
                          currentStatus === 'Present'
                            ? 'bg-zinc-900 text-white font-medium'
                            : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200/70'
                        }`}
                      >
                        Present
                      </button>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(student.id, 'Absent')}
                        className={`px-3 py-1 rounded-md text-xs font-mono transition-colors cursor-pointer ${
                          currentStatus === 'Absent'
                            ? 'bg-rose-600 text-white font-medium'
                            : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200/70'
                        }`}
                      >
                        Absent
                      </button>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(student.id, 'Late')}
                        className={`px-3 py-1 rounded-md text-xs font-mono transition-colors cursor-pointer ${
                          currentStatus === 'Late'
                            ? 'bg-amber-600 text-white font-medium'
                            : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200/70'
                        }`}
                      >
                        Late
                      </button>
                    </td>

                    <td className="py-3 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(student.id, 'Half Day')}
                        className={`px-3 py-1 rounded-md text-xs font-mono transition-colors cursor-pointer ${
                          currentStatus === 'Half Day'
                            ? 'bg-zinc-800 text-white font-medium'
                            : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200/70'
                        }`}
                      >
                        Excused
                      </button>
                    </td>
                  </tr>
                );
              })}
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
          <span>{relevantStudents.length} Students enrolled in {selectedSubject?.subjectCode || 'Module'}</span>
          <span className="text-[11px] text-zinc-400">Department Biometric Registry</span>
        </div>
      </div>
    </div>
  );
};
