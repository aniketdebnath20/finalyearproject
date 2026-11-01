import React, { useState, useMemo } from 'react';
import type { Student, Staff } from '../../types';
import { useUniversity } from '../../context/UniversityContext';
import {
  X,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Check
} from 'lucide-react';

const TODAY = new Date();
const CURRENT_ACADEMIC_YEAR = TODAY.getFullYear();
const CURRENT_ACADEMIC_MONTH = TODAY.getMonth();
const TODAY_STR = TODAY.toISOString().slice(0, 10);

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// =========================================================================
// 1. STUDENT ATTENDANCE CALENDAR MODAL (Simplified & Modern Design)
// =========================================================================
interface StudentAttendanceCalendarModalProps {
  student: Student | null;
  onClose: () => void;
}

export const StudentAttendanceCalendarModal: React.FC<StudentAttendanceCalendarModalProps> = ({
  student,
  onClose
}) => {
  const { studentAttendance } = useUniversity();

  const [currentYear, setCurrentYear] = useState(CURRENT_ACADEMIC_YEAR);
  const [currentMonth, setCurrentMonth] = useState(CURRENT_ACADEMIC_MONTH);
  const studentId = student?.id;

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
  };

  const jumpToToday = () => {
    setCurrentYear(CURRENT_ACADEMIC_YEAR);
    setCurrentMonth(CURRENT_ACADEMIC_MONTH);
  };

  // Calendar days generation
  const { calendarGrid, monthStats } = useMemo(() => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    // Normalize to Monday = 0, Sunday = 6
    const startingDayOffset = (firstDayIndex + 6) % 7;

    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    interface DayInfo {
      dayNumber: number;
      dateStr: string;
      isCurrentMonth: boolean;
      isWeekend: boolean;
      isToday: boolean;
      isFuture: boolean;
      status?: 'Present' | 'Absent';
    }

    const grid: DayInfo[] = [];

    // Previous month padding
    for (let i = startingDayOffset - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const prevM = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevY = currentMonth === 0 ? currentYear - 1 : currentYear;
      const dateStr = `${prevY}-${String(prevM + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayOfWeek = new Date(prevY, prevM, d).getDay();
      grid.push({
        dayNumber: d,
        dateStr,
        isCurrentMonth: false,
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
        isToday: dateStr === TODAY_STR,
        isFuture: dateStr > TODAY_STR
      });
    }

    let presentCount = 0;
    let absentCount = 0;
    let workingDaysCount = 0;
    let recordedDaysCount = 0;

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayOfWeek = new Date(currentYear, currentMonth, d).getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isToday = dateStr === TODAY_STR;
      const isFuture = dateStr > TODAY_STR;

      let status: 'Present' | 'Absent' | undefined = undefined;

      if (!isWeekend && !isFuture) {
        workingDaysCount++;

        // Check real student attendance context
        const existingRecord = studentAttendance.find(
          r => r.studentId === studentId && r.date === dateStr
        );

        if (existingRecord) {
          recordedDaysCount++;
          status = existingRecord.status === 'Absent' || existingRecord.status === 'Half Day' ? 'Absent' : 'Present';
        }

        if (status === 'Present') presentCount++;
        if (status === 'Absent') absentCount++;
      }

      grid.push({
        dayNumber: d,
        dateStr,
        isCurrentMonth: true,
        isWeekend,
        isToday,
        isFuture,
        status
      });
    }

    // Next month padding to fill grid
    const remainingSlots = (7 - (grid.length % 7)) % 7;
    for (let d = 1; d <= remainingSlots; d++) {
      const nextM = currentMonth === 11 ? 0 : currentMonth + 1;
      const nextY = currentMonth === 11 ? currentYear + 1 : currentYear;
      const dateStr = `${nextY}-${String(nextM + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayOfWeek = new Date(nextY, nextM, d).getDay();
      grid.push({
        dayNumber: d,
        dateStr,
        isCurrentMonth: false,
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
        isToday: dateStr === TODAY_STR,
        isFuture: true
      });
    }

    const percentage = recordedDaysCount > 0 ? Math.round((presentCount / recordedDaysCount) * 100) : 0;

    return {
      calendarGrid: grid,
      monthStats: {
        workingDays: workingDaysCount,
        present: presentCount,
        absent: absentCount,
        percentage
      }
    };
  }, [currentYear, currentMonth, studentId, studentAttendance]);

  if (!student) return null;

  const isCurrentMonthView =
    currentYear === CURRENT_ACADEMIC_YEAR && currentMonth === CURRENT_ACADEMIC_MONTH;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-sm sm:max-w-md rounded-2xl shadow-xl border border-zinc-200/80 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="student-attendance-title"
      >
        {/* Simple & Nice Header - No student details (no photo, no ID, no roll number, no course, no email) */}
        <div className="px-5 py-3.5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 id="student-attendance-title" className="text-sm font-bold text-zinc-900 leading-none">
                Student Attendance
              </h2>
              <p className="text-[11px] text-zinc-500 font-medium mt-0.5">
                {student.fullName}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Month Navigation & Clean Stats Bar */}
        <div className="px-5 pt-3 pb-2.5 flex items-center justify-between gap-2 border-b border-zinc-100 bg-white">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1 rounded-lg hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-zinc-800 min-w-[115px] text-center font-sans">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="p-1 rounded-lg hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {!isCurrentMonthView && (
              <button
                type="button"
                onClick={jumpToToday}
                className="ml-1 px-2 py-0.5 text-[10px] font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors cursor-pointer"
              >
                Today
              </button>
            )}
          </div>

          {/* Simple summary chips */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-[11px] font-semibold text-blue-700 font-mono">
              <Check className="w-3 h-3 text-blue-600 stroke-[3]" />
              <span>{monthStats.present}</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 border border-rose-100 text-[11px] font-semibold text-rose-700 font-mono">
              <Check className="w-3 h-3 text-rose-600 stroke-[3]" />
              <span>{monthStats.absent}</span>
            </div>
          </div>
        </div>

        {/* Clean Calendar Grid */}
        <div className="p-4 sm:p-5">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
            {DAYS_OF_WEEK.map(day => (
              <div key={day} className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 py-1 font-mono">
                {day}
              </div>
            ))}
          </div>

          {/* Days Cells */}
          <div className="grid grid-cols-7 gap-1.5">
            {calendarGrid.map((day, idx) => {
              if (!day.isCurrentMonth) {
                return (
                  <div
                    key={`pad-${idx}`}
                    className="aspect-square rounded-xl p-1 flex flex-col items-center justify-center opacity-25"
                  >
                    <span className="text-[11px] font-medium text-zinc-400">{day.dayNumber}</span>
                  </div>
                );
              }

              return (
                <div
                  key={`day-${day.dateStr}`}
                  className={`aspect-square rounded-xl p-1 flex flex-col items-center justify-between border transition-all ${
                    day.isToday
                      ? 'border-blue-400 bg-blue-50/20 shadow-2xs'
                      : 'border-zinc-100 hover:border-zinc-200 bg-white'
                  }`}
                >
                  {/* Date number */}
                  <span
                    className={`text-[11px] font-medium leading-none mt-0.5 ${
                      day.isToday
                        ? 'font-bold text-blue-600'
                        : day.isWeekend
                        ? 'text-zinc-400'
                        : 'text-zinc-700'
                    }`}
                  >
                    {day.dayNumber}
                  </span>

                  {/* Attendance status tick indicator */}
                  <div className="w-full flex items-center justify-center mb-0.5">
                    {day.status === 'Present' && (
                      <div
                        className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-xs"
                        title="Present (Blue Tick)"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[2.75]" />
                      </div>
                    )}

                    {day.status === 'Absent' && (
                      <div
                        className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-xs"
                        title="Absent (Red Tick)"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[2.75]" />
                      </div>
                    )}

                    {day.isWeekend && (
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-200" title="Weekend" />
                    )}

                    {day.isFuture && !day.isWeekend && (
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-150" title="Upcoming" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modern & Simple Legend Footer */}
        <div className="px-5 py-3 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-zinc-600">
              <div className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-2xs">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              <span className="text-[11px] font-medium">Present</span>
            </div>

            <div className="flex items-center gap-1.5 text-zinc-600">
              <div className="w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-2xs">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              <span className="text-[11px] font-medium">Absent</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 text-[11px] font-medium transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

// =========================================================================
// 2. STAFF ATTENDANCE CALENDAR MODAL (Simplified & Modern Design)
// =========================================================================
interface StaffAttendanceCalendarModalProps {
  staff: Staff | null;
  onClose: () => void;
}

export const StaffAttendanceCalendarModal: React.FC<StaffAttendanceCalendarModalProps> = ({
  staff,
  onClose
}) => {
  const { staffAttendance } = useUniversity();

  const [currentYear, setCurrentYear] = useState(CURRENT_ACADEMIC_YEAR);
  const [currentMonth, setCurrentMonth] = useState(CURRENT_ACADEMIC_MONTH);
  const staffId = staff?.id;

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
  };

  const jumpToToday = () => {
    setCurrentYear(CURRENT_ACADEMIC_YEAR);
    setCurrentMonth(CURRENT_ACADEMIC_MONTH);
  };

  // Calendar days generation
  const { calendarGrid, monthStats } = useMemo(() => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const startingDayOffset = (firstDayIndex + 6) % 7;
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    interface StaffDayInfo {
      dayNumber: number;
      dateStr: string;
      isCurrentMonth: boolean;
      isWeekend: boolean;
      isToday: boolean;
      isFuture: boolean;
      status?: 'Present' | 'Half Day' | 'Absent';
    }

    const grid: StaffDayInfo[] = [];

    // Previous month padding
    for (let i = startingDayOffset - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      const prevM = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevY = currentMonth === 0 ? currentYear - 1 : currentYear;
      const dateStr = `${prevY}-${String(prevM + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayOfWeek = new Date(prevY, prevM, d).getDay();
      grid.push({
        dayNumber: d,
        dateStr,
        isCurrentMonth: false,
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
        isToday: dateStr === TODAY_STR,
        isFuture: dateStr > TODAY_STR
      });
    }

    let presentCount = 0;
    let halfDayCount = 0;
    let absentCount = 0;
    let workingDaysCount = 0;
    let recordedDaysCount = 0;

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayOfWeek = new Date(currentYear, currentMonth, d).getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isToday = dateStr === TODAY_STR;
      const isFuture = dateStr > TODAY_STR;

      let status: 'Present' | 'Half Day' | 'Absent' | undefined = undefined;

      if (!isWeekend && !isFuture) {
        workingDaysCount++;

        // Check real staff attendance context
        const existingRecord = staffAttendance.find(
          r => r.staffId === staffId && r.date === dateStr
        );

        if (existingRecord) {
          recordedDaysCount++;
          if (existingRecord.status === 'Half Day' || existingRecord.status === 'Half-Day') {
            status = 'Half Day';
          } else if (existingRecord.status === 'Leave' || (existingRecord.status as string) === 'Absent') {
            status = 'Absent';
          } else {
            status = 'Present';
          }
        }

        if (status === 'Present') presentCount++;
        if (status === 'Half Day') halfDayCount++;
        if (status === 'Absent') absentCount++;
      }

      grid.push({
        dayNumber: d,
        dateStr,
        isCurrentMonth: true,
        isWeekend,
        isToday,
        isFuture,
        status
      });
    }

    // Next month padding
    const remainingSlots = (7 - (grid.length % 7)) % 7;
    for (let d = 1; d <= remainingSlots; d++) {
      const nextM = currentMonth === 11 ? 0 : currentMonth + 1;
      const nextY = currentMonth === 11 ? currentYear + 1 : currentYear;
      const dateStr = `${nextY}-${String(nextM + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayOfWeek = new Date(nextY, nextM, d).getDay();
      grid.push({
        dayNumber: d,
        dateStr,
        isCurrentMonth: false,
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
        isToday: dateStr === TODAY_STR,
        isFuture: true
      });
    }

    const percentage = recordedDaysCount > 0
      ? Math.round(((presentCount + halfDayCount * 0.5) / recordedDaysCount) * 100)
      : 0;

    return {
      calendarGrid: grid,
      monthStats: {
        workingDays: workingDaysCount,
        present: presentCount,
        halfDay: halfDayCount,
        absent: absentCount,
        percentage
      }
    };
  }, [currentYear, currentMonth, staffId, staffAttendance]);

  if (!staff) return null;

  const isCurrentMonthView =
    currentYear === CURRENT_ACADEMIC_YEAR && currentMonth === CURRENT_ACADEMIC_MONTH;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div
        className="bg-white w-full max-w-sm sm:max-w-md rounded-2xl shadow-xl border border-zinc-200/80 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="staff-attendance-title"
      >
        {/* Simple & Nice Header - No staff details (no photo, no ID, no department, no designation, no email) */}
        <div className="px-5 py-3.5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 id="staff-attendance-title" className="text-sm font-bold text-zinc-900 leading-none">
                Staff Attendance
              </h2>
              <p className="text-[11px] text-zinc-500 font-medium mt-0.5">
                {staff.staffName}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Month Navigation & Clean Stats Bar */}
        <div className="px-5 pt-3 pb-2.5 flex items-center justify-between gap-2 border-b border-zinc-100 bg-white">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1 rounded-lg hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-zinc-800 min-w-[115px] text-center font-sans">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="p-1 rounded-lg hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {!isCurrentMonthView && (
              <button
                type="button"
                onClick={jumpToToday}
                className="ml-1 px-2 py-0.5 text-[10px] font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors cursor-pointer"
              >
                Today
              </button>
            )}
          </div>

          {/* Simple summary chips */}
          <div className="flex items-center gap-1">
            <div
              className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-[10px] font-semibold text-emerald-700 font-mono"
              title="Present"
            >
              <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
              <span>{monthStats.present}</span>
            </div>
            <div
              className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-blue-50 border border-blue-100 text-[10px] font-semibold text-blue-700 font-mono"
              title="Half Day"
            >
              <Check className="w-3 h-3 text-blue-600 stroke-[3]" />
              <span>{monthStats.halfDay}</span>
            </div>
            <div
              className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-rose-50 border border-rose-100 text-[10px] font-semibold text-rose-700 font-mono"
              title="Absent"
            >
              <Check className="w-3 h-3 text-rose-600 stroke-[3]" />
              <span>{monthStats.absent}</span>
            </div>
          </div>
        </div>

        {/* Clean Calendar Grid */}
        <div className="p-4 sm:p-5">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1.5">
            {DAYS_OF_WEEK.map(day => (
              <div key={day} className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 py-1 font-mono">
                {day}
              </div>
            ))}
          </div>

          {/* Days Cells */}
          <div className="grid grid-cols-7 gap-1.5">
            {calendarGrid.map((day, idx) => {
              if (!day.isCurrentMonth) {
                return (
                  <div
                    key={`pad-${idx}`}
                    className="aspect-square rounded-xl p-1 flex flex-col items-center justify-center opacity-25"
                  >
                    <span className="text-[11px] font-medium text-zinc-400">{day.dayNumber}</span>
                  </div>
                );
              }

              return (
                <div
                  key={`day-${day.dateStr}`}
                  className={`aspect-square rounded-xl p-1 flex flex-col items-center justify-between border transition-all ${
                    day.isToday
                      ? 'border-emerald-400 bg-emerald-50/20 shadow-2xs'
                      : 'border-zinc-100 hover:border-zinc-200 bg-white'
                  }`}
                >
                  {/* Date number */}
                  <span
                    className={`text-[11px] font-medium leading-none mt-0.5 ${
                      day.isToday
                        ? 'font-bold text-emerald-600'
                        : day.isWeekend
                        ? 'text-zinc-400'
                        : 'text-zinc-700'
                    }`}
                  >
                    {day.dayNumber}
                  </span>

                  {/* Attendance status tick indicator */}
                  <div className="w-full flex items-center justify-center mb-0.5">
                    {day.status === 'Present' && (
                      <div
                        className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs"
                        title="Present (Green Tick)"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[2.75]" />
                      </div>
                    )}

                    {day.status === 'Half Day' && (
                      <div
                        className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-xs"
                        title="Half Day (Blue Tick)"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[2.75]" />
                      </div>
                    )}

                    {day.status === 'Absent' && (
                      <div
                        className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-xs"
                        title="Absent (Red Tick)"
                      >
                        <Check className="w-3.5 h-3.5 stroke-[2.75]" />
                      </div>
                    )}

                    {day.isWeekend && (
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-200" title="Weekend" />
                    )}

                    {day.isFuture && !day.isWeekend && (
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-150" title="Upcoming" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modern & Simple Legend Footer */}
        <div className="px-5 py-3 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1 text-zinc-600">
              <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-2xs">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              <span className="text-[11px] font-medium">Present</span>
            </div>

            <div className="flex items-center gap-1 text-zinc-600">
              <div className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-2xs">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              <span className="text-[11px] font-medium">Half Day</span>
            </div>

            <div className="flex items-center gap-1 text-zinc-600">
              <div className="w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-2xs">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              <span className="text-[11px] font-medium">Absent</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 text-[11px] font-medium transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
